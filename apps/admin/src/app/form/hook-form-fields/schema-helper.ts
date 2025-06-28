import { get } from 'lodash';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { string } from 'yup';


interface IOptions {
    message?: {
        required_error?: string;
        invalid_type_error?: string;
    };
    minFiles?: number;
    isoCodeKey?: string;
    countryCodeKey?: string;
}


// Define the schema helper for Yup
export const schemaHelper = {
    phoneNumber: (options?: IOptions) => {
        return string()
            .nullable()
            .test('is-valid-phone', options?.message?.invalid_type_error ?? 'Invalid phone number!', function (value) {
                if (!value) return true; // Allow empty values if not required
                const isoCode = get(this.parent, options?.isoCodeKey || 'phoneIsoCode');
                const countryCode = get(this.parent, options?.countryCodeKey || 'phoneCountryCode');
                return isValidPhoneNumber(`${countryCode}${value}`, isoCode); // Validate using the ISO code
            });
    },
    email: (options?: IOptions) => {
        return string()
            .nullable()
            .test('is-valid-email', options?.message?.invalid_type_error ?? 'Invalid email address!', (value) => {
                if (!value) return true;
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            });
    },

    password: (options?: IOptions & { required?: boolean }) => {
        const schema = string()
            .nullable()
            .test(
                'is-strong-password',
                options?.message?.invalid_type_error ??
                'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character',
                function (value) {
                    if (!value) return !options?.required; // allow empty if not required
                    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value);
                },
            );

        return options?.required ? schema.required(options?.message?.required_error ?? 'Password is required') : schema;
    },

};
