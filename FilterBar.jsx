import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useLanguage } from '../contexts/LanguageContext';

const FILTERS = ['all', 'todo', 'inProgress', 'completed', 'highPriority', 'mediumPriority', 'lowPriority'];
const SORTS = ['newest', 'oldest', 'dueDate', 'priority', 'alphabetical'];

export default function FilterBar({ filter, onFilterChange, sortBy, onSortChange }) {
  const { t } = useLanguage();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        flexWrap: 'wrap',
        mb: 2.5,
      }}
    >
      <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
        {FILTERS.map((f) => (
          <Chip
            key={f}
            label={t(`filter_${f}`)}
            onClick={() => onFilterChange(f)}
            variant={filter === f ? 'filled' : 'outlined'}
            color={filter === f ? 'primary' : 'default'}
            sx={{ fontWeight: 600 }}
          />
        ))}
      </Box>

      <TextField
        select
        size="small"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        label={t('sort_label')}
        sx={{ minWidth: 160 }}
      >
        {SORTS.map((s) => (
          <MenuItem key={s} value={s}>
            {t(`sort_${s}`)}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
