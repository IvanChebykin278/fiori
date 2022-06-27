using RoleManagment from '../../srv/RoleManagment';

annotate RoleManagment.Roles with @(UI : {
    HeaderInfo      : {
        TypeName       : 'Role',
        TypeNamePlural : 'Roles',
        Title          : {
            $Type : 'UI.DataField',
            Value : ID
        },
        Description    : {
            $Type : 'UI.DataField',
            Value : desc
        }
    },
    Identification  : [{Value : ID}],
    // Define the table columns
    LineItem        : [
        {Value : ID},
        {Value : desc},
        {Value : isReadOnly},
        {Value : createdAt},
        {Value : createdBy},
        {Value : modifiedAt},
        {Value : modifiedBy}
    ]
});

