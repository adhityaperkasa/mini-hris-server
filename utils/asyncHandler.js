// Pembungkus supaya tidak perlu tulis try-catch manual di setiap controller.
// Kalau ada error di dalam fungsi async, otomatis dilempar ke next(err),
// yang nantinya ditangkap oleh error handler terpusat di index.js

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

module.exports = asyncHandler;
