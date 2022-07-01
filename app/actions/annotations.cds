using PageBuilder from '../../srv/PageBuilder';

annotate PageBuilder.Actions with @(UI : {
    LineItem        : [
        {Value : action},
        {Value : isReadOnly},
        {Value : createdAt},
        {Value : createdBy},
        {Value : modifiedAt},
        {Value : modifiedBy}
    ]
});

