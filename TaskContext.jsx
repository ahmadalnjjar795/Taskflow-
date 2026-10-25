import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, STATUS, PRIORITY, DEFAULT_SETTINGS } from '../utils/constants';

const TaskContext = createContext(null);

function seedTasks() {
  const today = new Date();
  const iso = (d) => d.toISOString().slice(0, 10);
  const addDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d;
  };
  const now = new Date().toISOString();
  return [
    {
      id: uuidv4(),
      title: 'Design TaskFlow landing page',
      description: 'Draft the hero section and pricing layout for the marketing site.',
      image: null,
      status: STATUS.IN_PROGRESS,
      priority: PRIORITY.HIGH,
      category: 'work',
      tags: ['design', 'landing-page'],
      dueDate: iso(today),
      dueTime: '17:00',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Weekly grocery shopping',
      description: 'Buy vegetables, fruits and household essentials.',
      image: null,
      status: STATUS.TODO,
      priority: PRIORITY.LOW,
      category: 'personal',
      tags: ['home'],
      dueDate: iso(today),
      dueTime: '19:30',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Prepare quarterly finance report',
      description: 'Summarize Q3 revenue, expenses and forecast for the leadership review.',
      image: null,
      status: STATUS.TODO,
      priority: PRIORITY.HIGH,
      category: 'finance',
      tags: ['report', 'q3'],
      dueDate: iso(addDays(2)),
      dueTime: '12:00',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Read chapter 4 — Data Structures',
      description: 'Review trees and graphs before Thursday quiz.',
      image: null,
      status: STATUS.TODO,
      priority: PRIORITY.MEDIUM,
      category: 'study',
      tags: ['algorithms'],
      dueDate: iso(addDays(4)),
      dueTime: '09:00',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Morning run — 5km',
      description: '',
      image: null,
      status: STATUS.COMPLETED,
      priority: PRIORITY.MEDIUM,
      category: 'health',
      tags: ['fitness'],
      dueDate: iso(addDays(-1)),
      dueTime: '06:30',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Renew car insurance',
      description: 'Compare quotes and renew before the policy expires.',
      image: null,
      status: STATUS.TODO,
      priority: PRIORITY.HIGH,
      category: 'personal',
      tags: ['urgent'],
      dueDate: iso(addDays(-2)),
      dueTime: '15:00',
      createdAt: now,
      updatedAt: now,
    },
    {
      id: uuidv4(),
      title: 'Team retro meeting',
      description: 'Discuss sprint blockers and plan next iteration.',
      image: null,
      status: STATUS.IN_PROGRESS,
      priority: PRIORITY.MEDIUM,
      category: 'work',
      tags: ['meeting'],
      dueDate: iso(addDays(1)),
      dueTime: '11:00',
      createdAt: now,
      updatedAt: now,
    },
  ];
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load tasks', e);
  }
  const seeded = seedTasks();
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(seeded));
  return seeded;
}

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return DEFAULT_SETTINGS;
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(loadTasks);
  const [settings, setSettings] = useState(loadSettings);
  const lastDeleted = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings]);

  const addTask = useCallback((data) => {
    const now = new Date().toISOString();
    const newTask = {
      id: uuidv4(),
      title: data.title.trim(),
      description: data.description?.trim() || '',
      image: data.image || null,
      status: data.status || STATUS.TODO,
      priority: data.priority || PRIORITY.MEDIUM,
      category: data.category || 'general',
      tags: data.tags || [],
      dueDate: data.dueDate || '',
      dueTime: data.dueTime || '',
      createdAt: now,
      updatedAt: now,
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t))
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === id);
      lastDeleted.current = task ? { task, index: prev.indexOf(task) } : null;
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const undoDelete = useCallback(() => {
    if (!lastDeleted.current) return;
    const { task, index } = lastDeleted.current;
    setTasks((prev) => {
      const copy = [...prev];
      copy.splice(index, 0, task);
      return copy;
    });
    lastDeleted.current = null;
  }, []);

  const toggleComplete = useCallback((id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === STATUS.COMPLETED ? STATUS.TODO : STATUS.COMPLETED,
              updatedAt: new Date().toISOString(),
            }
          : t
      )
    );
  }, []);

  const changeStatus = useCallback((id, status) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status, updatedAt: new Date().toISOString() } : t)));
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === STATUS.COMPLETED).length;
    const inProgress = tasks.filter((t) => t.status === STATUS.IN_PROGRESS).length;
    const todo = tasks.filter((t) => t.status === STATUS.TODO).length;
    const overdue = tasks.filter((t) => {
      if (t.status === STATUS.COMPLETED || !t.dueDate) return false;
      const due = new Date(`${t.dueDate}T${t.dueTime || '23:59'}`);
      return due.getTime() < Date.now();
    }).length;
    const highPriority = tasks.filter((t) => t.priority === PRIORITY.HIGH && t.status !== STATUS.COMPLETED).length;
    const completionRate = total ? Math.round((completed / total) * 100) : 0;
    return { total, completed, inProgress, todo, overdue, highPriority, completionRate };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      settings,
      setSettings,
      addTask,
      updateTask,
      deleteTask,
      undoDelete,
      toggleComplete,
      changeStatus,
      stats,
    }),
    [tasks, settings, addTask, updateTask, deleteTask, undoDelete, toggleComplete, changeStatus, stats]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
