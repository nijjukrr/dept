require('dotenv').config();
const express = require('express');
// Restart trigger
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Init DB
// require('./db/index'); // Removed, now using Supabase


const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',').map(s => s.trim()) : [];

app.use(cors((req, callback) => {
  const origin = req.header('Origin');
  const forwardedProtocol = req.header('x-forwarded-proto');
  const protocol = forwardedProtocol ? forwardedProtocol.split(',')[0].trim() : req.protocol;
  const sameOrigin = `${protocol}://${req.get('host')}`;
  const allowOrigin = !origin
    || process.env.NODE_ENV !== 'production'
    || origin === sameOrigin
    || allowedOrigins.includes(origin);

  callback(null, {
    origin: allowOrigin,
    credentials: true
  });
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/achievements', require('./routes/achievements'));
app.use('/api/leaderboard', require('./routes/leaderboard'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/updates', require('./routes/updates'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/uploads', require('./routes/uploads').router);
app.use('/api/platforms', require('./routes/platforms'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SIET CSE Portal API is running 🚀', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log('\n╔════════════════════════════════════════╗');
    console.log('║   SIET CSE Department Portal API     ║');
    console.log('║   Sri Shakthi Institute, Coimbatore   ║');
    console.log(`║   Running on http://localhost:${PORT}    ║`);
    console.log('╚════════════════════════════════════════╝\n');
  });
}

module.exports = app;

