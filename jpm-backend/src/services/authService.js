import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';

const signToken = (id) => {
    return jwt.sign({ id }, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
};

export const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: env.NODE_ENV === 'production' ? 'strict' : 'lax',
    };

    res.cookie('jwt', token, cookieOptions);

    // Remove password from response payload
    const userPayload = user.toObject();
    delete userPayload.password;
    delete userPayload.refreshTokens;

    return res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user: userPayload,
        },
    });
};

export const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError('Email address is already registered', 400);
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    return user;
};

export const loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        throw new AppError('Incorrect email or password', 401);
    }

    return user;
};
