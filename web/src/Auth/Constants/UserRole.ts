import { Identity } from '../types'

enum UserRole {
    UNAUTHENTICATED,
    AUTHENTICATED,
    MODERATOR,
    ADMIN
}

export default UserRole


//namespace UserRole {

    /**
     * Check identity role.
     * @param identity
     * @param includeRole
     * @param excludeRole
     * @returns Identity has valid role.
     */
    export const test = (identity: Identity, includeRole?: UserRole | UserRole[], excludeRole?: UserRole | UserRole[]): boolean => {
        const identityRole = identity ? identity.role : UserRole.UNAUTHENTICATED
        const isInRole = includeRole !== undefined ? (Array.isArray(includeRole) ? includeRole.includes(identityRole) : includeRole === identityRole) : true
        const isInNoRole = excludeRole !== undefined ? (Array.isArray(excludeRole) ? excludeRole.includes(identityRole) : excludeRole === identityRole) : false
        return isInRole && !isInNoRole
    }

//}