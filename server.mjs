import express from 'express';
import fetch from 'node-fetch';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

const apiKey = 'K6ZMVVGGC8JBSKCT'; // Replace this with your actual API key

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
});

async function getStockPrices(stockSymbols) {
  const promises = stockSymbols.map(async symbol => {
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      // Check if 'Global Quote' is defined in the response data
      if (data['Global Quote']) {
        return {
          name: symbol,
          price: data['Global Quote']['05. price']
        };
      } else {
        console.error(`No data found for symbol: ${symbol}`);
        return {
          name: symbol,
          price: 'N/A' // You can return a placeholder or error value here
        };
      }
    } catch (error) {
      console.error(`Error fetching data for symbol: ${symbol}`, error);
      return {
        name: symbol,
        price: 'N/A' // You can return a placeholder or error value here
      };
    }
  });
  return Promise.all(promises);
}

