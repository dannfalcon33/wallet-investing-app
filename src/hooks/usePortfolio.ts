import { useState, useEffect } from 'react';

export interface CryptoPurchase {
  id: string;
  asset: string; // 'BTC', 'ETH', 'SOL', 'BNB', 'USDT'
  amountUSDT: number;
  priceAtPurchase: number;
  amountCrypto: number;
  date: string;
}

export function usePortfolio() {
  const [purchases, setPurchases] = useState<CryptoPurchase[]>(() => {
    const saved = localStorage.getItem('falcon_crypto_portfolio');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('falcon_crypto_portfolio', JSON.stringify(purchases));
  }, [purchases]);

  const addPurchase = (asset: string, amountUSDT: number, priceAtPurchase: number, date: string) => {
    const newPurchase: CryptoPurchase = {
      id: Date.now().toString(),
      asset,
      amountUSDT,
      priceAtPurchase,
      amountCrypto: amountUSDT / priceAtPurchase,
      date
    };
    setPurchases([newPurchase, ...purchases]);
  };

  const deletePurchase = (id: string) => {
    setPurchases(purchases.filter(p => p.id !== id));
  };

  // Calculate totals
  const totalInvestedUSDT = purchases.reduce((acc, p) => acc + p.amountUSDT, 0);

  // Inventario por moneda
  const inventory = purchases.reduce((acc, p) => {
    if (!acc[p.asset]) acc[p.asset] = 0;
    acc[p.asset] += p.amountCrypto;
    return acc;
  }, {} as Record<string, number>);

  return { purchases, addPurchase, deletePurchase, totalInvestedUSDT, inventory };
}
