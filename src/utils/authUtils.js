export const getAuthErrorMessage = (code) => {
  const messages = {
    'auth/user-not-found':          'No account found with this email.',
    'auth/wrong-password':          'Incorrect password.',
    'auth/email-already-in-use':    'This email is already registered.',
    'auth/weak-password':           'Password must be at least 6 characters.',
    'auth/invalid-email':           'Please enter a valid email address.',
    'auth/too-many-requests':       'Too many attempts. Please try again later.',
    'auth/network-request-failed':  'Network error. Check your connection.',
    'auth/invalid-credential':      'Invalid email or password.',
    'auth/popup-closed-by-user':    'Sign-in popup was closed. Try again.',
    'auth/cancelled-popup-request': 'Only one popup at a time.',
  }
  return messages[code] ?? 'Something went wrong. Please try again.'
}