import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  addMonths,
  addWeeks,
  addDays,
  isSameMonth,
  isSameDay,
  format,
} from 'date-fns';
import { useTasks } from '../contexts/TaskContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useModals } from '../contexts/ModalContext';
import { PRIORITY_COLORS } from '../utils/constants';

const WEEKDAY_KEYS = ['weekday_sun', 'weekday_mon', 'weekday_tue', 'weekday_wed', 'weekday_thu', 'weekday_fri', 'weekday_sat'];

export default function CalendarPage() {
  const { tasks } = useTasks();
  const { t, language } = useLanguage();
  const { openDetails } = useModals();
  const [view, setView] = useState('month');
  const [cursor, setCursor] = useState(new Date());

  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((tk) => {
      if (!tk.dueDate) return;
      if (!map[tk.dueDate]) map[tk.dueDate] = [];
      map[tk.dueDate].push(tk);
    });
    return map;
  }, [tasks]);

  const goPrev = () => {
    if (view === 'month') setCursor((d) => addMonths(d, -1));
    else if (view === 'week') setCursor((d) => addWeeks(d, -1));
    else setCursor((d) => addDays(d, -1));
  };
  const goNext = () => {
    if (view === 'month') setCursor((d) => addMonths(d, 1));
    else if (view === 'week') setCursor((d) => addWeeks(d, 1));
    else setCursor((d) => addDays(d, 1));
  };
  const goToday = () => setCursor(new Date());

  const dateKey = (d) => format(d, 'yyyy-MM-dd');
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  const headerLabel = useMemo(() => {
    if (view === 'day') return cursor.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    if (view === 'week') {
      const start = startOfWeek(cursor);
      const end = endOfWeek(cursor);
      return `${start.toLocaleDateString(locale, { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
      })}`;
    }
    return cursor.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  }, [view, cursor, locale]);

  const monthDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor));
    const end = endOfWeek(endOfMonth(cursor));
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor);
    const end = endOfWeek(cursor);
    return eachDayOfInterval({ start, end });
  }, [cursor]);

  const renderDayCell = (day, compact) => {
    const key = dateKey(day);
    const dayTasks = tasksByDate[key] || [];
    const inMonth = isSameMonth(day, cursor);
    const today = isSameDay(day, new Date());

    return (
      <Box
        key={key}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2.5,
          p: 1,
          minHeight: compact ? 96 : 220,
          bgcolor: today ? 'action.selected' : 'background.paper',
          opacity: inMonth ? 1 : 0.45,
          display: 'flex',
          flexDirection: 'column',
          gap: 0.5,
        }}
      >
        <Typography variant="caption" fontWeight={today ? 800 : 600} color={today ? 'primary.main' : 'text.secondary'}>
          {day.getDate()}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, overflowY: 'auto' }}>
          {dayTasks.slice(0, compact ? 3 : 8).map((tk) => (
            <Box
              key={tk.id}
              onClick={() => openDetails(tk)}
              sx={{
                fontSize: 11.5,
                fontWeight: 600,
                px: 0.75,
                py: 0.4,
                borderRadius: 1.5,
                cursor: 'pointer',
                bgcolor: PRIORITY_COLORS[tk.priority].bg,
                color: PRIORITY_COLORS[tk.priority].fg,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                textDecoration: tk.status === 'completed' ? 'line-through' : 'none',
              }}
            >
              {tk.title}
            </Box>
          ))}
          {dayTasks.length > (compact ? 3 : 8) && (
            <Typography variant="caption" color="text.secondary">
              +{dayTasks.length - (compact ? 3 : 8)}
            </Typography>
          )}
        </Box>
      </Box>
    );
  };

  const dayTasksList = (tasksByDate[dateKey(cursor)] || []);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {t('nav_calendar')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {headerLabel}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ToggleButtonGroup
            size="small"
            value={view}
            exclusive
            onChange={(e, v) => v && setView(v)}
            sx={{ bgcolor: 'action.hover', borderRadius: 2.5, p: 0.4 }}
          >
            <ToggleButton value="day" sx={{ border: 0, borderRadius: 2, px: 1.75 }}>
              {t('calendar_day')}
            </ToggleButton>
            <ToggleButton value="week" sx={{ border: 0, borderRadius: 2, px: 1.75 }}>
              {t('calendar_week')}
            </ToggleButton>
            <ToggleButton value="month" sx={{ border: 0, borderRadius: 2, px: 1.75 }}>
              {t('calendar_month')}
            </ToggleButton>
          </ToggleButtonGroup>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton onClick={goPrev} size="small">
              <ChevronLeftRoundedIcon />
            </IconButton>
            <Button size="small" onClick={goToday} sx={{ minWidth: 0 }}>
              {t('calendar_today')}
            </Button>
            <IconButton onClick={goNext} size="small">
              <ChevronRightRoundedIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>

      {view === 'month' && (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
            {WEEKDAY_KEYS.map((k) => (
              <Typography key={k} variant="caption" fontWeight={700} color="text.secondary" sx={{ textAlign: 'center' }}>
                {t(k)}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {monthDays.map((d) => renderDayCell(d, true))}
          </Box>
        </>
      )}

      {view === 'week' && (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1 }}>
            {weekDays.map((d) => (
              <Typography key={d.toISOString()} variant="caption" fontWeight={700} color="text.secondary" sx={{ textAlign: 'center' }}>
                {d.toLocaleDateString(locale, { weekday: 'short' })} {d.getDate()}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
            {weekDays.map((d) => renderDayCell(d, false))}
          </Box>
        </>
      )}

      {view === 'day' && (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3.5, p: 3 }}>
          {dayTasksList.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              {t('empty_noTasks_title')}
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {dayTasksList.map((tk) => (
                <Box
                  key={tk.id}
                  onClick={() => openDetails(tk)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 1.5,
                    borderRadius: 2.5,
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ textDecoration: tk.status === 'completed' ? 'line-through' : 'none' }}>
                      {tk.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {tk.dueTime}
                    </Typography>
                  </Box>
                  <Chip
                    label={t(`priority_${tk.priority}`)}
                    size="small"
                    sx={{ bgcolor: PRIORITY_COLORS[tk.priority].bg, color: PRIORITY_COLORS[tk.priority].fg }}
                  />
                </Box>
              ))}
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
}
