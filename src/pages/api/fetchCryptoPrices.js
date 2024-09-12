import axios from 'axios';

export default async function handler(req, res) {
  const { symbols } = req.query;
  const symbolArray = symbols.split(',');

  const coinGeckoMapping = {
    BTCUSDT: 'bitcoin',
    ETHUSDT: 'ethereum',
    BNBUSDT: 'binancecoin',
    XRPUSDT: 'ripple',
    ADAUSDT: 'cardano',
    SOLUSDT: 'solana',
    DOTUSDT: 'polkadot',
    LTCUSDT: 'litecoin',
    BCHUSDT: 'bitcoin-cash',
    LINKUSDT: 'chainlink',
  };

  const symbolMapping = {
    BTCUSDT: 'BTC',
    ETHUSDT: 'ETH',
    BNBUSDT: 'BNB',
    XRPUSDT: 'XRP',
    ADAUSDT: 'ADA',
    SOLUSDT: 'SOL',
    DOTUSDT: 'DOT',
    LTCUSDT: 'LTC',
    BCHUSDT: 'BCH',
    LINKUSDT: 'LINK',
  };

  const ids = symbolArray.map(symbol => coinGeckoMapping[symbol]).filter(Boolean);

  if (ids.length === 0) {
    return res.status(400).json({ error: 'No valid symbols provided' });
  }

  try {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd`;
    const response = await axios.get(url);

    const data = symbolArray.map(symbol => ({
      symbol: symbolMapping[symbol],
      prices: [{ time: Date.now(), close: response.data[coinGeckoMapping[symbol]].usd }]
    }));

    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from CoinGecko:', error.message);
    res.status(500).json({ error: 'Error fetching data from CoinGecko' });
  }
}
