import * as yup from "yup"

export const loginSchema = yup.object().shape({
  email: yup.string().email("Email is invalid").required("Email is require"),
  password: yup.string().min(6, "Password must be at least 6").required("Password is require"),
})

export const signupSchema = yup.object().shape({
  name: yup.string().min(2, "Full name must be at least 2 characters").required("Full name is require"),
  email: yup.string().email("Email invalid").required("Email lis require"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    // .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    // .matches(/[0-9]/, "Password must contain at least one number")
    .required("Pasword is require"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password does not match")
    .required("Confirm password is require"),
  agreeTerms: yup.boolean().oneOf([true], "You must agree to the terms of service"),
})

export type LoginFormData = yup.InferType<typeof loginSchema>
export type SignupFormData = yup.InferType<typeof signupSchema>
