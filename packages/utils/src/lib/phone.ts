import { formatPhoneNumberIntl } from 'react-phone-number-input';


export function toDisplayPhone(phoneNumber: string) {
    return formatPhoneNumberIntl(phoneNumber);
}
