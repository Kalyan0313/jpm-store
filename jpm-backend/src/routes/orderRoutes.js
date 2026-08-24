import express from 'express';
import { z } from 'zod';
import * as orderController from '../controllers/orderController.js';
import { protect } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';

const router = express.Router();

const orderSchema = z.object({
    orderItems: z.array(
        z.object({
            product: z.string().min(1, 'Product ID is required'),
            quantity: z.number().min(1, 'Quantity must be at least 1'),
        })
    ).min(1, 'Order must contain at least one item'),
    shippingAddress: z.object({
        fullName: z.string().min(1, 'Full name is required'),
        street: z.string().min(1, 'Street address is required'),
        city: z.string().min(1, 'City is required'),
        state: z.string().min(1, 'State is required'),
        postalCode: z.string().min(1, 'Postal code is required'),
        phone: z.string().min(1, 'Phone number is required'),
    }),
    paymentMethod: z.enum(['COD', 'Card', 'UPI', 'NetBanking']).optional(),
});

router.use(protect); // All order routes require authentication

router.post('/', validate(orderSchema), orderController.createOrder);
router.get('/myorders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);

export default router;
