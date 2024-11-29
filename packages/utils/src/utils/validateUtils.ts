const isValidEmail = (value: string) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
};

const validateEmail = (value: string, setEmailError: (err: string) => void) => {
  if (value === "") {
    setEmailError("");
  } else if (isValidEmail(value)) {
    setEmailError("");
  } else {
    setEmailError("Invalid Email");
  }
};

const validatePassword = (
  value: string,
  setPasswordError: (err: string) => void
) => {
  if (value.length < 9) {
    setPasswordError("Password must be 9 characters");
  } else {
    setPasswordError("");
  }
};

const validateName = (value: string, setNameError: (err: string) => void) => {
  if (!value) {
    setNameError("Name can't be empty.");
  } else {
    setNameError("");
  }
};

const validateInput = (
  value: string,
  minLength: number,
  setError: (s: string) => void
) => {
  if (value.length < minLength) {
    setError("Invalid Input");
  } else {
    setError("");
  }
};

export const validateUtils = {
  isValidEmail,
  validateEmail,
  validatePassword,
  validateInput,
  validateName,
};
