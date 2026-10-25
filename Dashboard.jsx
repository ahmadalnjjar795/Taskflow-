import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import PendingActionsRoundedIcon from '@mui/icons-material/PendingActionsRounded';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { useTasks } from '../contexts/TaskContext';
import { useLanguage } from '../contexts/LanguageContext';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import { isToday, isUpcoming, getGreetingKey } from '../utils/helpers';
import { PRIORITY_LIST, PRIORITY_COLORS, STATUS_LIST, STATUS_COLORS } from '../utils/constants';
import { Link as RouterLink } from 'react-router-dom';

export default function Dashboard({ search }) {
  const { tasks, stats } = useTasks();
  const { t } = useLanguage();

  const todayTasks = useMemo(() => tasks.filter((tk) => isToday(tk.dueDate)).slice(0, 4), [tasks]);
  const upcomingTasks = useMemo(() => tasks.filter((tk) => isUpcoming(tk.dueDate)).slice(0, 4), [tasks]);

  const byPriority = useMemo(
    () => PRIORITY_LIST.map((p) => ({ key: p, count: tasks.filter((tk) => tk.priority === p).length })),
    [tasks]
  );
  const byStatus = useMemo(
    () => STATUS_LIST.map((s) => ({ key: s, count: tasks.filter((tk) => tk.status === s).length })),
    [tasks]
  );
  const maxPriorityCount = Math.max(1, ...byPriority.map((p) => p.count));

  const recentActivity = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 5),
    [tasks]
  );

  return (
    <Box>
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
          {t(getGreetingKey())} 👋
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {t('dashboard_subtitle')}
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3.5 }}>
        <Grid item xs={6} sm={4} lg={2}>
          <StatsCard icon={<ChecklistRoundedIcon />} label={t('stats_total')} value={stats.total} color="var(--accent-strong)" bg="var(--amber-100)" />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <StatsCard icon={<TaskAltRoundedIcon />} label={t('stats_completed')} value={stats.completed} color="var(--teal-600)" bg="var(--teal-100)" />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <StatsCard icon={<PendingActionsRoundedIcon />} label={t('stats_inProgress')} value={stats.inProgress} color="var(--blue-500)" bg="var(--blue-100)" />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <StatsCard icon={<ReportProblemRoundedIcon />} label={t('stats_overdue')} value={stats.overdue} color="var(--red-500)" bg="var(--red-100)" />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <StatsCard icon={<ReportProblemRoundedIcon />} label={t('stats_highPriority')} value={stats.highPriority} color="var(--red-500)" bg="var(--red-100)" />
        </Grid>
        <Grid item xs={6} sm={4} lg={2}>
          <Paper
            elevation={0}
            sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3.5, p: 2, display: 'flex', alignItems: 'center', gap: 1.5, height: '100%' }}
          >
            <CircularProgress variant="determinate" value={stats.completionRate} size={44} thickness={5} sx={{ color: 'primary.main' }} />
            <Box>
              <Typography variant="subtitle1" fontWeight={800}>
                {stats.completionRate}%
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t('stats_completionRate')}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <SectionBlock title={t('section_todayTasks')} to="/today">
            {todayTasks.length === 0 ? (
              <EmptyState variant="noTasks" />
            ) : (
              <Grid container spacing={2.5}>
                {todayTasks.map((task) => (
                  <Grid item xs={12} sm={6} key={task.id}>
                    <TaskCard task={task} />
                  </Grid>
                ))}
              </Grid>
            )}
          </SectionBlock>

          <SectionBlock title={t('section_upcomingTasks')} to="/upcoming">
            {upcomingTasks.length === 0 ? (
              <EmptyState variant="noTasks" />
            ) : (
              <Grid container spacing={2.5}>
                {upcomingTasks.map((task) => (
                  <Grid item xs={12} sm={6} key={task.id}>
                    <TaskCard task={task} />
                  </Grid>
                ))}
              </Grid>
            )}
          </SectionBlock>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3.5, p: 2.5, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              {t('section_byPriority')}
            </Typography>
            {byPriority.map((p) => (
              <Box key={p.key} sx={{ mb: 1.75 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {t(`priority_${p.key}`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.count}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={(p.count / maxPriorityCount) * 100}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    bgcolor: 'action.hover',
                    '& .MuiLinearProgress-bar': { bgcolor: PRIORITY_COLORS[p.key].fg, borderRadius: 5 },
                  }}
                />
              </Box>
            ))}
          </Paper>

          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3.5, p: 2.5, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>
              {t('section_byStatus')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {byStatus.map((s) => (
                <Chip
                  key={s.key}
                  label={`${t(`status_${s.key}`)} · ${s.count}`}
                  sx={{ bgcolor: STATUS_COLORS[s.key].bg, color: STATUS_COLORS[s.key].fg, fontWeight: 700 }}
                />
              ))}
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3.5, p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1.5 }}>
              {t('section_recentActivity')}
            </Typography>
            {recentActivity.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            ) : (
              recentActivity.map((task) => (
                <Box
                  key={task.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-of-type': { borderBottom: 'none' },
                  }}
                >
                  <Typography variant="body2" fontWeight={600} noWrap sx={{ maxWidth: '70%' }}>
                    {task.title}
                  </Typography>
                  <Chip
                    label={t(`status_${task.status}`)}
                    size="small"
                    sx={{ bgcolor: STATUS_COLORS[task.status].bg, color: STATUS_COLORS[task.status].fg, height: 22, fontSize: 11 }}
                  />
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

function SectionBlock({ title, to, children }) {
  const { t } = useLanguage();
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          {title}
        </Typography>
        <Button component={RouterLink} to={to} size="small" endIcon={<ArrowForwardRoundedIcon />}>
          {t('viewAll')}
        </Button>
      </Box>
      {children}
    </Box>
  );
}
