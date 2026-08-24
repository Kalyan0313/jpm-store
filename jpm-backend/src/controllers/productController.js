import { catchAsync } from '../utils/catchAsync.js';
import * as productService from '../services/productService.js';

export const getAllProducts = catchAsync(async (req, res, next) => {
    const result = await productService.getProducts(req.query);
    res.status(200).json({
        status: 'success',
        results: result.products.length,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        data: {
            products: result.products,
        },
    });
});

export const getProduct = catchAsync(async (req, res, next) => {
    const product = await productService.getProductById(req.params.id);
    res.status(200).json({
        status: 'success',
        data: {
            product,
        },
    });
});

export const getCategoryProducts = catchAsync(async (req, res, next) => {
    const { slug } = req.params;
    const result = await productService.getProductsByCategory(slug, req.query);
    res.status(200).json({
        status: 'success',
        category: slug,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages,
        data: {
            products: result.products,
        },
    });
});

export const searchProducts = catchAsync(async (req, res, next) => {
    const { q, limit } = req.query;
    const result = await productService.getProducts({ q, limit: limit || 10 });
    res.status(200).json({
        status: 'success',
        total: result.total,
        data: {
            products: result.products,
        },
    });
});

export const createProduct = catchAsync(async (req, res, next) => {
    const newProduct = await productService.createProduct(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            product: newProduct,
        },
    });
});

export const updateProduct = catchAsync(async (req, res, next) => {
    const updatedProduct = await productService.updateProduct(req.params.id, req.body);
    res.status(200).json({
        status: 'success',
        data: {
            product: updatedProduct,
        },
    });
});

export const deleteProduct = catchAsync(async (req, res, next) => {
    await productService.deleteProduct(req.params.id);
    res.status(204).json({
        status: 'success',
        data: null,
    });
});
