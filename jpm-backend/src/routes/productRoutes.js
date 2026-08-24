import express from 'express';
import * as productController from '../controllers/productController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = express.Router();

router.get('/search', productController.searchProducts);
router.get('/category/:slug', productController.getCategoryProducts);

router
    .route('/')
    .get(productController.getAllProducts)
    .post(protect, restrictTo('admin'), productController.createProduct);

router
    .route('/:id')
    .get(productController.getProduct)
    .patch(protect, restrictTo('admin'), productController.updateProduct)
    .delete(protect, restrictTo('admin'), productController.deleteProduct);

export default router;
