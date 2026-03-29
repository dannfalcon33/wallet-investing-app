import { useCryptoPrices } from '../hooks/useCryptoPrices';
import { TrendingUp, Activity } from 'lucide-react';

export function PriceTicker() {
  const { prices, loading } = useCryptoPrices();
  
  if (loading && Object.keys(prices).length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
         <Activity size={16} className="animate-pulse" /> Cargando mercado en vivo...
      </div>
    );
  }

  const items = [
    { label: 'XAU/USD', price: prices['XAUUSD'], color: 'var(--gold-primary)' },
    { label: 'BTC', price: prices['BTC'], color: '#F7931A' },
    { label: 'ETH', price: prices['ETH'], color: '#627EEA' },
    { label: 'SOL', price: prices['SOL'], color: 'var(--gold-secondary)' },
    { label: 'BNB', price: prices['BNB'], color: '#F3BA2F' },
  ];

  return (
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-primary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', paddingRight: '1rem', borderRight: '1px solid var(--border-color)' }}>
        <TrendingUp size={16} /> Live
      </div>
      
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {items.map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: item.color }}>
               {item.price ? `$${item.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: (item.label === 'XAU/USD' || item.label === 'SOL' || item.label === 'BNB') ? 2 : 2 })}` : '---'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
