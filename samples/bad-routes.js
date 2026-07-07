// This file has NO Express routes - only regular functions
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

const config = {
  port: 3000,
  database: 'mongodb://localhost/myapp',
};

module.exports = { calculateTotal, formatCurrency, config };
