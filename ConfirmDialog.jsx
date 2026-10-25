import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import { useModals } from '../contexts/ModalContext';
import { useLanguage } from '../contexts/LanguageContext';

export default function ConfirmDialog() {
  const { confirmState, closeConfirm } = useModals();
  const { t } = useLanguage();

  const handleConfirm = () => {
    confirmState.onConfirm?.();
    closeConfirm();
  };

  return (
    <Dialog open={confirmState.open} onClose={closeConfirm} PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ fontWeight: 700 }}>{t('modal_confirmDeleteTitle')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{t('modal_confirmDeleteBody')}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={closeConfirm} color="inherit">
          {t('action_cancel')}
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disableElevation>
          {t('action_delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
