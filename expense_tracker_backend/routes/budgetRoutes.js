const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');
const authMiddleware = require('../middlewares/authMiddleware');  // Middleware to authenticate users

// Create a budget
router.post('/create', authMiddleware, budgetController.createBudget);

// Get the budget for a specific month and year
router.get('/get', authMiddleware, budgetController.getBudget);

router.get('/list', authMiddleware, budgetController.getBudgets);

router.get('/get/:id', authMiddleware, budgetController.getBudgetById);

// Update a budget
router.put('/update', authMiddleware, budgetController.updateBudget);

module.exports = router;
