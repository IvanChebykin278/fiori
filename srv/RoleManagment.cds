using {fiori as db} from '../db/schema';

@path : 'service/RoleManagment'
service RoleManagment @(requires: 'Administrator') {
    entity Roles as projection on db.Roles;
    entity RoleUser as projection on db.RoleUser;
    entity RoleCatalog as projection on db.RoleCatalog;
    entity RoleGroup as projection on db.RoleGroup;
}