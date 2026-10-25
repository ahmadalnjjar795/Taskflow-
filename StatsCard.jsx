import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function StatsCard({ icon, label, value, color = 'var(--accent)', bg = 'var(--amber-100)' }) {
  return (
    <Paper
      elevation={0}
      className="tf-fade-in"
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3.5,
        p: 2.25,
        display: 'flex',
        alignItems: 'center',
        gap: 1.75,
        height: '100%',
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: 'var(--shadow-sm)' },
      }}
    >
      <Box
        sx={{
          width: 46,
          height: 46,
          borderRadius: 2.5,
          bgcolor: bg,
          color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="h5" fontWeight={800} sx={{ lineHeight: 1.1, fontFamily: "'Fraunces', serif" }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary" noWrap>
          {label}
        </Typography>
      </Box>
    </Paper>
  );
}
