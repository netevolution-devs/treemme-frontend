import type {IAccessControl, IRoles} from "@features/user/model/RoleInterfaces";

export type RoleCheckMode = "any" | "all";
export type ResourceAction = "get" | "post" | "put" | "delete";
export type ResourceName = ResourceContacts
    | ResourceLeathers
    | ResourceProducts
    | ResourceOrders
    | ResourceWarehouse
    | ResourceProduction
    | ResourceShippingInvoicing
    | ResourceCommercial
    | ResourceAnalysis
    | ResourceSystem

export type ResourceContacts = "contatti"
    | "contatti - contatti"
    | "contatti - cap"
    | "contatti - nazioni"
    | "contatti - province"
    | "contatti - porti marittimi"

export type ResourceLeathers = "pellami"
    | "pellami - pellami"
    | "pellami - pesi"
    | "pellami - specie"
    | "pellami - taglie"
    | "pellami - spessori"
    | "pellami - tipologie"
    | "pellami - scuoiature"
    | "pellami - provenienze"
    | "pellami - stati di lavorazione"

export type ResourceProducts = "articoli"
    | "articoli - prodotti"
    | "articoli - articoli"
    | "articoli - scelte"
    | "articoli - ricerca prodotti"
    | "articoli - categorie"
    | "articoli - tipologie prodotti"
    | "articoli - tipologie articoli"
    | "articoli - colori"
    | "articoli - classi"
    | "articoli - colori interni"

export type ResourceOrders = "ordini"
    | "ordini - ordini clienti"
    | "ordini - ordini fornitori"
    | "ordini - ricerca ordini clienti"
    | "ordini - scadenziario fornitori"
    | "ordini - ricerca ordini fornitori"

export type ResourceWarehouse = "magazzino"
    | "magazzino - movimenti di magazzino"
    | "magazzino - tipologie pallets"
    | "magazzino - lotti e partite"
    | "magazzino - ricerca lotti/partite"
    | "magazzino - lotti in conto lavorazione"

export type ResourceProduction = "produzione"
    | "produzione - lotti"
    | "produzione - ricette"
    | "produzione - macchinari"
    | "produzione - avanzamento produzione"
    | "produzione - produzione"
    | "produzione - lavorazioni"
    | "produzione - distinta base"
    | "produzione - scelta partite"
    | "produzione - monitor pirovano"
    | "produzione - ricettario pirovano"

export type ResourceShippingInvoicing = "ddt & fatture"
    | "ddt & fatture - documenti di trasporto"
    | "ddt & fatture - fatturazione"
    | "ddt & fatture - ricerca documenti"
    | "ddt & fatture - ragioni di trasporto"
    | "ddt & fatture - lotti conto lavoro"

export type ResourceCommercial = "commerciale"
    | "commerciale - anagrafica clienti"
    | "commerciale - anagrafica fornitori"
    | "commerciale - dati partite"
    | "commerciale - costo prodotti"
    | "commerciale - listino prodotti"
    | "commerciale - rapportini di lavoro"
    | "commerciale - valute e cambi"
    | "commerciale - tipi pagamento"
    | "commerciale - condizioni resa"

export type ResourceAnalysis = "analisi"
    | "analisi - analisi ordini"
    | "analisi - analisi vendite"
    | "analisi - costi e ricavi"
    | "analisi - analisi partite/lotti"
    | "analisi - analisi conto lavorazione"
    | "analisi - traffico telefonico"
    | "analisi - controllo qualità iso"
    | "analisi - controllo qualità iso - evasione ordini"

export type ResourceSystem = "sistema"
    | "sistema - informazioni di sistema"
    | "sistema - strumenti"
    | "sistema - console di comando"
    | "sistema - permessi"
    | "sistema - utenti"
    | "sistema - organizzazione"
    | "sistema - funzionalità"

function checkRoles(set: Set<IRoles>, roles: IRoles[], mode: RoleCheckMode = "all") {
    if (roles.length === 0) return mode === "all";
    return mode === "all"
        ? roles.every(role => set.has(role))
        : roles.some(role => set.has(role));
}

export interface IPermissionCheck {
    resource?: ResourceName;
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
    can: (resource: ResourceName, action: ResourceAction) => boolean;
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