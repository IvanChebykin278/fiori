using fiori as db from '../db/schema';

annotate db.Roles with {
    ID          @title  :   'Role ID';
    desc        @title  :   'Description';
    isReadOnly  @title  :   'Read-Only';
};

annotate db.Actions with {
    action      @title  :   'Action Name';
    isReadOnly  @title  :   'Read-Only';
};