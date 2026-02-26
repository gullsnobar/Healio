export const formatTime = (date) => new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
export const formatDuration = (minutes) => { const h = Math.floor(minutes / 60); const m = minutes % 60; return h > 0 ? h + 'h ' + m + 'm' : m + 'm'; };
export const getTimeAgo = (date) => { const s = Math.floor((new Date() - new Date(date)) / 1000); if (s < 60) return 'Just now'; if (s < 3600) return Math.floor(s/60)+'m ago'; if (s < 86400) return Math.floor(s/3600)+'h ago'; return Math.floor(s/86400)+'d ago'; };
