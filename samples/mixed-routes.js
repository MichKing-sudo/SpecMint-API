const express = require('express');
const router = express.Router();

// Malformed route - missing path
router.get(async (req, res) => {
  res.json({ ok: true });
});

// Good routes mixed in
router.get('/api/v1/products', (req, res) => {
  res.json({ products: [] });
});

router.post('/api/v1/products', (req, res) => {
  res.status(201).json({ product: req.body });
});

// Using app instead of router
const app = express();
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = router;
