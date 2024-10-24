const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const authMiddleware = require('../middlewares/authMiddleware');


router.post('/add', authMiddleware, categoryController.createCategory);

router.post('/get', authMiddleware, categoryController.getCategory);

router.get('/list', authMiddleware, categoryController.getCategories);

router.put('/edit/:id', authMiddleware, categoryController.updateCategory);

router.delete('/delete/:id', authMiddleware, categoryController.deleteCategory);

router.get('/get/:id', authMiddleware, categoryController.getCategoryById);



module.exports = router;
