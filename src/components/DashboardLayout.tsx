import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { PriceTicker } from './PriceTicker';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'XAUUSD Trading', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Cartera Spot', path: '/portfolio', icon: Wallet },
  ];

  return (
    <div className="dashboard-layout animate-fade-in">
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/falcon_logo.png" alt="Falcon Square Logo" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
            <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Falcon<span className="text-gold-primary">Square</span></h2>
          </div>
          <button 
            className="mobile-menu-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'var(--show-menu-btn, none)' }}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav style={{ flex: 1, flexDirection: 'column', gap: '0.5rem', display: 'var(--show-nav, flex)' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link 
                key={item.path} 
                to={item.path}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.75rem 1rem', borderRadius: '8px',
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  background: isActive ? 'rgba(153, 69, 255, 0.15)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--gold-primary)' : '3px solid transparent',
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} className={isActive ? 'text-gold-primary' : ''} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Usuario</p>
              <p style={{ fontWeight: 600, color: '#fff' }}>@{user}</p>
            </div>
            <button 
              onClick={logout}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              title="Cerrar sesión"
            >
              <LogOut size={20} className="text-danger" />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <h1 style={{ fontSize: '1.75rem', margin: 0, minWidth: 'max-content' }}>
            {location.pathname === '/dashboard' ? 'Trading Dashboard' : 'Cartera Spot Cripto'}
          </h1>
          <div style={{ display: 'flex', marginLeft: 'auto' }}>
             <PriceTicker />
          </div>
        </header>
        
        {children}
      </main>
    </div>
  );
}
