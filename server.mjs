const apm = require('elastic-apm-node').start({
  serviceName: 'stock-adviser',
  secretToken: 'C8G6rOEdbbUZRJnrud,
  serverUrl: ''https://4769643cf26448ed8e6887b301a5ddd9.apm.us-central1.gcp.cloud.es.io:443
  environment: 'production',
  logLevel: 'debug'
});

const express = require('express');
const fetch = require('node-fetch');
const { stockSymbols } = require('./stocks.js'); // Import the stockSymbols array

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const apiKey = 'K6ZMVVGGC8JBSKCT';

app.get('/', async (req, res) => {
  try {
    const stocks = await getStockPrices(stockSymbols); // Use the imported array
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

