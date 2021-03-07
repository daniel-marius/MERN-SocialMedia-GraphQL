module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username must not be empty!";
  }

  if (email.trim() === "") {
    errors.email = "Email must not be empty!";
  } else {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email.match(regex)) {
      errors.email = "Eamil must be a valid email address!";
    }
  }

  if (password === "") {
    errors.password = "Password must not be empty!";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords must match!";
  } else if (password === confirmPassword && password.length < 6) {
    errors.confirmPassword = "Passwords must have at least 6 characters!";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username must not be empty!";
  }

  if (password === "") {
    errors.password = "Password must not be empty!";
  } else if (password.length < 6) {
    errors.password = "Password must have at least 6 characters!";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1
  };
};
