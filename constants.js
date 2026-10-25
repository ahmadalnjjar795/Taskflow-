export const STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
};

export const STATUS_LIST = [STATUS.TODO, STATUS.IN_PROGRESS, STATUS.COMPLETED];
export const PRIORITY_LIST = [PRIORITY.LOW, PRIORITY.MEDIUM, PRIORITY.HIGH];

export const PRIORITY_COLORS = {
  [PRIORITY.LOW]: { fg: 'var(--blue-500)', bg: 'var(--blue-100)' },
  [PRIORITY.MEDIUM]: { fg: 'var(--accent-strong)', bg: 'var(--amber-100)' },
  [PRIORITY.HIGH]: { fg: 'var(--red-500)', bg: 'var(--red-100)' },
};

export const STATUS_COLORS = {
  [STATUS.TODO]: { fg: 'var(--ink-400)', bg: 'var(--ink-100)' },
  [STATUS.IN_PROGRESS]: { fg: 'var(--blue-500)', bg: 'var(--blue-100)' },
  [STATUS.COMPLETED]: { fg: 'var(--teal-600)', bg: 'var(--teal-100)' },
};

export const DEFAULT_CATEGORIES = [
  'general',
  'work',
  'personal',
  'study',
  'health',
  'finance',
];

export const STORAGE_KEYS = {
  TASKS: 'taskflow.tasks',
  THEME: 'taskflow.theme',
  LANGUAGE: 'taskflow.language',
  SETTINGS: 'taskflow.settings',
};

export const DEFAULT_SETTINGS = {
  notificationsEnabled: true,
  defaultPriority: PRIORITY.MEDIUM,
  defaultStatus: STATUS.TODO,
};
