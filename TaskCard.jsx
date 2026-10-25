import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import { useSnackbar } from 'notistack';
import { useTasks } from '../contexts/TaskContext';
import { useModals } from '../contexts/ModalContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PRIORITY_COLORS, STATUS_COLORS, STATUS_LIST } from '../utils/constants';
import { formatDate, formatTime, isOverdue } from '../utils/helpers';

export default function TaskCard({ task }) {
  const { toggleComplete, deleteTask, undoDelete, changeStatus } = useTasks();
  const { openEdit, openDetails, openConfirmDelete } = useModals();
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const priorityColor = PRIORITY_COLORS[task.priority];
  const statusColor = STATUS_COLORS[task.status];
  const overdue = isOverdue(task);
  const completed = task.status === 'completed';

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleComplete(task.id);
    enqueueSnackbar(completed ? t('toast_incomplete') : t('toast_completed'), { variant: 'success' });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setAnchorEl(null);
    openConfirmDelete(task, () => {
      deleteTask(task.id);
      enqueueSnackbar(t('toast_deleted'), {
        variant: 'info',
        action: () => (
          <IconButton size="small" color="inherit" onClick={() => undoDelete()}>
            <Typography variant="button" color="inherit" sx={{ fontSize: 12 }}>
              {t('action_undo')}
            </Typography>
          </IconButton>
        ),
      });
    });
  };

  const handleStatusChange = (status) => (e) => {
    e.stopPropagation();
    changeStatus(task.id, status);
    setAnchorEl(null);
  };

  return (
    <Paper
      onClick={() => openDetails(task)}
      elevation={0}
      className="tf-fade-in"
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3.5,
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
        opacity: completed ? 0.72 : 1,
        '&:hover': { transform: 'translateY(-3px)', boxShadow: 'var(--shadow-md)' },
      }}
    >
      {task.image ? (
        <Box component="img" src={task.image} alt={t('imageAlt')} sx={{ width: '100%', height: 132, objectFit: 'cover' }} />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: 90,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.hover',
            color: 'text.disabled',
          }}
        >
          <ImageRoundedIcon sx={{ fontSize: 28 }} />
        </Box>
      )}

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
          <Checkbox
            checked={completed}
            onChange={handleToggle}
            onClick={(e) => e.stopPropagation()}
            size="small"
            sx={{ p: 0.5, mt: 0.25 }}
          />
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{
              flex: 1,
              textDecoration: completed ? 'line-through' : 'none',
              color: completed ? 'text.secondary' : 'text.primary',
            }}
          >
            {task.title}
          </Typography>
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchorEl(e.currentTarget); }}>
            <MoreVertRoundedIcon fontSize="small" />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={(e) => setAnchorEl(null)} onClick={(e) => e.stopPropagation()}>
            <MenuItem onClick={(e) => { e.stopPropagation(); setAnchorEl(null); openEdit(task); }}>
              <EditRoundedIcon fontSize="small" sx={{ mr: 1 }} /> {t('action_edit')}
            </MenuItem>
            {STATUS_LIST.filter((s) => s !== task.status).map((s) => (
              <MenuItem key={s} onClick={handleStatusChange(s)}>
                {t(`status_${s}`)}
              </MenuItem>
            ))}
            <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
              <DeleteRoundedIcon fontSize="small" sx={{ mr: 1 }} /> {t('action_delete')}
            </MenuItem>
          </Menu>
        </Box>

        {task.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 1.25,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', mb: 1.25 }}>
          <Chip label={t(`priority_${task.priority}`)} size="small" sx={{ bgcolor: priorityColor.bg, color: priorityColor.fg, height: 22, fontSize: 11.5 }} />
          <Chip label={t(`status_${task.status}`)} size="small" sx={{ bgcolor: statusColor.bg, color: statusColor.fg, height: 22, fontSize: 11.5 }} />
          {overdue && (
            <Chip label={t('stats_overdue')} size="small" sx={{ bgcolor: 'var(--red-100)', color: 'var(--red-500)', height: 22, fontSize: 11.5 }} />
          )}
        </Box>

        {task.tags?.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1.25 }}>
            {task.tags.slice(0, 3).map((tag) => (
              <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" sx={{ height: 20, fontSize: 11 }} />
            ))}
          </Box>
        )}

        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.secondary' }}>
          {task.dueDate && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayRoundedIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{formatDate(task.dueDate, language)}</Typography>
            </Box>
          )}
          {task.dueTime && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeRoundedIcon sx={{ fontSize: 14 }} />
              <Typography variant="caption">{formatTime(task.dueTime, language)}</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
