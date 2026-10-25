import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import SearchOffRoundedIcon from '@mui/icons-material/SearchOffRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useLanguage } from '../contexts/LanguageContext';
import { useModals } from '../contexts/ModalContext';

export default function EmptyState({ variant = 'noTasks' }) {
  const { t } = useLanguage();
  const { openCreate } = useModals();
  const isSearch = variant === 'noResults';

  return (
    <Box
      className="tf-fade-in"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        py: 8,
        px: 3,
      }}
    >
      <Box
        sx={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
          mb: 2.5,
        }}
      >
        {isSearch ? <SearchOffRoundedIcon sx={{ fontSize: 32 }} /> : <InboxRoundedIcon sx={{ fontSize: 32 }} />}
      </Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
        {isSearch ? t('empty_noResults_title') : t('empty_noTasks_title')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 320 }}>
        {isSearch ? t('empty_noResults_subtitle') : t('empty_noTasks_subtitle')}
      </Typography>
      {!isSearch && (
        <Button variant="contained" disableElevation startIcon={<AddRoundedIcon />} onClick={openCreate}>
          {t('empty_createTask')}
        </Button>
      )}
    </Box>
  );
}
