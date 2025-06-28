import React, { ReactNode } from 'react';

import context from './context';
import useAccess from './use-access';


export interface WithAccessOptions {
    permissions?: string[];
    resource?: any;
    onDeny?: () => any;
}

const withAccess = ({ permissions, resource, ...props }: WithAccessOptions) => {
    return (wrappedComponent: never): ReactNode => {
        const { onDeny } = React.useContext(context);
        const { hasAnyPermission } = useAccess();

        if (!permissions) {
            return wrappedComponent;
            // throw new Error('No permissions were passed to withAccess')
        }

        if (permissions.length === 0) {
            return wrappedComponent;
        }

        const allowed = hasAnyPermission(permissions, { resource });

        if (allowed) {
            return wrappedComponent;
        }

        let nextAction = null;
        if (typeof props.onDeny === 'function') {
            nextAction = props.onDeny;
        } else if (typeof onDeny === 'function') {
            nextAction = onDeny;
        }

        if (!nextAction) {
            console.warn(
                'withAccess does not have have a provided onDeny callback. While this is not an error, you could potentially improve the user experience by implementing one.',
            );
            return null;
        }

        return nextAction() || null;
    };
};

export default withAccess;
