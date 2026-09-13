const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegisterInput = ({
  name,
  email,
  password,
}) => {
  if (!name || !email || !password) {
    return "Name, email and password are required";
  }

  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }

  if (name.trim().length > 100) {
    return "Name cannot exceed 100 characters";
  }

  if (!emailRegex.test(email.trim().toLowerCase())) {
    return "Please provide a valid email address";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};

export const validateLoginInput = ({
  email,
  password,
}) => {
  if (!email || !password) {
    return "Email and password are required";
  }

  if (!emailRegex.test(email.trim().toLowerCase())) {
    return "Please provide a valid email address";
  }

  return null;
};

export const validateForgotPasswordInput = ({ email }) => {
  if (!email) {
    return "Email is required";
  }

  if (!emailRegex.test(email.trim().toLowerCase())) {
    return "Please provide a valid email address";
  }

  return null;
};

export const validateResetPasswordInput = ({
  token,
  password,
}) => {
  if (!token || !password) {
    return "Reset token and new password are required";
  }

  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }

  return null;
};