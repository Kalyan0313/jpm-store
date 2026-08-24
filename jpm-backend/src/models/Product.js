import mongoose from 'mongoose';
import slugify from 'slugify';

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
            maxlength: [120, 'Title cannot exceed 120 characters'],
        },
        slug: {
            type: String,
            unique: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price must be positive'],
        },
        discountPercentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        rating: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
        },
        stock: {
            type: Number,
            required: [true, 'Stock count is required'],
            default: 50,
            min: 0,
        },
        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true,
        },
        category: {
            type: String,
            required: [true, 'Category slug is required'],
            enum: ['smartwatches', 'earphones', 'laptops', 'mobiles'],
            lowercase: true,
            trim: true,
        },
        thumbnail: {
            type: String,
            required: [true, 'Product thumbnail URL is required'],
        },
        images: [
            {
                type: String,
            },
        ],
        specifications: {
            type: Map,
            of: String,
            default: {},
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for high-performance searching, sorting & filtering
productSchema.index({ title: 'text', description: 'text', brand: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ rating: -1 });

productSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true, strict: true });
    }
    next();
});

export const Product = mongoose.model('Product', productSchema);
