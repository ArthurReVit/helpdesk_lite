## Users Endpoints

The following endpoints are available for users:

- POST /api/users/register:

Allows the user to register into the system. This endpoint in particular is special because it allows the first user to register as an admin and won't require any authentication. After the first user is registered, all subsequent users must be registered by an admin.

You can refer to the ([Swagger](http://localhost:5000/apidocs)) for more information.
