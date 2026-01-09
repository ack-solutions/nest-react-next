/**
 * =================================================================
 * SCHEMA HELPERS
 * =================================================================
 *
 * Common Yup schema patterns for form validation.
 */

import * as yup from 'yup';

/**
 * Email validation schema
 */
export const emailSchema = yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address');

/**
 * Password validation schema (min 6 characters)
 */
export const passwordSchema = yup
    .string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters');

/**
 * Required string schema
 */
export const requiredString = (fieldName: string) =>
    yup.string().required(`${fieldName} is required`);

/**
 * Optional string schema
 */
export const optionalString = () => yup.string();

/**
 * Phone number validation (basic)
 */
export const phoneSchema = yup
    .string()
    .matches(/^[+]?[\d\s-()]+$/, 'Please enter a valid phone number');

/**
 * Confirm password validation
 */
export const confirmPasswordSchema = (passwordField: string = 'password') =>
    yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref(passwordField)], 'Passwords must match');

/**
 * Common form schemas
 */
export const loginFormSchema = yup.object().shape({
    email: emailSchema,
    password: passwordSchema,
});

export const registerFormSchema = yup.object().shape({
    firstName: requiredString('First name'),
    lastName: requiredString('Last name'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema(),
});

export const forgotPasswordSchema = yup.object().shape({
    email: emailSchema,
});

export const resetPasswordSchema = yup.object().shape({
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema(),
});
