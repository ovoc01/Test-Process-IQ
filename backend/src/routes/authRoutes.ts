import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Simple hardcoded login for assessment purposes
  if (username === 'admin' && password === 'admin') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'supersecretkey', {
      expiresIn: '1h',
    });
    return res.status(200).json({ token });
  }

  res.status(401).json({ message: 'Invalid credentials' });
});

export default router;
