const Category = require('../models/Category');
const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

exports.createCategory = async (req, res) => {
  const { name, allocatedBudget, month, year } = req.body;

  try {
    const existingCategory = await Category.findOne({
      where: { name, userId: req.user.id, month, year },
    });

    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists for this month.' });
    }

    const budget = await Budget.findOne({
      where: { userId: req.user.id, month, year },
    });

    if (!budget) {
      return res.status(400).json({ message: 'No budget found for this month. Please create a budget first.' });
    }

    if (budget.remaining_monthly_budget < parseFloat(allocatedBudget)) {
      return res.status(400).json({ message: 'Allocated budget exceeds the available remaining budget.' });
    }

    const category = await Category.create({
      name,
      allocatedBudget,
      remainingBudget: parseFloat(allocatedBudget),
      month,
      year,
      userId: req.user.id,
    });

    budget.remaining_monthly_budget -= parseFloat(allocatedBudget);
    await budget.save();

    res.json({ message: 'Category created successfully', category });
  } catch (err) {
    console.error(err);
    console.log(err);
    res.status(500).json({ message: 'Error creating category', error: err });
  }
};

exports.getCategory = async (req, res) => {
  const { month, year } = req.body;

  if (!month || !year) {
    return res.status(400).json({ message: 'Month and year are required' });
  }

  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id, month, year },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories', error: err });
    console.log(err);
  }
};


exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { userId: req.user.id},
    });

    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving categories', error: err });
    console.log(err);
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { allocatedBudget } = req.body;

  try {
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: 'Category not found' });

    // Ensure the user owns the category
    if (category.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to edit this category' });
    }

    const budget = await Budget.findOne({
      where: { userId: req.user.id, month: category.month, year: category.year },
    });

    if (!budget) {
      return res.status(400).json({ message: 'No budget found for this month. Please create a budget first.' });
    }

    const budgetDifference = parseFloat(allocatedBudget) - parseFloat(category.allocatedBudget);

    // Check if the updated allocated budget exceeds the total budget
    if (budget.remaining_monthly_budget < budgetDifference) {
      return res.status(400).json({ message: 'Insufficient remaining budget for this change.' });
    }

    // Update the remaining budget based on the difference
    category.allocatedBudget = parseFloat(allocatedBudget);
    category.remainingBudget = parseFloat(category.remainingBudget) + budgetDifference;

    // Update the remaining monthly budget accordingly
    budget.remaining_monthly_budget -= budgetDifference;

    await category.save();
    await budget.save();

    res.json({ message: 'Category updated successfully', category });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating category', error: err });
  }
};


exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the category by its ID
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Ensure the user owns the category
    if (category.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to delete this category' });
    }

    // Check for any expenses associated with this category
    const expenses = await Expense.findAll({
      where: {
        userId: req.user.id,
        categoryName: category.name, // Assuming 'categoryId' is the foreign key in the Expense model
      },
    });

    if (expenses.length > 0) {
      return res.status(400).json({ message: 'Cannot delete category; there are expenses associated with it.' });
    }

    // Find the corresponding budget for the category's month and year
    const budget = await Budget.findOne({
      where: { userId: req.user.id, month: category.month, year: category.year },
    });

    if (!budget) {
      return res.status(400).json({ message: 'No budget found for this month.' });
    }

    // Ensure the correct numeric calculation (using parseFloat)
    const allocatedBudget = parseFloat(category.allocatedBudget); // Convert string to float
    budget.remaining_monthly_budget = parseFloat(budget.remaining_monthly_budget) + allocatedBudget;

    // Save the updated budget
    await budget.save();

    // Delete the category
    await category.destroy();

    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting category', error: err });
  }
};


exports.getCategoryById = async (req, res) => {
  const { id } = req.params; // Get the category ID from the request parameters

  try {
    // Find the category by primary key (id)
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Ensure that the user owns the category (authorization)
    if (category.userId !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to view this category' });
    }

    res.json(category); // Return the found category
  } catch (err) {
    console.error('Error retrieving category by ID:', err);
    res.status(500).json({ message: 'Error retrieving category', error: err });
  }
};