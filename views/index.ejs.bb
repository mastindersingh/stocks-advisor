<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Stock Adviser</title>
  <style>
    .subscribe {
      display: inline-block;
      background-color: #ff5c00;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      text-decoration: none;
      text-align: center;
    }

    .subscribe:hover {
      background-color: #e64a00;
    }
  </style>
</head>
<body>
  <h1>Stock Adviser</h1>
  <ul>
    <% stocks.forEach(stock => { %>
      <li><%= stock.name %> - <%= stock.name.includes('.BSE') ? '₹' : '$' %><%= stock.price %></li>
    <% }); %>
  </ul>
  <a href="phonepe://pa/8105601518@ybl" class="subscribe" target="_blank">Subscribe Now</a>
</body>
</html>

