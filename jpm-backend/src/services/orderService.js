import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { AppError } from '../utils/appError.js';

export const createOrder = async (userId, orderData) => {
    const { orderItems, shippingAddress, paymentMethod, taxPrice, shippingPrice } = orderData;

    if (!orderItems || orderItems.length === 0) {
        throw new AppError('No order items provided', 400);
    }

    let totalItemsPrice = 0;
    const itemsToSave = [];
    const decrementedProducts = [];

    try {
        for (const item of orderItems) {
            // Atomic conditional update: only decrement if stock >= requested quantity
            const product = await Product.findOneAndUpdate(
                {
                    _id: item.product,
                    stock: { $gte: item.quantity },
                },
                {
                    $inc: { stock: -item.quantity },
                },
                {
                    new: true,
                }
            );

            if (!product) {
                const exists = await Product.findById(item.product);
                if (!exists) {
                    throw new AppError(`Product with ID ${item.product} not found`, 404);
                }
                throw new AppError(
                    `Insufficient stock for product "${exists.title}". Only ${exists.stock} available.`,
                    400
                );
            }

            decrementedProducts.push({
                productId: product._id,
                quantity: item.quantity,
            });

            totalItemsPrice += product.price * item.quantity;
            itemsToSave.push({
                product: product._id,
                title: product.title,
                quantity: item.quantity,
                price: product.price,
                thumbnail: product.thumbnail,
            });
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
    } catch (error) {
        // Rollback any successfully decremented items if an error occurs during multi-item processing
        for (const dec of decrementedProducts) {
            await Product.findByIdAndUpdate(dec.productId, {
                $inc: { stock: dec.quantity },
            });
        }
        throw error;
    }
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
