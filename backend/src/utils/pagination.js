exports.getPagination = (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
exports.getPaginationMeta = (total, page, limit) => ({ total, page, limit, pages: Math.ceil(total / limit), hasNext: page * limit < total, hasPrev: page > 1 });
