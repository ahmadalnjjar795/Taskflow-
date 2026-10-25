import { STATUS } from './constants';

export function isOverdue(task) {
  if (!task.dueDate || task.status === STATUS.COMPLETED) return false;
  const due = new Date(`${task.dueDate}T${task.dueTime || '23:59'}`);
  return due.getTime() < Date.now();
}

export function isToday(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  const d = new Date(dateStr);
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
}

export function isUpcoming(dateStr, withinDays = 7) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  const diffDays = (d - today) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= withinDays;
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

export function sortTasks(tasks, sortBy) {
  const list = [...tasks];
  switch (sortBy) {
    case 'oldest':
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'dueDate':
      return list.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(`${a.dueDate}T${a.dueTime || '00:00'}`) - new Date(`${b.dueDate}T${b.dueTime || '00:00'}`);
      });
    case 'priority':
      return list.sort((a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority]);
    case 'alphabetical':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'newest':
    default:
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export function filterTasks(tasks, filter) {
  switch (filter) {
    case 'todo':
      return tasks.filter((t) => t.status === 'todo');
    case 'inProgress':
      return tasks.filter((t) => t.status === 'in_progress');
    case 'completed':
      return tasks.filter((t) => t.status === 'completed');
    case 'highPriority':
      return tasks.filter((t) => t.priority === 'high');
    case 'mediumPriority':
      return tasks.filter((t) => t.priority === 'medium');
    case 'lowPriority':
      return tasks.filter((t) => t.priority === 'low');
    case 'all':
    default:
      return tasks;
  }
}

export function searchTasks(tasks, query) {
  if (!query || !query.trim()) return tasks;
  const q = query.trim().toLowerCase();
  return tasks.filter((t) => {
    const inTitle = t.title?.toLowerCase().includes(q);
    const inDesc = t.description?.toLowerCase().includes(q);
    const inTags = (t.tags || []).some((tag) => tag.toLowerCase().includes(q));
    return inTitle || inDesc || inTags;
  });
}

export function formatDate(dateStr, locale = 'en') {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTime(timeStr, locale = 'en') {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const d = new Date();
  d.setHours(Number(h), Number(m));
  return d.toLocaleTimeString(locale === 'ar' ? 'ar-EG' : 'en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getGreetingKey() {
  const hour = new Date().getHours();
  if (hour < 12) return 'greeting_morning';
  if (hour < 18) return 'greeting_afternoon';
  return 'greeting_evening';
}
