import { catchAsync } from '../utils/catchAsync.js';
import * as authService from '../services/authService.js';

export const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    const newUser = await authService.registerUser({ name, email, password });
    authService.createSendToken(newUser, 201, res);
});

export const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await authService.loginUser({ email, password });
    authService.createSendToken(user, 200, res);
});

export const logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success', message: 'Successfully logged out' });
};

export const getMe = catchAsync(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user,
        },
    });
});
