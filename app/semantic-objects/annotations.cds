using PageBuilder from '../../srv/PageBuilder';

annotate PageBuilder.SemanticObjects with @(UI : {
    // Define the table columns
    LineItem        : [
        {Value : semanticObject},
        {Value : isReadOnly},
        {Value : createdAt},
        {Value : createdBy},
        {Value : modifiedAt},
        {Value : modifiedBy}
    ]
});

