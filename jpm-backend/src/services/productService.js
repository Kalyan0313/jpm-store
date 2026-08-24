import { Product } from '../models/Product.js';
import { AppError } from '../utils/appError.js';

export const getProducts = async (queryParams) => {
    const {
        category,
        brand,
        q,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 10,
        featured,
    } = queryParams;

    const filter = {};

    if (category) {
        filter.category = category.toLowerCase();
    }

    if (brand) {
        filter.brand = new RegExp(brand, 'i');
    }

    if (featured === 'true') {
        filter.isFeatured = true;
    }

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (q) {
        filter.$text = { $search: q };
    }

    // Sort strategy
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    if (sort === 'price-desc') sortOptions = { price: -1 };
    if (sort === 'rating') sortOptions = { rating: -1 };
    if (sort === 'discount') sortOptions = { discountPercentage: -1 };

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
        Product.find(filter).sort(sortOptions).skip(skip).limit(limitNum),
        Product.countDocuments(filter),
    ]);

    return {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        products,
    };
};

export const getProductById = async (id) => {
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError(`Product with ID ${id} not found`, 404);
    }
    return product;
};

export const getProductsByCategory = async (categorySlug, queryParams = {}) => {
    return await getProducts({ ...queryParams, category: categorySlug });
};

export const createProduct = async (productData) => {
    return await Product.create(productData);
};

export const updateProduct = async (id, updateData) => {
    const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new AppError(`Product with ID ${id} not found`, 404);
    }
    return product;
};

export const deleteProduct = async (id) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        throw new AppError(`Product with ID ${id} not found`, 404);
    }
    return product;
};
