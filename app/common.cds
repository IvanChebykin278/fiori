using fiori as db from '../db/schema';

annotate db.Roles with {
    ID          @title  :   '{i18n>ID}';
    desc        @title  :   '{i18n>desc}';
    isReadOnly  @title  :   '{i18n>isReadOnly}';
};

annotate db.SemanticObjects with {
    semanticObject  @title  :   '{i18n>semanticObject}';
    isReadOnly      @title  :   '{i18n>isReadOnly}';
};

annotate db.Actions with {
    action      @title  :   '{i18n>action}';
    isReadOnly  @title  :   '{i18n>isReadOnly}';
};
