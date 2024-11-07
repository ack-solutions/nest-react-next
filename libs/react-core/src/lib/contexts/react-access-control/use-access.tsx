import React, { useContext } from "react"
import context from "./context"
import {
	hasItem as hasItemHelper,
	hasAnyItem as hasAnyItemHelper
} from "./helper"

export interface AccessOptions {
	// Default allowSuperAdmin is true. By default it will allow all permission to super admin. if need to disabled for super admin then need to pass "false"
	allowSuperAdmin?: boolean;
	resource?: any;
}

const useAccess = () => {
	const { permissions, roles, resources, isLoaded, define } = useContext(context)

	const hasPermission = (checkPermissions: string[] | string, opts: AccessOptions = {}) => {
		const { allowSuperAdmin = true } = opts;
		// if (allowSuperAdmin) {
		// 	// Skip  permission check if role is Super admin
		// 	const isSuperAdmin = hasRole(RoleNameEnum.SUPER_ADMIN);
		// 	if (isSuperAdmin) {
		// 		return true
		// 	}
		// }
		return hasItemHelper(permissions, resources, checkPermissions, opts)
	}

	const hasAnyPermission = (checkPermissions: string[] | string, opts: AccessOptions = {}) => {
		const { allowSuperAdmin = true } = opts;
		// if (allowSuperAdmin) {
		// 	// Skip  permission check if role is Super admin
		// 	const isSuperAdmin = hasRole(RoleNameEnum.SUPER_ADMIN);
		// 	// console.log({ isSuperAdmin })
		// 	if (isSuperAdmin) {
		// 		return true
		// 	}
		// }
		return hasAnyItemHelper(permissions, resources, checkPermissions, opts)
	}

	const hasRole = (checkRoles: string[], opts: AccessOptions = {}) => {
		return hasItemHelper(roles, resources, checkRoles, opts)
	}

	const hasAnyRole = (checkRoles: string[], opts: AccessOptions = {}) => {
		return hasAnyItemHelper(roles, resources, checkRoles, opts)
	}

	return {
		isLoaded, hasPermission, hasAnyPermission, hasRole, hasAnyRole, define
	}
}

export default useAccess
