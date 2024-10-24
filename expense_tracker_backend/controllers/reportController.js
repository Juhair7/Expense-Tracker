const Expense = require('../models/Expense');
const Category = require('../models/Category');
const User = require('../models/User');
const Budget = require('../models/Budget');
const { Op } = require('sequelize');
const puppeteer = require('puppeteer');
const nodemailer = require('nodemailer');
// Use json2csv to generate CSV

exports.downloadMonthlyReportPdf = async (req, res) => {
  const { month, year } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    // Fetch expenses, categories, and budget for the given month/year
    const expenses = await Expense.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [
            new Date(parsedYear, parsedMonth - 1, 1),
            new Date(parsedYear, parsedMonth, 0),
          ],
        },
      },
    });

    const budget = await Budget.findOne({
      where: { userId: req.user.id, month, year },
    });

    const categories = await Category.findAll({
      where: { userId: req.user.id, month, year },
    });

    const totalMonthlyBudget = parseFloat(budget.total_monthly_budget);
    const totalMonthlyRemainingBudget = parseFloat(budget.remaining_monthly_budget);
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = categories.reduce(
      (sum, category) => sum + parseFloat(category.allocatedBudget || 0),
      0
    );
    const remainingBudget = totalBudget - totalSpent;

    // Calculate amount spent for each category
    const categoryDetails = categories.map((category) => {
      const categorySpent = expenses
        .filter((expense) => expense.categoryName === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        name: category.name,
        allocatedBudget: parseFloat(category.allocatedBudget || 0),
        remaining: parseFloat(category.remainingBudget || 0),
        spent: categorySpent,
      };
    });

    // Generate HTML for the PDF
    const html = `
    <html>
    <head>
      <style>
        body { 
          font-family:'Times New Roman', serif; 
          margin: 20px; 
          color: #333; 
          background-color: #f9f9f9; 
        }
        h2 { 
          color: #2c3e50; 
          text-align: center; 
          margin-bottom: 20px; 
        }
        p { 
          font-size: 14px; 
          margin: 5px 0; 
          text-align: center;
        }
        table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          background-color: #fff; 
        }
        th, td { 
          padding: 10px; 
          border: 1px solid #ddd; 
          text-align: center; 
        }
        th { 
          background-color: #3498db; 
          color: #fff; 
          font-weight: bold; 
          font-size: 14px; 
        }
        tr:nth-child(even) { 
          background-color: #ecf0f1; 
        }
        tr:hover { 
          background-color: #bdc3c7; 
        }
        table.category-table {
          margin-bottom: 40px; 
        }
        table.expense-table {
          margin-bottom: 20px; 
        }
        .center {
          text-align: center;
        }
        .summary-section {
          background-color: #2ecc71;
          color: white;
          padding: 10px;
          border-radius: 5px;
          text-align: center;
          margin-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <h2>Monthly Financial Report - ${month} - ${year}</h2>
      
      <div class="summary-section">
        <p><strong>Monthly Budget:</strong> ₹${totalMonthlyBudget.toFixed(2)}</p>
        <p><strong>Monthly Remaining Budget:</strong> ₹${totalMonthlyRemainingBudget.toFixed(2)}</p>
        <p><strong>Total Spent:</strong> ₹${totalSpent.toFixed(2)}</p>
        <p><strong>Allocated Total Budget:</strong> ₹${totalBudget.toFixed(2)}</p>
        <p><strong>Remaining Budget:</strong> ₹${remainingBudget.toFixed(2)}</p>
      </div>

      <h3 class="center">Category-wise Budget Breakdown</h3>
      <table class="category-table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Allocated Budget</th>
            <th>Spent</th>
            <th>Remaining</th>
          </tr>
        </thead>
        <tbody>
          ${categoryDetails.map(category => `
            <tr>
              <td>${category.name}</td>
              <td>₹${category.allocatedBudget.toFixed(2)}</td>
              <td>₹${category.spent.toFixed(2)}</td>
              <td>₹${category.remaining.toFixed(2)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <h3 class="center">Expense Breakdown</h3>
      <table class="expense-table">
        <thead>
          <tr>
            <th>Expense Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          ${expenses.map(expense => `
            <tr>
              <td>${expense.expenseName}</td>
              <td>₹${expense.amount.toFixed(2)}</td>
              <td>${new Date(expense.date).toLocaleDateString()}</td>
              <td>${expense.categoryName || 'N/A'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <p class="center">Thank you for using the Expense Tracker App!</p>
    </body>
    </html>
    `;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Set response headers for downloading the PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Monthly_Report_${month}_${year}.pdf`);
    
    // Send the PDF buffer as a response
    res.end(pdfBuffer);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getMonthlyReport = async (req, res) => {
  const { month, year } = req.body;
  const userId = req.user.id;

  try {
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    // Fetch all expenses for the given month/year
    const expenses = await Expense.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [
            new Date(parsedYear, parsedMonth - 1, 1),
            new Date(parsedYear, parsedMonth, 0),
          ],
        },
      },
    });

    // Fetch all categories for the given month/year
    const categories = await Category.findAll({
      where: { userId: req.user.id, month, year },
    });
    const budget = await Budget.findOne({
      where: { userId: req.user.id, month, year },
    });

    const totalMonthlyBudget = parseFloat(budget.total_monthly_budget);
    const totalMonthlyRemainingBudget = parseFloat(budget.remaining_monthly_budget);
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Parse allocatedBudget as numbers and calculate total budget
    const totalBudget = categories.reduce((sum, category) =>
      sum + parseFloat(category.allocatedBudget || 0), 0
    );

    // Calculate the remaining budget
    const remainingBudget = totalBudget - totalSpent;

    // Build report data
    const report = {
      totalMonthlyBudget:totalMonthlyBudget,
      totalMonthlyRemainingBudget:totalMonthlyRemainingBudget,
      month: month,
      year: year,
      totalSpent: totalSpent,
      totalBudget: totalBudget,
      remainingBudget: remainingBudget,
      expenses: expenses,
      categories: categories
    };

    return res.status(200).json(report);
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendMonthlyReportEmailPdf = async (req, res) => {
  const { month, year } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found.' });
    }

    const userEmail = user.email;
    const userName = user.username;
    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    // Fetch the expenses and categories for the given month/year
    const expenses = await Expense.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [
            new Date(parsedYear, parsedMonth - 1, 1),
            new Date(parsedYear, parsedMonth, 0),
          ],
        },
      },
    });

    const budget = await Budget.findOne({
      where: { userId: req.user.id, month, year },
    });

    const categories = await Category.findAll({
      where: { userId: req.user.id, month, year },
    });

    const totalMonthlyBudget = parseFloat(budget.total_monthly_budget);
    const totalMonthlyRemainingBudget = parseFloat(budget.remaining_monthly_budget);
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = categories.reduce(
      (sum, category) => sum + parseFloat(category.allocatedBudget || 0),
      0
    );
    const remainingBudget = totalBudget - totalSpent;

    // Calculate the amount spent for each category
    const categoryDetails = categories.map((category) => {
      const categorySpent = expenses
        .filter((expense) => expense.categoryName === category.name)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        name: category.name,
        allocatedBudget: parseFloat(category.allocatedBudget || 0),
        remaining: parseFloat(category.remainingBudget || 0),
        spent: categorySpent,
      };
    });

    // Generate HTML for the PDF
    const html = `
  <html>
  <head>
    <style>
      body { 
        font-family: 'Times New Roman', seriff; 
        margin: 20px; 
        color: #333; 
        background-color: #f9f9f9; 
      }
      h2 { 
        color: #2c3e50; 
        text-align: center; 
        margin-bottom: 20px; 
      }
      p { 
        font-size: 14px; 
        margin: 5px 0; 
        text-align: center;
      }
      table { 
        width: 100%; 
        border-collapse: collapse; 
        margin: 20px 0; 
        background-color: #fff; 
      }
      th, td { 
        padding: 10px; 
        border: 1px solid #ddd; 
        text-align: center; 
      }
      th { 
        background-color: #3498db; 
        color: #fff; 
        font-weight: bold; 
        font-size: 14px; 
      }
      tr:nth-child(even) { 
        background-color: #ecf0f1; 
      }
      tr:hover { 
        background-color: #bdc3c7; 
      }
      table.category-table {
        margin-bottom: 40px; 
      }
      table.expense-table {
        margin-bottom: 20px; 
      }
      .center {
        text-align: center;
      }
      .summary-section {
        background-color: #2ecc71;
        color: white;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        margin-bottom: 30px;
      }
    </style>
  </head>
  <body>
    <h2>Monthly Financial Report - ${month} - ${year}</h2>
    
    <div class="summary-section">
      <p><strong>Monthly Budget:</strong> ₹${totalMonthlyBudget.toFixed(2)}</p>
      <p><strong>Monthly Remaining Budget:</strong> ₹${totalMonthlyRemainingBudget.toFixed(2)}</p>
      <p><strong>Total Spent:</strong> ₹${totalSpent.toFixed(2)}</p>
      <p><strong>Allocated Total Budget:</strong> ₹${totalBudget.toFixed(2)}</p>
      <p><strong>Remaining Budget:</strong> ₹${remainingBudget.toFixed(2)}</p>
    </div>

    <h3 class="center">Category-wise Budget Breakdown</h3>
    <table class="category-table">
      <thead>
        <tr>
          <th>Category</th>
          <th>Allocated Budget</th>
          <th>Spent</th>
          <th>Remaining</th>
        </tr>
      </thead>
      <tbody>
        ${categoryDetails.map(category => `
          <tr>
            <td>${category.name}</td>
            <td>₹${category.allocatedBudget.toFixed(2)}</td>
            <td>₹${category.spent.toFixed(2)}</td>
            <td>₹${category.remaining.toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <h3 class="center">Expense Breakdown</h3>
    <table class="expense-table">
      <thead>
        <tr>
          <th>Expense Name</th>
          <th>Amount</th>
          <th>Date</th>
          <th>Category</th>
        </tr>
      </thead>
      <tbody>
        ${expenses.map(expense => `
          <tr>
            <td>${expense.expenseName}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.categoryName || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <p class="center">Thank you for using the Expense Tracker App!</p>
  </body>
  </html>
`;
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Monthly Report for ${month} - ${year}`,
      text: `
        Dear ${userName},
    
        We hope this email finds you well! 
    
        "Success is the sum of small efforts, repeated day in and day out." 
    
        Please find attached your monthly report for ${month} - ${year}. We hope this report provides valuable insights into your progress and helps you continue to make informed financial decisions. 
    
        "Don't watch the clock; do what it does. Keep going." 
    
        
    
        Thank you for your continued trust and support!
    
        Best regards,
        Your Expense Tracker App
    
        Attachments:
        - Monthly Report for ${month} - ${year}
      `,
      attachments: [
        {
          filename: `Monthly_Report_${month}_${year}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };
    

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Monthly report sent to your email!' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.sendMonthlyReportEmail = async (req, res) => {
  const { month, year } = req.body;
  const userId = req.user.id;  // Ensure the userId is being correctly extracted from the request

  try {
    // Fetch the user by the correct field (id, not userId)
    const user = await User.findOne({ where: { id: userId } });

    // Check if the user exists and fetch the email
    if (!user || !user.email) {
      return res.status(400).json({ message: 'User email not found.' });
    }

    const userEmail = user.email;  // Correctly fetch the email from the user object
    const userName = user.username;  // Log the email to verify

    const parsedMonth = parseInt(month);
    const parsedYear = parseInt(year);

    // Fetch the expenses for the given month/year
    const expenses = await Expense.findAll({
      where: {
        userId,
        date: {
          [Op.between]: [
            new Date(parsedYear, parsedMonth - 1, 1),
            new Date(parsedYear, parsedMonth, 0),
          ],
        },
      },
    });

    // Fetch the categories for the given month/year
    const categories = await Category.findAll({
      where: { userId: req.user.id, month, year },
    });

    const budget = await Budget.findOne({
      where: { userId: req.user.id, month, year },
    });
    const totalMonthlyBudget = parseFloat(budget.total_monthly_budget);
    const totalMonthlyRemainingBudget = parseFloat(budget.remaining_monthly_budget);

    const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = categories.reduce(
      (sum, category) => sum + parseFloat(category.allocatedBudget || 0),
      0
    );
    const remainingBudget = totalBudget - totalSpent;

    // Calculate the amount spent for each category
    const categoryDetails = categories.map((category) => {
      const categorySpent = expenses
        .filter((expense) => expense.categoryId === category.id)
        .reduce((sum, expense) => sum + expense.amount, 0);

      return {
        name: category.name,
        allocatedBudget: parseFloat(category.allocatedBudget || 0), // Default to 0 if not a number
        remaining: parseFloat(category.remainingBudget || 0),
        spent: parseFloat(category.allocatedBudget || 0) - parseFloat(category.remainingBudget || 0), // Handle non-number values
      };
    });

    // Build HTML tables for categories and expenses
    const categoryTableRows = categoryDetails
      .map(
        (category) => `
          <tr>
            <td>${category.name}</td>
            <td>₹${category.allocatedBudget.toFixed(2)}</td>
            <td>₹${category.spent.toFixed(2)}</td>
            <td>₹${category.remaining.toFixed(2)}</td>
          </tr>
        `
      )
      .join('');

    const expenseTableRows = expenses
      .map(
        (expense) => `
          <tr>
            <td>${expense.expenseName}</td>
            <td>₹${expense.amount.toFixed(2)}</td>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.categoryName || 'N/A'}</td>
          </tr>
        `
      )
      .join('');

    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,  // Use the correct email
      subject: `Monthly Report for ${month}/${year}`,
      html: `
        <p>Dear ${userName}, </p>
        <p>Please find your monthly report for ${month} - ${year}. We hope this report provides valuable insights into your progress and helps you continue to make informed financial decisions. 
        <p>
        <h2>Monthly Report for ${month} - ${year}</h2>
       <p><strong>Monthly Budget:</strong> ₹${totalMonthlyBudget.toFixed(2)}</p>
      <p><strong>Monthly Remaining Budget:</strong> ₹${totalMonthlyRemainingBudget.toFixed(2)}</p>
        <p><strong>Total Spent:</strong> ₹${totalSpent.toFixed(2)}</p>
        <p><strong>Allocated Total Budget:</strong> ₹${totalBudget.toFixed(2)}</p>
        <p><strong>Allocated Remaining Budget:</strong> ₹${remainingBudget.toFixed(2)}</p>
        
        <h3>Category Details:</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Allocated Budget</th>
              <th>Amount Spent</th>
              <th>Remaining Budget</th>
            </tr>
          </thead>
          <tbody>
            ${categoryTableRows}
          </tbody>
        </table>
        
        <h3>Expense Details:</h3>
        <table border="1" cellpadding="5" cellspacing="0">
          <thead>
            <tr>
              <th>Expense Name</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Category Name</th>
            </tr>
          </thead>
          <tbody>
            ${expenseTableRows}
          </tbody>
        </table>
        
        <p>Best Regards,</p>
        <p>Your Expense Tracker App</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Monthly report sent to your email!' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

