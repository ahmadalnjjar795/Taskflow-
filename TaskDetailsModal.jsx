import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import { useSnackbar } from 'notistack';
import { useModals } from '../contexts/ModalContext';
import { useTasks } from '../contexts/TaskContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PRIORITY_COLORS, STATUS_COLORS } from '../utils/constants';
import { formatDate, formatTime } from '../utils/helpers';

export default function TaskDetailsModal() {
  const { detailsState, closeDetails, openEdit, openConfirmDelete } = useModals();
  const { toggleComplete, deleteTask, undoDelete } = useTasks();
  const { t, language } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();

  const task = detailsState.task;
  if (!task) return null;

  const priorityColor = PRIORITY_COLORS[task.priority];
  const statusColor = STATUS_COLORS[task.status];

  const handleToggle = () => {
    toggleComplete(task.id);
    enqueueSnackbar(task.status === 'completed' ? t('toast_incomplete') : t('toast_completed'), {
      variant: 'success',
    });
  };

  const handleDelete = () => {
    closeDetails();
    openConfirmDelete(task, () => {
      deleteTask(task.id);
      enqueueSnackbar(t('toast_deleted'), {
        variant: 'info',
        action: (key) => (
          <Button
            size="small"
            color="inherit"
            onClick={() => {
              undoDelete();
            }}
          >
            {t('action_undo')}
          </Button>
        ),
      });
    });
  };

  return (
    <Dialog open={detailsState.open} onClose={closeDetails} fullWidth maxWidth="sm" PaperProps={{ sx: { borderRadius: 4 } }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1.5, pb: 0 }}>
        <IconButton onClick={closeDetails} size="small">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </Box>

      {task.image ? (
        <Box component="img" src={task.image} alt={t('imageAlt')} sx={{ width: '100%', height: 200, objectFit: 'cover' }} />
      ) : (
        <Box
          sx={{
            width: '100%',
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'action.hover',
            color: 'text.secondary',
          }}
        >
          <ImageRoundedIcon sx={{ fontSize: 36 }} />
        </Box>
      )}

      <DialogContent sx={{ pt: 3 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
          <Chip label={t(`priority_${task.priority}`)} size="small" sx={{ bgcolor: priorityColor.bg, color: priorityColor.fg }} />
          <Chip label={t(`status_${task.status}`)} size="small" sx={{ bgcolor: statusColor.bg, color: statusColor.fg }} />
          <Chip label={t(`category_${task.category}`)} size="small" variant="outlined" />
        </Box>

        <Typography variant="h5" fontWeight={700} sx={{ mb: 1, fontFamily: "'Fraunces', serif" }}>
          {task.title}
        </Typography>

        {task.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {task.description}
          </Typography>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2 }}>
          <InfoRow label={t('task_dueDate')} value={formatDate(task.dueDate, language) || '—'} />
          <InfoRow label={t('task_dueTime')} value={formatTime(task.dueTime, language) || '—'} />
          <InfoRow label={t('task_createdAt')} value={formatDate(task.createdAt, language)} />
          <InfoRow label={t('task_updatedAt')} value={formatDate(task.updatedAt, language)} />
        </Box>

        {task.tags?.length > 0 && (
          <>
            <Divider sx={{ mb: 1.5 }} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
              {task.tags.map((tag) => (
                <Chip key={tag} label={`#${tag}`} size="small" variant="outlined" />
              ))}
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, flexWrap: 'wrap', gap: 1 }}>
        <Button
          onClick={handleToggle}
          startIcon={<CheckCircleRoundedIcon />}
          color={task.status === 'completed' ? 'inherit' : 'secondary'}
          variant={task.status === 'completed' ? 'outlined' : 'contained'}
          disableElevation
        >
          {task.status === 'completed' ? t('action_markIncomplete') : t('action_markComplete')}
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button onClick={handleDelete} color="error" startIcon={<DeleteRoundedIcon />}>
          {t('action_delete')}
        </Button>
        <Button
          onClick={() => {
            closeDetails();
            openEdit(task);
          }}
          variant="contained"
          disableElevation
          startIcon={<EditRoundedIcon />}
        >
          {t('action_edit')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function InfoRow({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  );
}
