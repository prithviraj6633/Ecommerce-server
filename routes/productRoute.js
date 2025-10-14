const express = require('express');
const productController = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/getAllProducts', productController.getAllProducts); // Public
router.get('/getProductById/:ID', productController.getProductById); // Public

router.post('/createProduct', protect, adminOnly, productController.createProduct);
router.put('/updateProduct/:ID', protect, adminOnly, productController.updateProduct);
router.delete('/deleteProduct/:ID', protect, adminOnly, productController.deleteProduct);

module.exports = router;
