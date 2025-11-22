/**
 * Wraps an asynchronous Express route handler to automatically catch errors
 * and pass them to the next error middleware.
 *
 * @param {function} fn The asynchronous route handler (req, res, next) => Promise<void>
 * @returns {function} The standard Express middleware (req, res, next) => void
 */
const asyncHandler = (fn) => (req, res, next) => {
  // Promise.resolve() wraps the execution of the handler function (fn) in a Promise.
  // This ensures that even if 'fn' is synchronous, it returns a Promise.
  // If 'fn' is async, it naturally returns a Promise.
  Promise.resolve(fn(req, res, next))
    // If the Promise rejects (an error is thrown), the .catch() block is executed.
    // The error is passed to Express's built-in or custom error middleware via next(err).
    .catch(next);
};

module.exports = asyncHandler;