using {fiori as db} from '../db/schema';

@path : 'service/PageBuilder'
service PageBuilder @(requires: 'Administrator') {
    entity Catalogs as projection on db.Catalogs;
    entity Tiles as projection on db.Tiles;
    entity Groups as projection on db.Groups;
    entity TargetMappings as projection on db.TargetMappings;
    entity Actions as projection on db.Actions;
    entity SemanticObjects as projection on db.SemanticObjects;
    entity GroupTile as projection on db.GroupTile;
}