# HowTo: Github Auth with worker

## WhatIs: difference between Github and Google auth?

Github auth is similar to [Google auth](HowTo_GoogleAuth.md).
We create a Github App (similar to the Google App that accessed the Google+ API), which will give us a client ID and Client Secret we can use when the user authenticates with Github.

The differences between the two are:
1. Google returns the user info as a id_token together immediately with the accesstoken.

vs.

1. Github only returns an access token from the code callback, so you must go an extra roundtrip to the github user api in order to get the name and id of the github user.

2. Google returns the user info as a JWT token. This means that we must deconstruct the JSON data of the JWT in order to read the sub (user id) and first name and last name.
vs.
2. Github returns the user data as plain JSON. This means that we don't need to do much decoding of the user data in order to read user id and user name.


## Create and configure Github App

1. Sign in to your Github account.
2. Open **Settings** - **Developer setting**s and press **New GitHub App** button.
3. Confirm password.
4. Set application name.
5. Set cloudflare worker link to **Homepage URL** input (for example `https://maxworker.maksgalochkin2.workers.dev`).
6. Specify the link that will be opened after successful authentication to **User authorization callback URL** (for example `https://maxworker.maksgalochkin2.workers.dev/callback`).
7. Deselect **Active** checkbox (this is used for logging purposes, but we don't need that because we can do this directly in the auth worker).
8. Press **Create GitHub App** button.
9. Press **Generate a new client secret** button.
10. Copy the **Client ID** and **client secret**.  

## Create worker (Cloudflare)

1. Open [Cloudflare dashboard] (https://dash.cloudflare.com/) and go to the **"Workers"** tab using the menu on the right side of the page.
2. Create a new worker.
3. Go to the **Settings** tab.
4. Define next global variables 
   * `GITHUB_CLIENT_ID`
   * `GITHUB_CLIENT_SECRET`
   * `GITHUB_LINK1_LOGIN: https://github.com/login/oauth/authorize` to obtain user authorization, handle active session lookup, authenticates the user, and obtains user consent.
   * `GITHUB_LINK2_CALLBACK https://github-auth.maksgalochkin2.workers.dev/callback` redirect url after successful authentication. Must retaliate against the name of the worker.
   * `GITHUB_LINK3_ACCESS_TOKEN	https://github.com/login/oauth/access_token` Github access token. 
   * `GITHUB_LINK4_USER_API	https://api.github.com/user` Github API from where we get the JSON data about user. 
   
## Code the worker

Make a `handleRequest()` function:

```javascript
      async function handleRequest(request) {
         const url = new URL(request.url);                                                                         //[2]
         const [empty, action] = url.pathname.split('/');                                                          //[3]
         if (action === "login") {                                                                                 //[4]
             let redirect = GITHUB_OAUTH_LINK + `?state=${encodeURIComponent(makeRandomString(12))}&client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URL)}&scope=${encodeURIComponent("user")}`  //[5]
             return Response.redirect(redirect);                                                                   //[6]
         }
         if (action === "callback") {                                                                              //[7] 
             let code = url.searchParams.get("code");                                                              //[8]
             let userToken = await githubProcessTokenPackage(code);                                                //[9]
             return new Response(JSON.stringify(userToken));                                                       //[10]
         }
     
         const mainpage = `<a href='/login'>login github</a>`;
         return new Response(mainpage, { headers: { 'Content-Type': 'text/html' } });                              //[1]
     }
```

1. Render _Login_ button if user is not logged in.
2. Getting the URL values. 
3. Defining a command that defines the following behavior of an application. The first argument is ignored, only `action` is used.
4. Clicking on the button will add "/login" to the url.
5. After clicking on the button for authentication (Login), the user must be redirected to the login form provided by the API. For successful authentication the browser must make a request by passing some parameters using the URL:
        * `state` An unguessable random string. It is used to protect against cross-site request forgery attacks.
        * `client_id` The client ID you received from GitHub when you registered.
        * `redirect_uri` The URL in your application where users will be sent after authorization.
        * `scope` must be "user" string.
