const express = require('express');
const router = express.Router();

// User routes
router.get('/api/v1/users', async (req, res) => {
  const users = await User.findAll();
  res.json({ success: true, data: users });
});

router.post('/api/v1/users', async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

router.get('/api/v1/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ success: true, data: user });
});

router.put('/api/v1/users/:id', async (req, res) => {
  const user = await User.update(req.params.id, req.body);
  res.json({ success: true, data: user });
});

router.delete('/api/v1/users/:id', async (req, res) => {
  await User.delete(req.params.id);
  res.status(204).send();
});

// Post routes
router.get('/api/v1/posts', async (req, res) => {
  const posts = await Post.findAll();
  res.json({ success: true, data: posts });
});

router.post('/api/v1/posts', async (req, res) => {
  const post = await Post.create(req.body);
  res.status(201).json({ success: true, data: post });
});

// Auth routes
router.post('/api/v1/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const token = await AuthService.login(email, password);
  res.json({ success: true, token });
});

router.post('/api/v1/auth/register', async (req, res) => {
  const user = await AuthService.register(req.body);
  res.status(201).json({ success: true, data: user });
});

module.exports = router;
