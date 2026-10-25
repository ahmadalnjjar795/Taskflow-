import React from 'react';
import { NavLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import TodayRoundedIcon from '@mui/icons-material/TodayRounded';
import UpcomingRoundedIcon from '@mui/icons-material/UpcomingRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import LanguageRoundedIcon from '@mui/icons-material/LanguageRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import Tooltip from '@mui/material/Tooltip';
import { useLanguage } from '../contexts/LanguageContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

const SIDEBAR_WIDTH = 264;

function NavItems({ t, onNavigate }) {
  const items = [
    { to: '/', label: t('nav_dashboard'), icon: <DashboardRoundedIcon /> },
    { to: '/tasks', label: t('nav_allTasks'), icon: <ChecklistRoundedIcon /> },
    { to: '/today', label: t('nav_today'), icon: <TodayRoundedIcon /> },
    { to: '/upcoming', label: t('nav_upcoming'), icon: <UpcomingRoundedIcon /> },
    { to: '/calendar', label: t('nav_calendar'), icon: <CalendarMonthRoundedIcon /> },
    { to: '/completed', label: t('nav_completed'), icon: <TaskAltRoundedIcon /> },
  ];
  return (
    <List sx={{ px: 1.5, py: 1 }}>
      {items.map((item) => (
        <ListItemButton
          key={item.to}
          component={NavLink}
          to={item.to}
          end={item.to === '/'}
          onClick={onNavigate}
          sx={{
            borderRadius: 2.5,
            mb: 0.5,
            py: 1,
            '&.active': {
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: 14.5 }} primary={item.label} />
        </ListItemButton>
      ))}
    </List>
  );
}

function SidebarContent({ onNavigate }) {
  const { t, language, toggleLanguage, isRTL } = useLanguage();
  const { isDark, toggleMode } = useThemeMode();
  const { user, logout } = useAuth();

  const displayName = user?.displayName || user?.email?.split('@')[0] || t('user_guest');
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

  const handleLogout = async () => {
    if (onNavigate) onNavigate();
    await logout();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ px: 3, pt: 3, pb: 2, display: 'flex', alignItems: 'center', gap: 1.25 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '11px',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Fraunces', serif",
            fontWeight: 700,
            fontSize: 18,
            color: 'primary.contrastText',
            flexShrink: 0,
          }}
        >
          T
        </Box>
        <Box>
          <Typography sx={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 19, lineHeight: 1.1 }}>
            {t('appName')}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {t('tagline')}
          </Typography>
        </Box>
      </Box>

      <Divider />
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <NavItems t={t} onNavigate={onNavigate} />
      </Box>

      <Divider />
      <List sx={{ px: 1.5, py: 1 }}>
        <ListItemButton component={NavLink} to="/settings" onClick={onNavigate} sx={{ borderRadius: 2.5 }}>
          <ListItemIcon sx={{ minWidth: 40 }}>
            <SettingsRoundedIcon />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 600, fontSize: 14.5 }} primary={t('nav_settings')} />
        </ListItemButton>
      </List>

      <Box sx={{ px: 2.5, pb: 2, pt: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'action.hover',
            borderRadius: 3,
            px: 1.5,
            py: 1,
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {isDark ? <DarkModeRoundedIcon fontSize="small" /> : <LightModeRoundedIcon fontSize="small" />}
            <Typography variant="body2" fontWeight={600}>
              {isDark ? t('header_darkMode') : t('header_lightMode')}
            </Typography>
          </Box>
          <Switch size="small" checked={isDark} onChange={toggleMode} />
        </Box>

        <ListItemButton onClick={toggleLanguage} sx={{ borderRadius: 3, bgcolor: 'action.hover', mb: 1.5 }}>
          <ListItemIcon sx={{ minWidth: 32 }}>
            <LanguageRoundedIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primaryTypographyProps={{ fontWeight: 600, fontSize: 13.5 }}
            primary={language === 'en' ? 'EN' : 'AR'}
            secondary={language === 'en' ? 'العربية' : 'English'}
          />
        </ListItemButton>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 0.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: 'secondary.main', fontSize: 14 }}>{initial}</Avatar>
          <Box sx={{ overflow: 'hidden', flex: 1 }}>
            <Typography variant="body2" fontWeight={700} noWrap>
              {displayName}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || ''}
            </Typography>
          </Box>
          <Tooltip title={t('auth_logout')}>
            <IconButton onClick={handleLogout} size="small" aria-label={t('auth_logout')}>
              <LogoutRoundedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

export default function Sidebar({ mobileOpen, onClose }) {
  const { isRTL } = useLanguage();

  return (
    <>
      <Box
        component="nav"
        sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: 'none', md: 'block' },
          borderInlineEnd: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ position: 'fixed', width: SIDEBAR_WIDTH, height: '100vh' }}>
          <SidebarContent />
        </Box>
      </Box>

      <Drawer
        anchor={isRTL ? 'right' : 'left'}
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{ display: { xs: 'block', md: 'none' } }}
        PaperProps={{ sx: { width: SIDEBAR_WIDTH } }}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>
    </>
  );
}

export { SIDEBAR_WIDTH };
