import { DashboardLayout } from '../components/DashboardLayout';
import { PerformanceMetrics } from '../components/PerformanceMetrics';
import { TradeForm } from '../components/TradeForm';
import { TradingCalendar } from '../components/TradingCalendar';
import { NewsWidget } from '../components/NewsWidget';
import { useTrades } from '../hooks/useTrades';
import { useCryptoPrices } from '../hooks/useCryptoPrices';

export function Dashboard() {
  const { prices } = useCryptoPrices();
  const currentXauPrice = prices['XAUUSD'] || 0;
  const { trades, addTrade, closeTrade, deleteTrade, metrics } = useTrades(currentXauPrice);

  return (
    <DashboardLayout>
      <PerformanceMetrics metrics={metrics} />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Column: Form & Calendar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <TradeForm onAddTrade={addTrade} />
          <TradingCalendar 
            trades={trades} 
            onCloseTrade={closeTrade} 
            onDeleteTrade={deleteTrade} 
          />
        </div>
        
        {/* Right Column: Widgets */}
        <div>
          <NewsWidget />
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
