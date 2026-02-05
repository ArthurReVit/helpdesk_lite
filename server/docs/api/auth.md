## Auth Endpoints

The following endpoints are available for authentication:

- POST /api/auth/login:

Allows the user to login into the system. It requires a valid email and password. If the credentials are valid, it will return a JWT token that must be included in the Authorization header for all subsequent requests.

You can refer to the ([Swagger](http://localhost:5000/apidocs)) for more information.