6. User redirection to login page.
7. After successful authentication, the user will be redirected back to the web application. The URL will be redirected by the "/callback" parameter.
8. The response includes a `code` parameter, a one-time authorization code that your server can exchange for an access token and ID token.
9. Your server makes this exchange by sending an HTTPS POST request. The POST request is sent to the token endpoint, which you should retrieve from the Discovery document using the token_endpoint metadata value.

## Process Access Token

```javascript
          async function githubProcessTokenPackage(code) {
              let bodyString = `code=${encodeURIComponent(code)}&state=${encodeURIComponent(makeRandomString(12))}&client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}&client_secret=${encodeURIComponent(GITHUB_CLIENT_SECRET)}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URL)}`                                                                                           //[1]
              const tokenPackage = await fetchAccessToken(bodyString);                                             //[2]
              const tokenText = await tokenPackage.text();                                                         //[3]
              const access_token = tokenText.split('&')[0].split("=")[1];                                          //[4]
              const user = await fetchUser(access_token);                                                          //[5]
              const userData = await user.json();                                                                  //[6]
              return userData;
          }
```

1. POST request is used to get JWT. The request must include the following parameters in the POST body:
* `client_id` The client ID you received from GitHub for your GitHub App.
* `client_secret` The client secret you received from GitHub for your GitHub App.
* `code` The code you received as a response.
* `redirect_uri` The URL in your application where users are sent after authorization.
* `state` The unguessable random string.

2. Executing POST request.
```javascript
async function fetchAccessToken(data) {
                    return await fetch(GITHUB_TOKEN, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: data
                    });
                }
 ```

3. The `text()` method takes a response stream and reads it to completion.  
4. To get information about the user you should use the value of the access_token property. Since the object is returned as a string, it is necessary to get its value.
5. GET request to get a user.
```javascript
                async function fetchUser(token) {
                    return await fetch(GITHUB_LINK4_USER_API, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'token ' + token,
                            'User-Agent': 'maksgalochkin2',   // https://github-auth.maksgalochkin2.workers.dev. Takes from worker url
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    });
                }
``` 
6. The `json()` method of the Body mixin takes a response and reads it to completion. The result of execution is JWT.  
7.  Return a new Response with user info.

## Demo

```javascript
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

function makeRandomString(length) {
     const iv = crypto.getRandomValues(new Uint8Array(length));
     return Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

async function fetchAccessToken(data) {
    return await fetch(GITHUB_TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: data
    });
}

async function fetchUser(token) {
    return await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
            'Authorization': 'token ' + token,
            'User-Agent': 'maksgalochkin2',
            'Accept': 'application/vnd.github.v3+json'
        }
    });
}

async function githubProcessTokenPackage(code) {
    let bodyString = `code=${encodeURIComponent(code)}&state=${encodeURIComponent(makeRandomString(12))}&client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}&client_secret=${encodeURIComponent(GITHUB_CLIENT_SECRET)}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URL)}`
    const tokenPackage = await fetchAccessToken(bodyString);
    const tokenText = await tokenPackage.text();
    const access_token = tokenText.split('&')[0].split("=")[1];
    const user = await fetchUser(access_token);
    const userData = await user.json();
    return JSON.stringify({
        id: userData.id,
        email: userData.email,
        fullname: userData.name,
        provider: userData.url
    });
}

async function handleRequest(request) {
    const url = new URL(request.url);                                                   
    const [empty, action] = url.pathname.split('/');
    if (action === "login") {
        let redirect = GITHUB_OAUTH_LINK + `?state=${encodeURIComponent(makeRandomString(12))}&client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URL)}&scope=${encodeURIComponent("user")}`
        return Response.redirect(redirect);                                             
    }
    if (action === "callback") {
        let code = url.searchParams.get("code")
        let userToken = await githubProcessTokenPackage(code);
        return new Response(JSON.stringify(userToken));                                 
    }
    const mainpage = `<a href='/login'>login github</a>`;
    return new Response(mainpage, { headers: { 'Content-Type': 'text/html' } });        
}
```

## Reference

* [Authorizing OAuth Apps](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)
* [Live demo](https://github-auth.maksgalochkin2.workers.dev/)