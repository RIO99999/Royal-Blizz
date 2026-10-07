// Shared client-side validation rules (mirror the backend utils/validators.js).

export const NAME_REGEX = /^[A-Za-z][A-Za-z\s'.-]*$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
export const PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

export const NAME_HINT = 'Name must be at least 3 characters long and contain only letters';
export const PASSWORD_HINT =
  'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, a number, and a special character';
export const PHONE_HINT = 'Phone number must include a country code (e.g. +2348012345678)';

export const validateName = (name) => {
  const value = String(name || '').trim();
  return NAME_REGEX.test(value) && value.replace(/[^A-Za-z]/g, '').length >= 3;
};

export const validatePassword = (password) => PASSWORD_REGEX.test(String(password || ''));

export const validatePhone = (phone) => PHONE_REGEX.test(String(phone || '').trim());
