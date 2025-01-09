
export function successMessage(data: any, message = 'Success') {
    if (data.message !== undefined) {
        return data.message;
    } else if (typeof data === 'string') {
        return data;
    } else {
        return message;
    }
}

export function errorMessage(error: any, defaultMessage = 'Error, Please refresh the page and try again.') {

    if (error.message === 'No JWT present or has expired') {
        return 'You are not login, Please login.';
    }

    if (error === '' || error === null) {
        return defaultMessage;
    }

    let allErrors: any = {};
    let message: any = '';

    if (typeof error === 'string') {
        return error;
    } else if (error.messages) {
        if (typeof error.messages === 'object') {
            allErrors = error.messages;
            message = [];
            Object.values(allErrors);
            message = message.join('\n');
        } else {
            message = error.messages;
        }
        return message;

    } else if (error.errors) {
        if (typeof error.errors === 'object') {
            allErrors = error.errors;
            message = Object.values(allErrors);
            message = message.join('\n');
        }
        return message;
    } else if (error.message) {

        if (error.message) {
            message = error.message;
        }
        return message;

    } else {
        if (error.error) {
            return error.error;
        } else {
            return defaultMessage;
        }
    }
}