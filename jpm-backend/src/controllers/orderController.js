import { catchAsync } from '../utils/catchAsync.js';
import * as orderService from '../services/orderService.js';

export const createOrder = catchAsync(async (req, res, next) => {
    const newOrder = await orderService.createOrder(req.user._id, req.body);
    res.status(201).json({
        status: 'success',
        data: {
            order: newOrder,
        },
    });
});

export const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await orderService.getUserOrders(req.user._id);
    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: {
            orders,
        },
    });
});

export const getOrderById = catchAsync(async (req, res, next) => {
    const order = await orderService.getOrderById(
        req.params.id,
        req.user._id,
        req.user.role
    );
    res.status(200).json({
        status: 'success',
        data: {
            order,
        },
    });
});
