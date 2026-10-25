import React, { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { useTasks } from '../contexts/TaskContext';
import { useLanguage } from '../contexts/LanguageContext';
import TaskCard from '../components/TaskCard';
import FilterBar from '../components/FilterBar';
import EmptyState from '../components/EmptyState';
import { filterTasks, searchTasks, sortTasks, isToday, isUpcoming } from '../utils/helpers';

export default function AllTasks({ search, title, filterMode }) {
  const { tasks } = useTasks();
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const baseTasks = useMemo(() => {
    switch (filterMode) {
      case 'today':
        return tasks.filter((tk) => isToday(tk.dueDate));
      case 'upcoming':
        return tasks.filter((tk) => isUpcoming(tk.dueDate));
      case 'statusCompleted':
        return tasks.filter((tk) => tk.status === 'completed');
      default:
        return tasks;
    }
  }, [tasks, filterMode]);

  const visibleTasks = useMemo(() => {
    let list = filterTasks(baseTasks, filter);
    list = searchTasks(list, search);
    list = sortTasks(list, sortBy);
    return list;
  }, [baseTasks, filter, search, sortBy]);

  const hasAnyTasks = baseTasks.length > 0;

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 0.5, fontWeight: 700 }}>
        {t(title)}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {visibleTasks.length} {t('nav_allTasks').toLowerCase()}
      </Typography>

      <FilterBar filter={filter} onFilterChange={setFilter} sortBy={sortBy} onSortChange={setSortBy} />

      {visibleTasks.length === 0 ? (
        <EmptyState variant={hasAnyTasks ? 'noResults' : 'noTasks'} />
      ) : (
        <Grid container spacing={2.5}>
          {visibleTasks.map((task) => (
            <Grid item xs={12} sm={6} lg={4} xl={3} key={task.id}>
              <TaskCard task={task} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
