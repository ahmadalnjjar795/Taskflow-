import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import { useLanguage } from '../contexts/LanguageContext';
import { useThemeMode } from '../contexts/ThemeContext';
import { useTasks } from '../contexts/TaskContext';
import { PRIORITY_LIST, STATUS_LIST } from '../utils/constants';

function SettingsSection({ title, description, children }) {
  return (
    <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3.5, p: 3, mb: 2.5 }}>
      <Typography variant="subtitle1" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        {description}
      </Typography>
      {children}
    </Paper>
  );
}

export default function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { mode, setMode } = useThemeMode();
  const { settings, setSettings } = useTasks();

  return (
    <Box sx={{ maxWidth: 720 }}>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        {t('nav_settings')}
      </Typography>

      <SettingsSection title={t('settings_appearance')} description={t('settings_appearanceDesc')}>
        <ToggleButtonGroup value={mode} exclusive onChange={(e, v) => v && setMode(v)}>
          <ToggleButton value="light" sx={{ px: 3, gap: 1 }}>
            <LightModeRoundedIcon fontSize="small" /> {t('header_lightMode')}
          </ToggleButton>
          <ToggleButton value="dark" sx={{ px: 3, gap: 1 }}>
            <DarkModeRoundedIcon fontSize="small" /> {t('header_darkMode')}
          </ToggleButton>
        </ToggleButtonGroup>
      </SettingsSection>

      <SettingsSection title={t('settings_language')} description={t('settings_languageDesc')}>
        <ToggleButtonGroup value={language} exclusive onChange={(e, v) => v && setLanguage(v)}>
          <ToggleButton value="en" sx={{ px: 3 }}>
            English
          </ToggleButton>
          <ToggleButton value="ar" sx={{ px: 3 }}>
            العربية
          </ToggleButton>
        </ToggleButtonGroup>
      </SettingsSection>

      <SettingsSection title={t('settings_notifications')} description={t('settings_notificationsDesc')}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="body2" fontWeight={600}>
            {t('settings_enableNotifications')}
          </Typography>
          <Switch
            checked={settings.notificationsEnabled}
            onChange={(e) => setSettings((prev) => ({ ...prev, notificationsEnabled: e.target.checked }))}
          />
        </Box>
      </SettingsSection>

      <SettingsSection title={t('settings_taskPreferences')} description={t('settings_taskPreferencesDesc')}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <TextField
            select
            label={t('settings_defaultPriority')}
            value={settings.defaultPriority}
            onChange={(e) => setSettings((prev) => ({ ...prev, defaultPriority: e.target.value }))}
            sx={{ minWidth: 200 }}
          >
            {PRIORITY_LIST.map((p) => (
              <MenuItem key={p} value={p}>
                {t(`priority_${p}`)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label={t('settings_defaultStatus')}
            value={settings.defaultStatus}
            onChange={(e) => setSettings((prev) => ({ ...prev, defaultStatus: e.target.value }))}
            sx={{ minWidth: 200 }}
          >
            {STATUS_LIST.map((s) => (
              <MenuItem key={s} value={s}>
                {t(`status_${s}`)}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </SettingsSection>
    </Box>
  );
}
