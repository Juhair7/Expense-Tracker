const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');
const authMiddleware = require('../middlewares/authMiddleware'); // For JWT authentication


router.post('/add', authMiddleware, expenseController.addExpense);
router.put('/edit/:id', authMiddleware, expenseController.editExpense);
router.delete('/delete/:id', authMiddleware, expenseController.deleteExpense);
router.get('/list', authMiddleware, expenseController.getExpenses);
router.get('/get/:id', authMiddleware, expenseController.getExpenseById);
router.post('/category', authMiddleware, expenseController.getExpensesByCategory);
router.post('/month', authMiddleware, expenseController.getExpensesByMonthAndYear);
router.post('/date', authMiddleware, expenseController.getExpensesByDate);


module.exports = router;
