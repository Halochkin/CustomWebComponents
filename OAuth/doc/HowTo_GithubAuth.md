# HowTo: Github Authorization with Cloudflare workers

Github authentication technology is similar to [Google authentication](./HowTo_GoogleAuth2.md).
Github Application is used instead of Google+ API, which uses a similar set of input data and also generates client ID and Client Secret. 

### Creation and configuration of Github Application

1. Sign in to your Github account.
2. Open **Settings** - **Developer setting**s and press **New GitHub App** button.
3. Confirm password.
4. Set application name
5. Set cloudflare worker link to **Homepage URL** input (for example `https://maxworker.maksgalochkin2.workers.dev`).
6. Specify the link that will be opened after successful authentication to **User authorization callback URL** (for example `https://maxworker.maksgalochkin2.workers.dev/callback`).
7. Deselect **Active** checkbox.
8. Press **Create GitHub App** button.
9. After creating an application, you can find the **Client ID** at the top.  
10. Press **Generate a new client secret** button.

### Cloudflare worker

1. Open [Cloudflare dashboard] (https://dash.cloudflare.com/) and go to the **"Workers"** tab using the menu on the right side of the page.
2. Create a new worker.
3. Go to the **Settings** tab.
4. Define next global variables 
   * `GITHUB_CLIENT_ID`	app _client ID_
   * `GITHUB_CLIENT_SECRET`	app _client Secret_.
   * `GITHUB_OAUTH_LINK: https://github.com/login/oauth/authorize` to obtain user authorization, handle active session lookup, authenticates the user, and obtains user consent.
   * `GITHUB_TOKEN	https://github.com/login/oauth/access_token` Github access token. 
   * `GITHUB_REDIRECT_URL https://github-auth.maksgalochkin2.workers.dev/callback` redirect url after successful authentication. Must retaliate against the name of the worker.
5. Inside `handleRequest()` put the code
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
                    return await fetch('https://api.github.com/user', {
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
   10.  Response user info.

 ### Example
```javascript
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request))
})

function makeRandomString(length) {
    return [...Array(length)].map(() => Math.random().toString(36)[2]).join('')
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
    return userData;
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

### Reference
[Authorizing OAuth Apps](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)