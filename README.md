# Nobox CLI Server

## How Authentication works

- Client make request of /api/auth/github to server
- Server responds with payload to indicate next step, payload schema:

```js
{
    link: null,  // When there is no token and authentication is not processing, a link to authenticate
    processing: false, // when authentication is processing
    token: null // the actual token requested if it exists(i.e authenticated)
}
```

- If there is link, link directs to authentication page of the server(client-side)
- Client side makes a direct authentication request to nobox core, handing over the process to nobox core,
    however, a redirection link is sent along side the request, so nobox redirects back to this server on /api/auth/github/callback
- Redirection lands on api/auth/github, with a token, this token is extracted and saved,
    then another redirection to success page on this same server(client-side)
- meanwhile the client(nobox-cli) make consequent requests to api/auth/github/cal, to verify if authentication was complete.
    payload returned will look like:

```js
{
    link: null, // if not null, then authentication probably failed, and client should reinitialize
    processing: true, // or false if token is present
    token: null // or string, when it is available
}
```

- Client obtain token, and authentication is complete.

> Token is removed (5mins) from cache when client obtains it
