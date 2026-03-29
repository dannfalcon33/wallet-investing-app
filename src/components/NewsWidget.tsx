import { useState, useEffect } from 'react';
import { Rss, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
}

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<'forex' | 'crypto'>('forex');

  useEffect(() => {
    let isMounted = true;
    const fetchNews = async () => {
      setLoading(true);
      try {
        const urlMap = {
          forex: 'https://api.rss2json.com/v1/api.json?rss_url=https://www.investing.com/rss/news_285.rss',
          crypto: 'https://api.rss2json.com/v1/api.json?rss_url=https://coinjournal.net/news/category/bitcoin/feed/'
        };
        
        const response = await fetch(urlMap[category]);
        const data = await response.json();
        
        if (data.status === 'ok' && isMounted) {
          setNews(data.items.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching news", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchNews();
    return () => { isMounted = false; };
  }, [category]);

  return (
    <div className="card" style={{ marginTop: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
           <Rss size={20} className="text-gold-secondary" />
           Noticias Mercado
        </div>
      </h3>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setCategory('forex')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', 
            fontWeight: category === 'forex' ? 600 : 400,
            color: category === 'forex' ? '#fff' : 'var(--text-muted)',
            borderBottom: category === 'forex' ? '2px solid var(--gold-secondary)' : '2px solid transparent',
            paddingBottom: '0.25rem'
          }}
        >
          Forex & Oro
        </button>
        <button 
          onClick={() => setCategory('crypto')}
          style={{ 
            background: 'none', border: 'none', cursor: 'pointer', 
            fontWeight: category === 'crypto' ? 600 : 400,
            color: category === 'crypto' ? '#fff' : 'var(--text-muted)',
            borderBottom: category === 'crypto' ? '2px solid var(--gold-secondary)' : '2px solid transparent',
            paddingBottom: '0.25rem'
          }}
        >
          Criptomonedas
        </button>
      </div>
      
      {loading ? (
        <p className="text-muted" style={{ textAlign: 'center', padding: '1rem' }}>Cargando últimas noticias...</p>
      ) : (
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {news.length === 0 && <p className="text-muted">No hay noticias disponibles en este momento.</p>}
          {news.map((item, id) => (
            <li key={id} style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
              <a href={item.link} target="_blank" rel="noreferrer" style={{ color: '#fff', fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ flex: 1 }}>{item.title}</span>
                <ExternalLink size={14} className="text-gold-primary" style={{ minWidth: '14px', marginTop: '4px' }}/>
              </a>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.5rem' }}>
                {new Date(item.pubDate).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
