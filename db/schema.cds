namespace fiori;

using {managed, cuid} from '@sap/cds/common';

entity Catalogs : managed {
    key ID : String not null;
    title : String not null;
    isReadOnly: Boolean default false;

    tiles : Association to many CatalogTile on tiles.catalogId = ID;
    roles : Association to many RoleCatalog on roles.catalogId = ID;
}

entity Tiles : managed {
    key ID : Integer;
    title : String;
    subtitle : String;
    keywords : String;
    icon : String;
    target : String not null;
    useTagetMapping : Boolean default false;
    parameters : String;
    isReadOnly: Boolean default false;

    catalogs : Association to many CatalogTile on catalogs.tileId = ID;
    groups : Association to many GroupTile on groups.tileId = ID;
}

entity CatalogTile : managed {
    key catalogId : String not null;
    key tileId : Integer not null;
    isReferense : Boolean default false;
    refererId : Integer default null;

    referer : Association to one CatalogTile on referer.tileId = tileId;
    tile : Association to one Tiles on tile.ID = tileId;
    catalog : Association to one Catalogs on catalog.ID = catalogId; 
}

entity TargetMappings : managed {
    key semanticObject : String;
    key action : String;
    title : String not null;
    appUrl : String not null;
    appId : String not null;
    info : String;
    isLaptop : Boolean default true;
    isTable : Boolean default true;
    isPhone : Boolean default true;
    isReadOnly: Boolean default false;
}

entity SemanticObjects : managed {
    key semanticObject : String;
    isReadOnly: Boolean default false;
}

entity Actions : managed {
    key action : String;
    isReadOnly: Boolean default false;
}

entity Groups : managed {
    key ID : String;
    title : String not null;
    isReadOnly: Boolean default false;

    tiles : Association to many GroupTile on tiles.groupId = ID;
    roles : Association to many RoleGroup on roles.groupId = ID;
}

entity GroupTile : managed {
    key tileId : Integer;
    key groupId : String;

    tile : Association to one Tiles on tile.ID = tileId;
    group : Association to one Groups on group.ID = groupId;
}

entity Roles : managed {
    key ID : String;
    desc : String;
    isReadOnly: Boolean default false;

    catalogs : Composition of many RoleCatalog on catalogs.roleId = ID;
    groups : Composition of many RoleGroup on groups.roleId = ID;
    users : Composition of many RoleUser on users.roleId = ID;
}

entity RoleGroup : managed {
    key roleId : String;
    key groupId : String;

    role : Association to one Roles on role.ID = roleId;
    group : Association to one Groups on group.ID = groupId;
}

entity RoleCatalog : managed {
    key roleId : String;
    key catalogId : String;

    role : Association to one Roles on role.ID = roleId;
    catalog : Association to one Catalogs on catalog.ID = catalogId;
}

entity RoleUser : managed {
    key roleId : String;
    key userId : String;

    role : Association to one Roles on role.ID = roleId;
}


