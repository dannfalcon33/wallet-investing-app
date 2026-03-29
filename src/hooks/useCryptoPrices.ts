import { useState, useEffect } from 'react';


export function useCryptoPrices() {
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,pax-gold&vs_currencies=usd');
      const data = await res.json();
      
      const priceMap: Record<string, number> = {
        'BTC': data.bitcoin?.usd || 0,
        'ETH': data.ethereum?.usd || 0,
        'SOL': data.solana?.usd || 0,
        'BNB': data.binancecoin?.usd || 0,
        'PAXG': data['pax-gold']?.usd || 0,
        'XAUUSD': data['pax-gold']?.usd || 0,
        'USDT': 1
      };
      
      setPrices(priceMap);
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    // Refresh every 60 seconds (CoinGecko prefers less frequent polls)
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  return { prices, loading, refetch: fetchPrices };
}
