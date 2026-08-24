import { catchAsync } from '../utils/catchAsync.js';
import * as categoryService from '../services/categoryService.js';

export const getCategories = catchAsync(async (req, res, next) => {
    const categories = await categoryService.getAllCategories();
    res.status(200).json({
        status: 'success',
        results: categories.length,
        data: {
            categories,
        },
    });
});
