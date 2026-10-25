const ERROR_KEYS = {
  'auth/invalid-email': 'auth_err_invalidEmail',
  'auth/user-disabled': 'auth_err_userDisabled',
  'auth/user-not-found': 'auth_err_userNotFound',
  'auth/wrong-password': 'auth_err_wrongPassword',
  'auth/invalid-credential': 'auth_err_wrongPassword',
  'auth/email-already-in-use': 'auth_err_emailInUse',
  'auth/weak-password': 'auth_err_weakPassword',
  'auth/too-many-requests': 'auth_err_tooManyRequests',
  'auth/network-request-failed': 'auth_err_network',
};

export function getAuthErrorKey(error) {
  const code = error?.code || '';
  return ERROR_KEYS[code] || 'auth_err_generic';
}
