import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import TranslateRoundedIcon from '@mui/icons-material/TranslateRounded';
import { useLanguage } from '../contexts/LanguageContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { useModals } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header({ onMenuClick, search, onSearchChange }) {
  const { t, toggleLanguage, language } = useLanguage();
  const { isDark, toggleMode } = useThemeMode();
  const { openCreate } = useModals();
  const { user } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);

  const displayName = user?.displayName || user?.email?.split('@')[0] || t('user_guest');
  const initial = displayName.trim().charAt(0).toUpperCase() || 'U';

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        bgcolor: 'background.default',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Toolbar sx={{ gap: 1.5, py: 1.25, px: { xs: 1.5, sm: 3 } }}>
        <IconButton onClick={onMenuClick} sx={{ display: { xs: 'inline-flex', md: 'none' } }} aria-label="menu">
          <MenuRoundedIcon />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'action.hover',
            borderRadius: 3,
            px: 1.5,
            py: 0.5,
            flex: 1,
            maxWidth: 480,
          }}
        >
          <SearchRoundedIcon fontSize="small" color="action" />
          <InputBase
            placeholder={t('header_searchPlaceholder')}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
            inputProps={{ 'aria-label': t('header_searchPlaceholder') }}
            sx={{ fontSize: 14 }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        <Button
          onClick={openCreate}
          variant="contained"
          disableElevation
          startIcon={<AddRoundedIcon />}
          sx={{ display: { xs: 'none', sm: 'inline-flex' }, borderRadius: 2.5, px: 2.25 }}
        >
          {t('header_addTask')}
        </Button>
        <Tooltip title={t('header_addTask')}>
          <IconButton
            onClick={openCreate}
            color="primary"
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, bgcolor: 'primary.main', color: 'primary.contrastText' }}
          >
            <AddRoundedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={language === 'en' ? 'العربية' : 'English'}>
          <IconButton onClick={toggleLanguage} aria-label="toggle language">
            <TranslateRoundedIcon />
          </IconButton>
        </Tooltip>

        <Tooltip title={isDark ? t('header_lightMode') : t('header_darkMode')}>
          <IconButton onClick={toggleMode} aria-label="toggle theme">
            {isDark ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={t('header_notifications')}>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} aria-label="notifications">
            <Badge color="primary" variant="dot">
              <NotificationsNoneRoundedIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
          <MenuItem disabled>
            <Typography variant="body2">{t('header_notifications')}</Typography>
          </MenuItem>
        </Menu>

        <Tooltip title={displayName}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 13 }}>{initial}</Avatar>
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
}
