import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [formState, setFormState] = useState({ open: false, task: null });
  const [detailsState, setDetailsState] = useState({ open: false, task: null });
  const [confirmState, setConfirmState] = useState({ open: false, task: null, onConfirm: null });

  const openCreate = useCallback(() => setFormState({ open: true, task: null }), []);
  const openEdit = useCallback((task) => setFormState({ open: true, task }), []);
  const closeForm = useCallback(() => setFormState({ open: false, task: null }), []);

  const openDetails = useCallback((task) => setDetailsState({ open: true, task }), []);
  const closeDetails = useCallback(() => setDetailsState({ open: false, task: null }), []);

  const openConfirmDelete = useCallback((task, onConfirm) => {
    setConfirmState({ open: true, task, onConfirm });
  }, []);
  const closeConfirm = useCallback(() => setConfirmState({ open: false, task: null, onConfirm: null }), []);

  const value = useMemo(
    () => ({
      formState,
      openCreate,
      openEdit,
      closeForm,
      detailsState,
      openDetails,
      closeDetails,
      confirmState,
      openConfirmDelete,
      closeConfirm,
    }),
    [formState, detailsState, confirmState, openCreate, openEdit, closeForm, openDetails, closeDetails, openConfirmDelete, closeConfirm]
  );

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}

export function useModals() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModals must be used within ModalProvider');
  return ctx;
}
