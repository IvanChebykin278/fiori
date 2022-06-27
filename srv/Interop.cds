using {fiori as db} from '../db/schema';

@path : 'service/Interop'
service Interop @(requires: 'User') {

    type User {
        ID : String;
        isAdmin : String;
        isUser : String;
    }
    
    @(restrict: [{ grant: ['READ'], where: 'accessibleTo = $user' }])
    entity Groups as select
        from db.Groups as Groups
            inner join db.RoleGroup as RoleGroup on Groups.ID = RoleGroup.groupId
            inner join db.RoleUser as RoleUser on RoleGroup.roleId = RoleUser.roleId
        distinct
        {
            key Groups.ID as ID,
            Groups.title as title,
            Groups.createdBy as createdBy,
            Groups.createdAt as createdAt,
            Groups.modifiedBy as modifiedBy,
            Groups.modifiedAt as modifiedAt,
            RoleUser.userId as accessibleTo,

            tiles : Association to many Tiles on ID = tiles.groupId
        };

    @(restrict: [{ grant: ['READ'], where: 'accessibleTo = $user' }])
    entity Tiles as select
        from db.Tiles as Tiles
            left outer join db.GroupTile as GroupTile on Tiles.ID = GroupTile.tileId
            left outer join db.CatalogTile as CatalogTile on Tiles.ID = CatalogTile.tileId
            left outer join db.RoleCatalog as RoleCatalog on RoleCatalog.catalogId = CatalogTile.catalogId
            left outer join db.RoleUser as RoleUser on RoleUser.roleId = RoleCatalog.roleId
        {
            key Tiles.ID as ID,
            key GroupTile.groupId as groupId,
            key CatalogTile.catalogId as catalogId,
            Tiles.title as title,
            Tiles.subtitle as subtitle,
            Tiles.keywords as keywords,
            Tiles.icon as icon,
            Tiles.target as target,
            Tiles.useTagetMapping as useTagetMapping,
            Tiles.parameters as parameters,
            Tiles.createdBy as createdBy,
            Tiles.createdAt as createdAt,
            Tiles.modifiedBy as modifiedBy,
            Tiles.modifiedAt as modifiedAt,
            RoleUser.userId as accessibleTo
        };

    @(restrict: [{ grant: ['READ'], where: 'accessibleTo = $user' }])
    entity Catalogs as select
        from db.Catalogs as Catalogs
            inner join db.RoleCatalog as RoleCatalog on Catalogs.ID = RoleCatalog.catalogId
            inner join db.RoleUser as RoleUser on RoleCatalog.roleId = RoleUser.roleId
        distinct
        {
            key Catalogs.ID as ID,
            Catalogs.title as title,
            Catalogs.createdBy as createdBy,
            Catalogs.createdAt as createdAt,
            Catalogs.modifiedBy as modifiedBy,
            Catalogs.modifiedAt as modifiedAt,
            RoleUser.userId as accessibleTo,

            tiles : Association to many Tiles on tiles.catalogId = ID
        };
    
    function getUserInfo() returns User;
}