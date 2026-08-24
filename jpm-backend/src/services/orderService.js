import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/appError.js';

export const createOrder = async (userId, orderData) => {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice } = orderData;

    if (!orderItems || orderItems.length === 0) {
        throw new AppError('No order items provided', 400);
    }

    // 1) Verify products exist and stock is sufficient
    let totalItemsPrice = 0;
    const itemsToSave = [];

    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new AppError(`Product with ID ${item.product} not found`, 404);
        }
        if (product.stock < item.quantity) {
            throw new AppError(`Insufficient stock for product "${product.title}". Only ${product.stock} available.`, 400);
        }

        totalItemsPrice += product.price * item.quantity;
        itemsToSave.push({
            product: product._id,
            title: product.title,
            quantity: item.quantity,
            price: product.price,
            thumbnail: product.thumbnail,
        });

        // Atomic stock decrement
        product.stock -= item.quantity;
        await product.save();
    }

    const calculatedTotal = totalItemsPrice + (taxPrice || 0) + (shippingPrice || 0);

    const order = await Order.create({
        user: userId,
        orderItems: itemsToSave,
        shippingAddress,
        paymentMethod: paymentMethod || 'COD',
        taxPrice: taxPrice || 0,
        shippingPrice: shippingPrice || 0,
        totalAmount: calculatedTotal,
        isPaid: paymentMethod !== 'COD',
        paidAt: paymentMethod !== 'COD' ? new Date() : undefined,
    });

    return order;
};

export const getUserOrders = async (userId) => {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const getOrderById = async (orderId, userId, userRole) => {
    const order = await Order.findById(orderId).populate('user', 'name email');
    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Only allow user who created the order or admin
    if (order.user._id.toString() !== userId.toString() && userRole !== 'admin') {
        throw new AppError('Not authorized to view this order', 403);
    }

    return order;
};
