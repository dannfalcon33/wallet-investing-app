import { DashboardLayout } from '../components/DashboardLayout';
import { CryptoPurchaseForm } from '../components/CryptoPurchaseForm';
import { usePortfolio } from '../hooks/usePortfolio';
import { useCryptoPrices } from '../hooks/useCryptoPrices';

export function Portfolio() {
  const { purchases, addPurchase, deletePurchase, totalInvestedUSDT, inventory } = usePortfolio();
  const { prices } = useCryptoPrices();

  // Calculate current value
  let totalCurrentValue = 0;
  Object.keys(inventory).forEach(asset => {
    const currentPrice = prices[asset] || 0;
    totalCurrentValue += inventory[asset] * currentPrice;
  });

  const pnl = totalCurrentValue - totalInvestedUSDT;
  const pnlPercentage = totalInvestedUSDT > 0 ? (pnl / totalInvestedUSDT) * 100 : 0;

  return (
    <DashboardLayout>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid var(--gold-secondary)' }}>
           <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Valor Actual Cartera</span>
           <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>${totalCurrentValue.toFixed(2)}</div>
        </div>
        
        <div className="card" style={{ padding: '1.25rem', borderTop: '3px solid var(--gold-primary)' }}>
           <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Inversión Total (USDT)</span>
           <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>${totalInvestedUSDT.toFixed(2)}</div>
        </div>
        
        <div className="card" style={{ padding: '1.25rem', borderTop: `3px solid ${pnl >= 0 ? 'var(--success)' : 'var(--danger)'}` }}>
           <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>PNL Global</span>
           <div style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: pnl >= 0 ? 'var(--success)' : 'var(--danger)' }}>
             {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)} ({pnlPercentage.toFixed(2)}%)
           </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 2fr)', gap: '2rem', alignItems: 'flex-start' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <CryptoPurchaseForm onAddPurchase={addPurchase} />
          
          <div className="card">
            <h3 style={{ marginBottom: '1.5rem' }}>Inventario de Activos</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
               {Object.keys(inventory).map(asset => {
                 if(inventory[asset] <= 0) return null;
                 const value = inventory[asset] * (prices[asset] || 0);
                 return (
                   <li key={asset} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                     <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <span style={{ fontWeight: 600, color: 'var(--gold-primary)' }}>{asset}</span>
                       <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inventory[asset].toFixed(6)}</span>
                     </div>
                     <strong style={{ alignSelf: 'center' }}>${value.toFixed(2)}</strong>
                   </li>
                 )
               })}
               {Object.keys(inventory).length === 0 && <p className="text-muted">Sin activos.</p>}
            </ul>
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Historial de Compras</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Activo</th>
                  <th>Inversión (USDT)</th>
                  <th>Precio Ejecución</th>
                  <th>Cantidad Recibida</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>{new Date(purchase.date).toLocaleString()}</td>
                    <td><span className="badge" style={{ background: 'rgba(153, 69, 255, 0.2)', color: 'var(--gold-secondary)' }}>{purchase.asset}</span></td>
                    <td>${purchase.amountUSDT.toFixed(2)}</td>
                    <td>${purchase.priceAtPurchase.toLocaleString()}</td>
                    <td>{purchase.amountCrypto.toFixed(6)} {purchase.asset}</td>
                    <td>
                        <button 
                          onClick={() => {
                            if(window.confirm("¿Eliminar esta compra?")) deletePurchase(purchase.id);
                          }}
                           className="btn text-danger" style={{ background:'transparent', border:'none', padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        >
                          Revocar
                        </button>
                    </td>
                  </tr>
                ))}
                {purchases.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                      No hay compras registradas en el portafolio.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
      
      <style>{`
        @media (max-width: 1024px) {
          .dashboard-layout > main > div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
