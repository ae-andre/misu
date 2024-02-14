const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes');
// const authRoutes = require('./routes/auth'); // Adjust the path according to your project structure
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors')


require('dotenv').config();

const app = express();
app.use(express.json()); // For parsing application/json
app.use('/api', mainRouter);
app.use(helmet());
app.use(cors());

// database connection and other middleware setup

let server;
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

app.use('/uploads', express.static('uploads'));


// limiter settings
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

module.exports = { app, server };