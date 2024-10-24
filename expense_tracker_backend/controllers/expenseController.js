const { Op } = require('sequelize');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const Category =  require ('../models/Category');

//Add Expense
exports.addExpense = async (req, res) => {
  const { expenseName, description, amount, categoryName, date, receipt } = req.body;
  const receiptUrl = req.file ? req.file.path : receipt;

  try {
    const expenseDate = new Date(date);
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();

    const budget = await Budget.findOne({
      where: { userId: req.user.id, month, year },
    });

    if (!budget) {
      return res.status(400).json({ message: 'No budget found for this month. Please create a budget first.' });
    }

    // Find the category by name and month/year
    const category = await Category.findOne({
      where: { name: categoryName, userId: req.user.id, month, year },
    });

    if (!category) {
      return res.status(400).json({ message: `Category ${categoryName} not found for this month. Please create a category first` });
    }

    // Check if the category has enough remaining budget
    if (category.remainingBudget < parseFloat(amount)) {
      return res.status(400).json({ message: `Insufficient budget for the ${categoryName} category.` });
    }

    // Create the expense entry
    const expense = await Expense.create({
      expenseName,
      description,
      amount:parseFloat(amount),
      categoryName: categoryName,
      date,
      receiptUrl,
      userId: req.user.id,
    });

    // Update the remaining budget of the category
    category.remainingBudget -= parseFloat(amount);
    await category.save();

    res.json({ message: 'Expense added successfully', expense });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding expense', error: err });
  }
};



// Edit Expense
exports.editExpense = async (req, res) => {
  const { id } = req.params;
  const { expenseName, description, amount, categoryName, date } = req.body;
  const receiptUrl = req.file ? req.file.path : null;

  try {
    const expense = await Expense.findByPk(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Ensure the user owns the expense
    if (expense.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this expense' });
    }

    const oldAmount = parseFloat(expense.amount);
    const newAmount = parseFloat(amount);

    // Fetch the category for the given month and year
    const expenseDate = new Date(date);
    const categoryRecord = await Category.findOne({
      where: {
        userId: req.user.id,
        name: categoryName,
        month: expenseDate.getMonth() + 1,
        year: expenseDate.getFullYear(),
      },
    });

    if (!categoryRecord) {
      return res.status(400).json({ message: `Category ${categoryName} not found for this month.` });
    }

    // Check if the difference between old and new amount exceeds the remaining budget
    const remainingBudget = parseFloat(categoryRecord.remainingBudget);
    const budgetDifference = newAmount - oldAmount; // Positive value if increasing expense, negative if decreasing

    if (remainingBudget < budgetDifference) {
      return res.status(400).json({ message: `Insufficient budget for the ${categoryName} category.` });
    }

    // Update expense details
    expense.expenseName =expenseName;
    expense.description = description;
    expense.amount = newAmount;
    expense.categoryName = categoryName;
    expense.date = date;
    if (receiptUrl) expense.receiptUrl = receiptUrl;

    await expense.save();

    // Update the remaining budget of the category
    categoryRecord.remainingBudget = remainingBudget - budgetDifference;

    // Save the updated category
    await categoryRecord.save();

    res.json({ message: 'Expense updated successfully', expense });
  } catch (err) {
    console.error('Error:', err); // Log the error for debugging
    res.status(500).json({ message: 'Error updating expense', error: err });
  }
};



// Delete Expense
exports.deleteExpense = async (req, res) => {
  const { id } = req.params;

  try {
    const expense = await Expense.findByPk(id);
    if (!expense) return res.status(404).json({ message: 'Expense not found' });

    // Ensure that the user owns the expense
    if (expense.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this expense' });
    }

    const amount = parseFloat(expense.amount); // Ensure amount is a float
    const expenseDate = new Date(expense.date); // Ensure the date is a Date object

    await expense.destroy();

    // Find the category for the given month and year
    const month = expenseDate.getMonth() + 1;
    const year = expenseDate.getFullYear();

    const category = await Category.findOne({
      where: { name: expense.categoryName, userId: req.user.id, month, year },
    });

    if (!category) {
      return res.status(400).json({ message: `Category ${expense.categoryName} not found.` });
    }

    // Update the category's remaining budget
    category.remainingBudget = (parseFloat(category.remainingBudget) + amount).toFixed(2);
    await category.save();

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error('Error:', err); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting expense', error: err });
  }
};

exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { userId: req.user.id } });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving expenses', error: err });
  }
};

exports.getExpenseById = async (req, res) => {
  const { id } = req.params;
  
  try {
    const expense = await Expense.findByPk(id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Ensure the user owns the expense
    if (expense.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view this expense' });
    }

    res.json(expense);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error retrieving expense', error: err });
  }
};

exports.getExpensesByCategory = async (req, res) => {
  const { categoryName } = req.body;

  try {
    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth() returns 0-11, so add 1
    const currentYear = currentDate.getFullYear();

    // Find expenses that match the category name and are within the current month and year
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.id,  // Ensure that the expenses belong to the logged-in user
        categoryName: categoryName,
        date: {
          [Op.between]: [
            new Date(currentYear, currentMonth - 1, 1), // Start of current month
            new Date(currentYear, currentMonth, 0), // End of current month
          ],
        },
      },
    });

    if (expenses.length === 0) {
      return res.status(404).json({ message: `No expenses found for the category "${categoryName}" in ${currentMonth} - ${currentYear}.` });
    }

    // Return expenses found
    res.json(expenses);
  } catch (err) {
    console.error('Error retrieving expenses by category:', err);
    res.status(500).json({ message: 'Error retrieving expenses by category', error: err });
  }
};


// Get Expenses by Month and Year
exports.getExpensesByMonthAndYear = async (req, res) => {
  const { month, year } = req.body;

  try {
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    const expenses = await Expense.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.between]: [
            new Date(parsedYear, parsedMonth - 1, 1),
            new Date(parsedYear, parsedMonth, 0),
          ],
        },
      },
    });

    // Check if no expenses were found
    if (expenses.length === 0) {
      return res.status(404).json({
        message: `No expenses found for ${month} - ${year}.`,
      });
    }

    res.json(expenses);
  } catch (err) {
    console.error('Error retrieving expenses by month and year:', err);
    res.status(500).json({ message: 'Error retrieving expenses by month and year', error: err });
  }
};

// Get Expenses by Date
exports.getExpensesByDate = async (req, res) => {
  const { date } = req.body; // Expecting date in 'YYYY-MM-DD' format

  try {
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.id,
        date: {
          [Op.eq]: new Date(date), // Match the exact date
        },
      },
    });

    if (expenses.length === 0) {
      return res.status(404).json({ message: `No expenses found for the date ${date}.` });
    }

    res.json(expenses);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Error retrieving expenses by date', error: err });
  }
};
