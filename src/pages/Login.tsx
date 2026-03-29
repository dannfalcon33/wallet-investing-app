import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Shield, Lock } from 'lucide-react';

export function Login() {
  const [username, setUsername] = useState('Dann33');
  const [password, setPassword] = useState('compra33');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = login(username, password);
    if (success) {
      navigate('/dashboard');
    } else {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', placeItems: 'center', justifyContent: 'center', background: 'var(--bg-color)' }}>
      <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', margin: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ 
            width: '80px', height: '80px', borderRadius: '15px', 
            background: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--gold-primary)',
            display: 'flex', placeItems: 'center', justifyContent: 'center', 
            margin: '0 auto 1.5rem auto', overflow: 'hidden'
          }}>
            <img src="/falcon_logo.png" alt="Falcon Square" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <h2 style={{ fontSize: '1.5rem' }}>Bienvenido a <span className="text-gradient">Falcon Square</span></h2>
          <p className="text-muted" style={{ marginTop: '0.5rem' }}>Trading Dashboard XAUUSD & Spot</p>
        </div>

        <form onSubmit={handleLogin}>
          {error && (
            <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="username">Usuario</label>
            <input 
              id="username"
              type="text" 
              className="form-input" 
              value={username} onChange={(e) => setUsername(e.target.value)} 
              placeholder="Dann33"
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label" htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                id="password"
                type="password" 
                className="form-input" 
                value={password} onChange={(e) => setPassword(e.target.value)} 
                placeholder="compra33"
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Ingresar al Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
