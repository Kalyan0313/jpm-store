import { Product } from '../models/Product.js';
import { AppError } from '../utils/appError.js';
import { cacheGet, cacheSet, cacheDel } from '../config/redis.js';
import { logger } from '../utils/logger.js';

// Cache TTL in seconds (30 minutes)
const PRODUCT_CACHE_TTL = 1800;

const buildCacheKey = (prefix, params = {}) => {
    const sortedKeys = Object.keys(params).sort();
    const serializedParams = sortedKeys.map((k) => `${k}=${params[k]}`).join('&');
    return serializedParams ? `${prefix}:${serializedParams}` : prefix;
};

export const getProducts = async (queryParams = {}) => {
    const cacheKey = buildCacheKey('products:list', queryParams);

    // 1) Check Redis cache
    const cachedData = await cacheGet(cacheKey);
    if (cachedData) {
        logger.info(`⚡ Redis Cache HIT: ${cacheKey}`);
        return { ...cachedData, _source: 'redis' };
    }

    logger.info(`🍃 Redis Cache MISS: ${cacheKey} -> Fetching from MongoDB`);

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

    const result = {
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        products,
    };

    // 2) Cache result in Redis
    await cacheSet(cacheKey, result, PRODUCT_CACHE_TTL);

    return { ...result, _source: 'database' };
};

export const getProductById = async (id) => {
    const cacheKey = `products:detail:${id}`;

    // 1) Check Redis Cache
    const cachedProduct = await cacheGet(cacheKey);
    if (cachedProduct) {
        logger.info(`⚡ Redis Cache HIT: ${cacheKey}`);
        return cachedProduct;
    }

    // 2) Query MongoDB
    const product = await Product.findById(id);
    if (!product) {
        throw new AppError(`Product with ID ${id} not found`, 404);
    }

    // 3) Store in Redis
    await cacheSet(cacheKey, product, PRODUCT_CACHE_TTL);

    return product;
};

export const getProductsByCategory = async (categorySlug, queryParams = {}) => {
    return await getProducts({ ...queryParams, category: categorySlug });
};

export const createProduct = async (productData) => {
    const product = await Product.create(productData);

    // Invalidate product catalog cache
    await cacheDel('products:*');

    return product;
};

export const updateProduct = async (id, updateData) => {
    const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });
    if (!product) {
        throw new AppError(`Product with ID ${id} not found`, 404);
    }

    // Invalidate both catalog list cache and specific detail key
    await cacheDel('products:*');

    return product;
};

export const deleteProduct = async (id) => {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        throw new AppError(`Product with ID ${id} not found`, 404);
    }

    // Invalidate all product caches
    await cacheDel('products:*');

    return product;
};
