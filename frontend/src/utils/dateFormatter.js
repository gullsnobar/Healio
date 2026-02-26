export const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
export const formatDateFull = (date) => new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
export const getRelativeDate = (date) => { const d = Math.floor((new Date() - new Date(date)) / 86400000); return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : d + ' days ago'; };
export const isToday = (date) => new Date(date).toDateString() === new Date().toDateString();
