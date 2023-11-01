const apm = require('elastic-apm-node').start({
  serviceName: 'stock-adviser',
  secretToken: 'I5MWMcrB2iTyk3y8Vz',
  serverUrl: 'https://bb90799eb81c43bba2ab8c4ebb66f486.apm.asia-south1.gcp.elastic-cloud.com:443',
  environment: 'production',
  logLevel: 'debug'
});

const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const apiKey = 'K6ZMVVGGC8JBSKCT';

app.get('/', async (req, res) => {
  try {
    const stocks = await getStockPrices(['AAPL', 'GOOGL', 'AMZN', 'TCS.BSE', 'HCLTECH.BSE']);
    res.render('index', { stocks });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching stock prices');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
  if (apm.isStarted()) {
    console.log('APM agent is active');
  }
});

async function getStockPrices(stockSymbols) {
  const promises = stockSymbols.map(async symbol => {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data['Global Quote']) {
        return {
          name: symbol,
          price: data['Global Quote']['05. price']
        };
      } else {
        console.error(`No data found for symbol: ${symbol}`);
        return {
          name: symbol,
          price: 'N/A'
        };
      }
    } catch (error) {
      console.error(`Error fetching data for symbol: ${symbol}`, error);
      return {
        name: symbol,
        price: 'N/A'
      };
    }
  });
  return Promise.all(promises);
}

