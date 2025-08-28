const validatePhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^(0\d{9})$/;
  return regex.test(phoneNumber) && phoneNumber.length === 10;
}; 

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

export const validateRegisterInput = (phoneNumber: string, email: string, password: string): { isValid: boolean} => {
  return {
    isValid : validatePhoneNumber(phoneNumber) && validateEmail(email) && validatePassword(password)
  }
};

