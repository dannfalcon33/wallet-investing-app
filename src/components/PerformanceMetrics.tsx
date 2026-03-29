interface PerformanceMetricsProps {
  metrics: {
    winRate: number;
    realizedPnl: number;
    unrealizedPnl: number;
    totalPnl: number;
    accountGrowth: number;
    totalTrades: number;
    openTrades: number;
  };
}

export function PerformanceMetrics({ metrics }: PerformanceMetricsProps) {
  const cards = [
    { 
      label: 'Equity Total', 
      value: `$${(metrics.totalPnl + 10000).toFixed(2)}`, // Assuming base 10k for simplicity or better logic
      subtext: `Crecimiento: ${metrics.accountGrowth.toFixed(2)}%`,
      color: metrics.accountGrowth >= 0 ? 'var(--success)' : 'var(--danger)' 
    },
    { 
      label: 'P&L Total (Neto)', 
      value: `$${metrics.totalPnl.toFixed(2)}`, 
      subtext: `Live: $${metrics.unrealizedPnl.toFixed(2)}`,
      color: metrics.totalPnl >= 0 ? 'var(--success)' : 'var(--danger)' 
    },
    { 
      label: 'Win Rate & Historial', 
      value: `${metrics.winRate.toFixed(1)}%`, 
      subtext: `${metrics.totalTrades} Trades totales`,
      color: 'var(--gold-secondary)' 
    },
    { 
      label: 'Estado de Cuenta', 
      value: metrics.openTrades > 0 ? 'EN RIESGO' : 'SIN RIESGO', 
      subtext: `${metrics.openTrades} Posiciones abiertas`,
      color: metrics.openTrades > 0 ? '#ff9800' : 'var(--success)' 
    }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
      {cards.map((card, i) => (
        <div key={i} className="card" style={{ 
          padding: '1.25rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.4rem', 
          borderTop: `3px solid ${card.color}`,
          position: 'relative',
          overflow: 'hidden'
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {card.label}
          </span>
          <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
            {card.value}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: card.color }}>
            {card.subtext}
          </span>
        </div>
      ))}
    </div>
  );
}
