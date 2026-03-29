import { useState } from 'react';
import { useCryptoPrices } from '../hooks/useCryptoPrices';

interface CryptoPurchaseFormProps {
  onAddPurchase: (asset: string, amountUSDT: number, price: number, date: string) => void;
}

export function CryptoPurchaseForm({ onAddPurchase }: CryptoPurchaseFormProps) {
  const { prices, loading, refetch } = useCryptoPrices();
  const [asset, setAsset] = useState('BTC');
  const [amountUSDT, setAmountUSDT] = useState(100);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPrice = prices[asset] || 0;
    if (currentPrice > 0) {
      onAddPurchase(
        asset,
        amountUSDT,
        currentPrice,
        new Date().toISOString()
      );
      // Optional success feedback
    } else {
      alert("Error: Precio no disponible en este momento.");
    }
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '24px', background: 'var(--gold-gradient)', borderRadius: '4px', display: 'inline-block' }}></span>
          Registrar Compra Spot
        </div>
        <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', height: 'auto' }} onClick={refetch} disabled={loading}>
          {loading ? 'Cargando...' : 'Actualizar Precios'}
        </button>
      </h3>

      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--surface-light)', borderRadius: '8px', borderLeft: '4px solid var(--gold-secondary)' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Monto Actual de <strong className="text-gold-secondary">{asset}</strong>:</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0 0 0' }}>
          ${prices[asset] ? prices[asset].toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 }) : '---'}
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div className="form-group">
            <label className="form-label">Criptomoneda (Asset)</label>
            <select 
              className="form-input" 
              value={asset}
              onChange={e => setAsset(e.target.value)}
            >
              <option value="BTC">Bitcoin (BTC)</option>
              <option value="ETH">Ethereum (ETH)</option>
              <option value="SOL">Solana (SOL)</option>
              <option value="BNB">Binance Coin (BNB)</option>
              <option value="USDT">Tether (USDT)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Inversión en USDT</label>
            <input 
              type="number" 
              className="form-input" 
              value={amountUSDT}
              onChange={e => setAmountUSDT(parseFloat(e.target.value))}
              step="0.01" min="0.1" required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading || !prices[asset]}>
          Confirmar Compra ({prices[asset] ? (amountUSDT / prices[asset]).toFixed(6) : 0} {asset})
        </button>
      </form>
    </div>
  );
}
