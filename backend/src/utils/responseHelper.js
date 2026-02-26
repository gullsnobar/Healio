exports.success = (res, data, message = 'Success', statusCode = 200) => res.status(statusCode).json({ success: true, message, data });
exports.error = (res, message = 'Error', statusCode = 500, errors = null) => res.status(statusCode).json({ success: false, message, ...(errors && { errors }) });
exports.paginate = (res, data, total, page, limit) => res.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
