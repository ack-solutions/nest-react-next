import React, { ReactNode } from 'react'

import useAccess from './use-access'
import context from './context'

export interface WithAccessOptions {
	permissions?: string[];
	resource?: any;
	onDeny?: () => any;
}

const withAccess = ({
    permissions,
    resource,
    ...props
}: WithAccessOptions) => {

    return (WrappedComponent:never): ReactNode => {

        const { onDeny } = React.useContext(context)
        const { hasAnyPermission } = useAccess()

        if (!permissions) {
            return WrappedComponent
            //throw new Error('No permissions were passed to withAccess')
        }

        if (permissions.length === 0) {
            return WrappedComponent
        }

        const allowed = hasAnyPermission(permissions, { resource })

        if (allowed) {
            return WrappedComponent
        }


        const nextAction =
			typeof props.onDeny === 'function'
			    ? props.onDeny
			    : typeof onDeny === 'function'
			        ? onDeny
			        : null

        if (!nextAction) {
            console.warn(
                'withAccess does not have have a provided onDeny callback. While this is not an error, you could potentially improve the user experience by implementing one.'
            )
            return null

        }

        return nextAction() || null


    }
}

export default withAccess
