Never make assumtions about the data you are getting back from your database.

- Check your data befor using it in your app.

Documents are essentially maps that contain fields which are key:value pairs.
Collections are collections of Documents.
Documents can not contain other Documents, but instead can point to other Collections which contain other Documents.

Queries are "shallow" meaning they will grab the document that you direct it to without grabbing all of that document's sub-collections and documents.

Queries can only fetch documents & you can't fetch partial documents. It's all or nothing.
