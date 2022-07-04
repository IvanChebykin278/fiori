using {fiori as db} from '../db/schema';

@path : 'service/PageBuilder'
service PageBuilder @(requires: 'Administrator') {

    type ActionControl {
        ac_Configure : Boolean;
        ac_CreateTile : Boolean;
        ac_Original : Boolean;
        ac_Delete : Boolean;
        ac_CreateReference : Boolean;
    }

    entity Catalogs as projection on db.Catalogs;
    entity CatalogTile as projection on db.CatalogTile;
    entity Tiles as projection on db.Tiles;
    entity Groups as projection on db.Groups;
    entity GruopTile as projection on db.GroupTile;
    entity TargetMappings as projection on db.TargetMappings;
    entity Actions as projection on db.Actions;
    entity SemanticObjects as projection on db.SemanticObjects;

    function getActionControl(catalogId : String, tileId : String) returns ActionControl;
}