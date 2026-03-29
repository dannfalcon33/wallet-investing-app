import { useState, useEffect } from 'react';

export type OrderType = 'long' | 'short';

export interface Trade {
  id: string;
  date: string; // ISO String
  lotSize: number;
  accountSize: number;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  type: OrderType;
  pnl?: number; // Optional profit and loss
  status: 'open' | 'closed';
}

export function useTrades(currentPrice?: number) {
  const [trades, setTrades] = useState<Trade[]>(() => {
    const saved = localStorage.getItem('falcon_trades_xauusd');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('falcon_trades_xauusd', JSON.stringify(trades));
  }, [trades]);

  const addTrade = (tradeData: Omit<Trade, 'id' | 'status'>) => {
    const newTrade: Trade = {
      ...tradeData,
      id: Date.now().toString(),
      status: 'open',
    };
    setTrades([newTrade, ...trades]);
  };

  const closeTrade = (id: string, pnl: number) => {
    setTrades(
      trades.map((t) => (t.id === id ? { ...t, status: 'closed', pnl } : t))
    );
  };
  
  const deleteTrade = (id: string) => {
    setTrades(trades.filter((t) => t.id !== id));
  }

  // Calculate metrics
  const closedTrades = trades.filter((t) => t.status === 'closed');
  const openTradesList = trades.filter((t) => t.status === 'open');
  
  const winCount = closedTrades.filter((t) => (t.pnl || 0) > 0).length;
  const winRate = closedTrades.length > 0 ? (winCount / closedTrades.length) * 100 : 0;
  
  const realizedPnl = closedTrades.reduce((acc, t) => acc + (t.pnl || 0), 0);
  
  let unrealizedPnl = 0;
  if (currentPrice && currentPrice > 0) {
    unrealizedPnl = openTradesList.reduce((acc, trade) => {
      const diff = trade.type === 'long' 
        ? (currentPrice - trade.entryPrice)
        : (trade.entryPrice - currentPrice);
      return acc + (diff * trade.lotSize * 100);
    }, 0);
  }

  const totalPnl = realizedPnl + unrealizedPnl;
  const initialAccountSize = trades.length > 0 ? trades[trades.length - 1].accountSize : 10000;
  
  const accountGrowth = initialAccountSize > 0
    ? (totalPnl / initialAccountSize) * 100
    : 0;

  return {
    trades,
    addTrade,
    closeTrade,
    deleteTrade,
    metrics: {
      winRate,
      realizedPnl,
      unrealizedPnl,
      totalPnl,
      accountGrowth,
      totalTrades: trades.length,
      openTrades: openTradesList.length
    }
  };
}
