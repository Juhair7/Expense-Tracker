const express = require('express');
const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const reportRoute = require('./routes/reportRoute')
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerDocument = require('./swagger.json');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // if you're using cookies
}));

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budget', budgetRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/report', reportRoute);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Sync DB
sequelize.sync()
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Sync error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
