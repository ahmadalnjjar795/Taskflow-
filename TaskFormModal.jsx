import React, { useEffect, useRef, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded';
import { useSnackbar } from 'notistack';
import { useModals } from '../contexts/ModalContext';
import { useTasks } from '../contexts/TaskContext';
import { useLanguage } from '../contexts/LanguageContext';
import { PRIORITY_LIST, STATUS_LIST, DEFAULT_CATEGORIES } from '../utils/constants';
import { readFileAsDataUrl } from '../utils/helpers';

const emptyForm = {
  title: '',
  description: '',
  image: null,
  dueDate: '',
  dueTime: '',
  priority: 'medium',
  status: 'todo',
  category: 'general',
  tags: [],
};

export default function TaskFormModal() {
  const { formState, closeForm } = useModals();
  const { addTask, updateTask, settings } = useTasks();
  const { t } = useLanguage();
  const { enqueueSnackbar } = useSnackbar();
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(emptyForm);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(formState.task);

  useEffect(() => {
    if (formState.open) {
      if (formState.task) {
        setForm({ ...emptyForm, ...formState.task });
      } else {
        setForm({ ...emptyForm, priority: settings.defaultPriority, status: settings.defaultStatus });
      }
      setErrors({});
      setTagInput('');
    }
  }, [formState.open, formState.task, settings]);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataUrl(file);
    setForm((prev) => ({ ...prev, image: dataUrl }));
  };

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) {
        setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({ ...prev, tags: prev.tags.filter((tg) => tg !== tag) }));
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = t('validation_titleRequired');
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (isEdit) {
      updateTask(formState.task.id, form);
      enqueueSnackbar(t('toast_updated'), { variant: 'success' });
    } else {
      addTask(form);
      enqueueSnackbar(t('toast_created'), { variant: 'success' });
    }
    closeForm();
  };

  return (
    <Dialog
      open={formState.open}
      onClose={closeForm}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { borderRadius: 4 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          {isEdit ? t('modal_editTask') : t('modal_newTask')}
        </Typography>
        <IconButton onClick={closeForm} size="small">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label={t('task_title')}
              value={form.title}
              onChange={handleChange('title')}
              error={Boolean(errors.title)}
              helperText={errors.title}
              fullWidth
              autoFocus
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={t('task_description')}
              value={form.description}
              onChange={handleChange('description')}
              fullWidth
              multiline
              minRows={3}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              {t('task_image')}
            </Typography>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImagePick}
              style={{ display: 'none' }}
            />
            {form.image ? (
              <Box sx={{ position: 'relative', width: 'fit-content' }}>
                <Box
                  component="img"
                  src={form.image}
                  alt={t('imageAlt')}
                  sx={{ width: 160, height: 110, objectFit: 'cover', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}
                />
                <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                  <Button size="small" onClick={() => fileInputRef.current?.click()}>
                    {t('action_changeImage')}
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteRoundedIcon fontSize="small" />}
                    onClick={() => setForm((prev) => ({ ...prev, image: null }))}
                  >
                    {t('action_removeImage')}
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 3,
                  py: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  color: 'text.secondary',
                  transition: 'all 0.2s ease',
                  '&:hover': { borderColor: 'primary.main', color: 'primary.main', bgcolor: 'action.hover' },
                }}
              >
                <CloudUploadRoundedIcon sx={{ fontSize: 28, mb: 0.5 }} />
                <Typography variant="body2">{t('action_uploadImage')}</Typography>
              </Box>
            )}
          </Grid>

          <Grid item xs={6}>
            <TextField
              label={t('task_dueDate')}
              type="date"
              value={form.dueDate}
              onChange={handleChange('dueDate')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label={t('task_dueTime')}
              type="time"
              value={form.dueTime}
              onChange={handleChange('dueTime')}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField select label={t('task_priority')} value={form.priority} onChange={handleChange('priority')} fullWidth>
              {PRIORITY_LIST.map((p) => (
                <MenuItem key={p} value={p}>
                  {t(`priority_${p}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            <TextField select label={t('task_status')} value={form.status} onChange={handleChange('status')} fullWidth>
              {STATUS_LIST.map((s) => (
                <MenuItem key={s} value={s}>
                  {t(`status_${s}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField select label={t('task_category')} value={form.category} onChange={handleChange('category')} fullWidth>
              {DEFAULT_CATEGORIES.map((c) => (
                <MenuItem key={c} value={c}>
                  {t(`category_${c}`)}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              label={t('task_tags')}
              placeholder={t('tags_placeholder')}
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              fullWidth
            />
            {form.tags.length > 0 && (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75, mt: 1 }}>
                {form.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" onDelete={() => removeTag(tag)} />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={closeForm} color="inherit">
          {t('action_cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" disableElevation>
          {isEdit ? t('action_update') : t('action_create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
