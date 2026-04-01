import type {IAccessControl, IRoles} from "@features/user/model/RoleInterfaces.ts";

export type RoleCheckMode = "any" | "all";
export type ResourceAction = "get" | "post" | "put" | "delete";
export type ResourceName = "contatti"
    | "pellami"
    | "prodotti"
    | "ordini"
    | "magazzino"
    | "produzione"
    | "ddt & fatture"
    | "commerciale"
    | "analisi"
    | "sistema"

function checkRoles(set: Set<IRoles>, roles: IRoles[], mode: RoleCheckMode = "all") {
    if (roles.length === 0) return mode === "all";
    return mode === "all"
        ? roles.every(role => set.has(role))
        : roles.some(role => set.has(role));
}

export interface IPermissionCheck {
    resource?: ResourceName; //TODO strict type resources
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
        const resourceKey = ac.resource.toLowerCase();
        if (!normalized[resourceKey]) {
            normalized[resourceKey] = {get: false, post: false, put: false, delete: false};
        }

        normalized[resourceKey].get ||= ac.canGet;
        normalized[resourceKey].post ||= ac.canPost;
        normalized[resourceKey].put ||= ac.canPut;
        normalized[resourceKey].delete ||= ac.canDelete;
    }

    return normalized;
}

export function hasResourcePermission(
    normalized: NormalizedPermissions,
    resource: string,
    action: ResourceAction
): boolean {
    return normalized[resource.toLowerCase()]?.[action] === true;
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
            return normalized[resource.toLowerCase()]?.[action] === true;
        },

        hasRole(role) {
            return roleSet.has(role);
        },

        hasRequiredRoles(roles, mode = "all") {
            return checkRoles(roleSet, roles, mode);
        },

        hasDeniedRoles(roles, mode = "any") {
            return checkRoles(roleSet, roles, mode);
        },
    };
}