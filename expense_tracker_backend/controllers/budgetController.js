const Budget = require('../models/Budget');

// Create Budget
exports.createBudget = async (req, res) => {
  const { month, year, total_monthly_budget } = req.body;

  try {
    const existingBudget = await Budget.findOne({
      where: { month, year, userId: req.user.id }
    });

    if (existingBudget) {
      return res.status(400).json({ message: 'Budget already exists for this month' });
    }

    const budget = await Budget.create({
      month,
      year,
      total_monthly_budget,
      remaining_monthly_budget: total_monthly_budget,
      userId: req.user.id
    });

    res.json({ message: 'Budget created successfully', budget });
  } catch (err) {
    res.status(500).json({ message: 'Error creating budget', error: err });
  }
};

// Get Budget for a specific month
exports.getBudget = async (req, res) => {
  const { month, year } = req.query;

  try {
    const budget = await Budget.findOne({
      where: { month, year, userId: req.user.id }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving budget', error: err });
  }
};

// Update Budget
exports.updateBudget = async (req, res) => {
  const { month, year, total_monthly_budget } = req.body;

  try {
    // Find the existing budget for the user
    const budget = await Budget.findOne({
      where: { month, year, userId: req.user.id }
    });

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    // Calculate the difference and update remaining budget
    const totalMonthlyBudget = parseFloat(total_monthly_budget);
    const currentTotalBudget = parseFloat(budget.total_monthly_budget);
    const budgetDifference = totalMonthlyBudget - currentTotalBudget;

    // Update the budget values
    budget.total_monthly_budget = totalMonthlyBudget;
    budget.remaining_monthly_budget = parseFloat(budget.remaining_monthly_budget) + budgetDifference; // Adjust remaining budget accordingly
    await budget.save();

    // Format the response to two decimal places for monetary values
    res.json({
      message: 'Budget updated successfully'
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating budget', error: err });
  }
};

exports.getBudgetById = async (req, res) => {
  const { id } = req.params; 

  try {
    // Find the budget by primary key (id)
    const budget = await Budget.findByPk(id);

    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    if (budget.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view this budget' });
    }

    res.json(budget); 
  } catch (err) {
    console.error('Error retrieving budget by ID:', err);
    res.status(500).json({ message: 'Error retrieving budget', error: err });
  }
};

exports.getBudgets = async (req, res) => {

  try {
    const budgets = await Budget.findAll({
      where: { userId: req.user.id }
    });

    if (budgets.length === null) {
      return res.status(404).json({ message: 'Budget not found' });
    }

    res.json(budgets);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving budget', error: err });
  }
};