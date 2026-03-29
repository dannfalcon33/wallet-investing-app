import { useState } from 'react';
import type { OrderType, Trade } from '../hooks/useTrades';

interface TradeFormProps {
  onAddTrade: (trade: Omit<Trade, 'id' | 'status'>) => void;
}

export function TradeForm({ onAddTrade }: TradeFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 16),
    lotSize: 0.1,
    accountSize: 10000,
    entryPrice: 2000,
    stopLoss: 1995,
    takeProfit: 2015,
    type: 'long' as OrderType
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTrade({
      ...formData,
      date: new Date(formData.date).toISOString()
    });
    
    // Optional reset fields or show success notification
  };

  return (
    <div className="card">
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: '8px', height: '24px', background: 'var(--gold-gradient)', borderRadius: '4px', display: 'inline-block' }}></span>
        Registrar Trade XAUUSD
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          
          <div className="form-group">
            <label className="form-label">Tipo de Orden</label>
            <select 
              className="form-input" 
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value as OrderType })}
            >
              <option value="long">LONG (Compra)</option>
              <option value="short">SHORT (Venta)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Fecha y Hora</label>
            <input 
              type="datetime-local" 
              className="form-input"
              value={formData.date}
              onChange={e => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tamaño de Cuenta ($)</label>
            <input 
              type="number" 
              className="form-input" 
              value={formData.accountSize}
              onChange={e => setFormData({ ...formData, accountSize: parseFloat(e.target.value) })}
              step="100" min="0" required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Lotaje</label>
            <input 
              type="number" 
              className="form-input" 
              value={formData.lotSize}
              onChange={e => setFormData({ ...formData, lotSize: parseFloat(e.target.value) })}
              step="0.01" min="0.01" required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Precio Entrada ($)</label>
            <input 
              type="number" 
              className="form-input" 
              value={formData.entryPrice}
              onChange={e => setFormData({ ...formData, entryPrice: parseFloat(e.target.value) })}
              step="0.01" required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Stop Loss ($)</label>
            <input 
              type="number" 
              className="form-input" 
              value={formData.stopLoss}
              onChange={e => setFormData({ ...formData, stopLoss: parseFloat(e.target.value) })}
              step="0.01" required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Take Profit ($)</label>
            <input 
              type="number" 
              className="form-input" 
              value={formData.takeProfit}
              onChange={e => setFormData({ ...formData, takeProfit: parseFloat(e.target.value) })}
              step="0.01" required
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Guardar Trade
        </button>
      </form>
    </div>
  );
}
