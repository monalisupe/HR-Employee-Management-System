/**
 * Date Filtering and Range Calculation Utilities
 * Mirrors the dynamic date filtering engine from frontend/src/pages/hr/Dashboard.jsx
 */

const getDateBoundaries = (period = 'all') => {
  const now = new Date();

  if (period === 'today') {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    return { startDate: startOfToday, endDate: endOfToday };
  }

  if (period === 'week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return { startDate: startOfWeek, endDate: now };
  }

  if (period === 'month') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
    return { startDate: startOfMonth, endDate: now };
  }

  return { startDate: null, endDate: null };
};

const filterByDateRange = (items, dateField, period = 'all') => {
  if (!Array.isArray(items) || period === 'all') return items;
  const { startDate } = getDateBoundaries(period);
  if (!startDate) return items;

  return items.filter((item) => {
    const val = item[dateField];
    if (!val) return true;
    const d = new Date(val);
    return !isNaN(d.getTime()) && d >= startDate;
  });
};

module.exports = {
  getDateBoundaries,
  filterByDateRange,
};

