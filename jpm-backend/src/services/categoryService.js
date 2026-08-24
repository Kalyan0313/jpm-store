import { Category } from '../models/Category.js';

export const getAllCategories = async () => {
    return await Category.find().sort({ name: 1 });
};

export const getCategoryBySlug = async (slug) => {
    return await Category.findOne({ slug });
};
