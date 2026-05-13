require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin:         process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const tasksRouter = require('./routes/tasks');
app.use('/api/tasks', tasksRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

module.exports = app;

if (require.main === module) {
  const { initDb } = require('./models/db');
  initDb()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Task-Flow API running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Database failed to start:', err);
      process.exit(1);
    });
}