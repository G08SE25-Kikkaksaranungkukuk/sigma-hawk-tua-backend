import {z} from "zod"

const validatePhoneNumber = (phoneNumber: string): boolean => {
  const regex = /^(0\d{9})$/;
  // console.log("phone",regex.test(phoneNumber))
  return regex.test(phoneNumber) && phoneNumber.length === 10;
}; 

const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // console.log("email",regex.test(email))
  return regex.test(email);
};

const validatePassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  console.log("password",regex.test(password))
  return regex.test(password);
};

export const validateRegisterInput = (phoneNumber: string, email: string, password: string): { isValid: boolean} => {
  return {
    isValid : validatePhoneNumber(phoneNumber) && validateEmail(email) && validatePassword(password)
  }
};

// schema for the authRegister Request
export const authRegReqSchema = z.object({
    first_name : z.string(),
    middle_name : z.string().optional(),
    last_name : z.string(),
    birth_date : z.iso.date(),
    sex : z.string(),
    interests : z.array(z.string()),
    travel_styles : z.array(z.string()),
    phone : z.string(),
    email : z.email(),
    password : z.string()
});

