import type {IAccessControl, IRoles} from "@features/user/model/RoleInterfaces.ts";

export type RoleCheckMode = "any" | "all";
export type ResourceAction = "get" | "post" | "put" | "delete";

function checkRoles(set: Set<IRoles>, roles: IRoles[], mode: RoleCheckMode = "all") {
    if (roles.length === 0) return mode === "all" ? true : false;
    return mode === "all"
        ? roles.every(role => set.has(role))
        : roles.some(role => set.has(role));
}

export interface IPermissionCheck {
    resource?: string; //TODO strict type resources
    action?: ResourceAction;
    requiredRoles?: IRoles[];
    deniedRoles?: IRoles[];
    requiredRolesMode?: RoleCheckMode;
    deniedRolesMode?: RoleCheckMode;
}

//
//  Resource + actions checks
//
export type NormalizedPermissions = Record<string, Record<ResourceAction, boolean>>;

export function normalizePermissions(accessControl: IAccessControl[]): NormalizedPermissions {
    const normalized: NormalizedPermissions = {};

    for (const ac of accessControl) {
        if (!normalized[ac.resource]) {
            normalized[ac.resource] = {get: false, post: false, put: false, delete: false};
        }

        normalized[ac.resource].get ||= ac.canGet;
        normalized[ac.resource].post ||= ac.canPost;
        normalized[ac.resource].put ||= ac.canPut;
        normalized[ac.resource].delete ||= ac.canDelete;
    }

    return normalized;
}

export function hasResourcePermission(
    normalized: NormalizedPermissions,
    resource: string,
    action: ResourceAction
): boolean {
    return normalized[resource]?.[action] === true;
}

//
// Role (required + denied) checks
//
export function hasRolePermission(
    accessControl: IAccessControl[],
    {
        requiredRoles = [],
        deniedRoles = [],
        requiredRolesMode = "all",
        deniedRolesMode = "any",
    }: Pick<IPermissionCheck, "requiredRoles" | "deniedRoles" | "requiredRolesMode" | "deniedRolesMode"> = {}
): boolean {
    const roleSet = new Set(accessControl.map(ac => ac.role));

    // Denied roles
    if (deniedRoles.length > 0 && checkRoles(roleSet, deniedRoles, deniedRolesMode)) {
        return false;
    }

    // Required roles
    if (requiredRoles.length > 0 && !checkRoles(roleSet, requiredRoles, requiredRolesMode)) {
        return false;
    }

    return true;
}

//
// Role + (resource + action)
//
export function hasPermission(
    accessControl: IAccessControl[],
    permissionCheck: IPermissionCheck = {}
): boolean {
    const {resource, action} = permissionCheck;

    // Check roles
    const rolesAllowed = hasRolePermission(accessControl, permissionCheck);
    if (!rolesAllowed) return false;

    // Check resource/action if provided
    if (resource && action) {
        const normalized = normalizePermissions(accessControl);
        const resourceAllowed = hasResourcePermission(normalized, resource, action);
        if (!resourceAllowed) return false;
    }

    return true;
}

export interface PermissionEngine {
    can: (resource: string, action: ResourceAction) => boolean;
    hasRole: (role: IRoles) => boolean;
    hasRequiredRoles: (
        roles: IRoles[],
        mode?: RoleCheckMode
    ) => boolean;
    hasDeniedRoles: (
        roles: IRoles[],
        mode?: RoleCheckMode
    ) => boolean;
}

export function permissionEngine(accessControl: IAccessControl[]): PermissionEngine {
    const normalized = normalizePermissions(accessControl);
    const roleSet = new Set(accessControl.map(ac => ac.role));

    return {
        can(resource, action) {
            return normalized[resource]?.[action] === true;
        },

        hasRole(role) {
            return roleSet.has(role);
        },

        hasRequiredRoles(roles, mode = "all") {
            return checkRoles(roleSet, roles, mode);
        },

        hasDeniedRoles(roles, mode = "any") {
            const deniedMatch = checkRoles(roleSet, roles, mode);
            return deniedMatch;
        },
    };
}