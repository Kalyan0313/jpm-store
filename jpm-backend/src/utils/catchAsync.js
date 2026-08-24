/**
 * Wraps async controller methods to automatically catch rejected promises
 * and pass them to the express next() error middleware.
 */
export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
