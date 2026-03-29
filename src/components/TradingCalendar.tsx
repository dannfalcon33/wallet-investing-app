import type { Trade } from '../hooks/useTrades';
import { useCryptoPrices } from '../hooks/useCryptoPrices';

interface TradingCalendarProps {
  trades: Trade[];
  onCloseTrade: (id: string, pnl: number) => void;
  onDeleteTrade: (id: string) => void;
}

export function TradingCalendar({ trades, onCloseTrade, onDeleteTrade }: TradingCalendarProps) {
  const { prices } = useCryptoPrices();
  const currentPrice = prices['XAUUSD'] || 0;
  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: '8px', height: '24px', background: 'var(--gold-gradient)', borderRadius: '4px', display: 'inline-block' }}></span>
        Historial y Trades Activos
      </h3>

      <div style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Lotes</th>
              <th>Entrada ($)</th>
              <th>SL ($)</th>
              <th>TP ($)</th>
              <th>PNL ($)</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id}>
                <td>{new Date(trade.date).toLocaleString()}</td>
                <td>
                  <span className={`badge ${trade.type === 'long' ? 'badge-long' : 'badge-short'}`}>
                    {trade.type}
                  </span>
                </td>
                <td>{trade.lotSize}</td>
                <td>{trade.entryPrice}</td>
                <td>{trade.stopLoss}</td>
                <td>{trade.takeProfit}</td>
                <td style={{ fontWeight: 'bold' }}>
                  {trade.status === 'open' && currentPrice > 0 ? (() => {
                      const diff = trade.type === 'long' 
                        ? (currentPrice - trade.entryPrice)
                        : (trade.entryPrice - currentPrice);
                      const livePnl = diff * trade.lotSize * 100;
                      return (
                        <span style={{ color: livePnl >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                          {livePnl >= 0 ? '+' : ''}{livePnl.toFixed(2)}
                        </span>
                      );
                  })() : (
                    <span style={{ color: trade.pnl && trade.pnl > 0 ? 'var(--success)' : trade.pnl && trade.pnl < 0 ? 'var(--danger)' : 'var(--text-muted)' }}>
                      {trade.pnl !== undefined ? trade.pnl.toFixed(2) : '-'}
                    </span>
                  )}
                </td>
                <td>
                  <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: trade.status === 'open' ? 'rgba(255,165,0,0.2)' : 'rgba(255,255,255,0.1)', color: trade.status === 'open' ? 'orange' : '#fff' }}>
                    {trade.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {trade.status === 'open' ? (
                    <button 
                      onClick={() => {
                        let defaultPrompt = '0';
                        if (currentPrice > 0) {
                          const diff = trade.type === 'long' ? (currentPrice - trade.entryPrice) : (trade.entryPrice - currentPrice);
                          defaultPrompt = (diff * trade.lotSize * 100).toFixed(2);
                        }
                        const amount = window.prompt("Confirma el Profit/Loss Final para cerrar ($):", defaultPrompt);
                        if (amount !== null) {
                          onCloseTrade(trade.id, parseFloat(amount));
                        }
                      }}
                      className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', height: 'auto' }}
                    >
                      Cerrar Trade
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        if(window.confirm("¿Eliminar este registro?")) onDeleteTrade(trade.id);
                      }}
                       className="btn text-danger" style={{ background:'transparent', border:'none', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                  No hay trades registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
