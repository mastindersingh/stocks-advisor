const express = require('express');
const fetch = require('node-fetch');

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  try {
    const stocks = await getStockPrices(['AAPL', 'GOOGL', 'AMZN']);
    res.render('index', { stocks });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching stock prices');
  }
});

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

async function getStockPrices(stockSymbols) {
  const promises = stockSymbols.map(async symbol => {
    const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=K6ZMVVGGC8JBSKCT`;
    const response = await fetch(url);
    const data = await response.json();
    return {
      name: symbol,
      price: data['Global Quote']['05. price']
    };
  });
  return Promise.all(promises);
}

