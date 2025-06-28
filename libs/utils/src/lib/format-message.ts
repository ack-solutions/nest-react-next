export function successMessage(data: any, message = 'Success') {
    if (data.message !== undefined) {
        return data.message;
    }
    if (typeof data === 'string') {
        return data;
    }
    return message;
}

export function errorMessage(
    error: any,
    defaultMessage = 'Error, Please refresh the page and try again.',
) {
    if (error?.message === 'No JWT present or has expired') {
        return 'You are not login, Please login.';
    }

    if (error === '' || error === null) {
        return defaultMessage;
    }


    let allErrors: any = {};
    let message: any = '';

    // Axios error

    if (error.response?.data?.message) {
        const errorMessage = error.response?.data?.message;
        if (Array.isArray(errorMessage)) {
            message = errorMessage.join('\n');
        } else {
            message = errorMessage;
        }
        return message;
    }
    if (error.response?.message) {
        return error.response?.message;
    }

    if (typeof error === 'string') {
        return error;
    }
    if (error.messages) {
        if (typeof error.messages === 'object') {
            allErrors = error.messages;
            message = [];
            Object.values(allErrors);
            message = message.join('\n');
        } else {
            message = error.messages;
        }
        return message;
    }
    if (error.errors) {
        if (typeof error.errors === 'object') {
            allErrors = error.errors;
            message = Object.values(allErrors);
            message = message.join('\n');
        }
        return message;
    }
    if (error.message) {
        if (error.message) {
            message = error.message;
        }
        return message;
    }
    if (error.error) {
        return error.error;
    }
    return defaultMessage;
}
