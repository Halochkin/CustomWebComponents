# HowTo: Google Authorization with Cloudflare workers

You can login to third-party applications and services with a Google Account. So you do not have to remember the username and password for each of them.

### API configuration. Creation of "Client ID" and "Client secret code"
In order to start using Google Authentication, it is necessary:
 1. Open [GoogleApi] (https://console.developers.google.com/), authenticate and create a new project. 
 2. Select the "Dashboard" tab. Click the "+ENABLE APIS AND SEVICES" button or move to [API Library](https://console.developers.google.com/apis/library?project=sanguine-fx-294214&supportedpurview=project).
3. In the search bar, type "Google+ API", then click "Enable" button. After that you will be redirected to API settings. 
4. Go to the "Credentials" tab.
    1. To create an OAuth client ID, it is necessary to specify the product name for the access request window. To do this, click "CONFIGURE CONSENT SCREEN". 
    2. Choose to configure and register the application and target users. There are two types of registration methods:
      * `Internal` - In this mode, your app is limited to G Suite users within your organization. You can communicate with your internal users directly about how you'll use their data.
      * `External` - In this mode, your app is available to any user with a Google Account. External apps that request sensitive or restricted user data must first be verified by Google.    
   3. After you have chosen how to configure and register your app, you must enter information about the app, including app name, user support email, application home page etc.
5. Click on the "Credentials" tab. In the upper part you will see the button "+ Create credentials", point your cursor over it and choose "OAuth client ID" from the list that appears. Select the application type and add the required URIs. After that, the "Client ID" and "Client Secret" will be generated, the values of which will be used for authentication.

### Cloudflare worker

Cloudflare Workers is a set of scripts running on Cloudflare servers. They are located in data centers of 90 countries and 193 cities. The platform allows you to run any JavaScript code without having to support the infrastructure.
 
 But before executing the woker logic, it is necessary to define global variables and their values. 
  For complete work Google authentification uses the following variables:
   
   * `GOOGLE_CLIENTID=<CLIENT_ID>.apps.googleusercontent.com`. Your client ID. 
   * `GOOGLE_CLIENTSECRET=<CLIENT_SECRET>`; Your client Secret.
   * `GOOGLE_CODE_LINK=https://oauth2.googleapis.com/token`. Google Auth access token.
   	
   	 Google Oauth Token. To access the endpoint from your code you need to provide an access token. The access token provided in response to the above call to the token endpoint expires pretty quickly, usually in an hour, so it is not sufficient to just store that and reuse it. The response is JSON that contains an access token like this:
     ```json
       {
         "access_token": "1/fFAGRNJru1FTz70BzhT3Zg",
         "expires_in": 3920,
         "scope": "https://www.googleapis.com/auth/bigquery",
         "token_type": "Bearer"
       }
     ```
   * `GOOGLE_REDIRECT_1=https://accounts.google.com/o/oauth2/v2/auth` - to obtain user authorization. This endpoint handles active session lookup, authenticates the user, and obtains user consent.
   * `GOOGLE_REDIRECT_2=https://<auth-go-gi.2js-no>.workers.dev/callback/google` - redirect url after successful authentication. Must retaliate against the name of the woker.
   * `STATE_SECRET_REGISTRY_LENGTH=10000` - state registry size.
   * `STATE_SECRET_TTL_MS=300000` - time to live.

Take a look at an example:

```javascript
addEventListener('fetch', e => e.respondWith(handleRequest(e.request)));

const states = [];   

function randomString(length) {
  const iv = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

function hasStateSecretOnce(state) {
  const index = states.indexOf(state);
  return index >= 0 ? states.splice(index, 1) : false;
}

function getStateSecret(ttl, stateRegistrySize) {
   const secret = randomString(12);                             //[3.1.1]
   states.length > stateRegistrySize && states.shift();
   states.push(secret);
   setTimeout(() => hasStateSecretOnce(secret), ttl);           //[3.1.2]
   return secret;
}

function makeRedirect(path, params) {
  return path + '?' + Object.entries(params).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&');
}

async function fetchAccessToken(path, data) {
  return await fetch(path, {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: Object.entries(data).map(([k, v]) => k + '=' + encodeURIComponent(v)).join('&')
  });
}

async function googleProcessTokenPackage(code) {
  const tokenPackage = await fetchAccessToken(                                 //[7]
    GOOGLE_CODE_LINK, {
      code,
      client_id: GOOGLE_CLIENTID,
      client_secret: GOOGLE_CLIENTSECRET,
      redirect_uri: GOOGLE_REDIRECT_2,
      grant_type: 'authorization_code'
    }
  );
  const jwt = await tokenPackage.json();
  const [header, payloadB64url, signature] = jwt.id_token.split('.');
  const payloadText = atob(fromBase64url(payloadB64url));
  const payload = JSON.parse(payloadText);
  return payload.sub;
}

async function handleRequest(req) {
  const url = new URL(req.url);                                       
  const [ignore, action, data] = url.pathname.split('/');      //[2]
  if (action === 'login') {                                    //[2.1]
    let redirect;
    if (data === 'google') {                                   //[2.2]
      redirect = makeRedirect(GOOGLE_REDIRECT_1, {             //[3]
        state: getStateSecret(STATE_SECRET_TTL_MS, STATE_SECRET_REGISTRY_LENGTH),  //[3.1]
        nonce: randomString(12),                                                   
        client_id: GOOGLE_CLIENTID,                                                
        redirect_uri: GOOGLE_REDIRECT_2,                                           
        scope: 'openid email',                                                     
        response_type: 'code',                                                     //[3.6]
      });
    } else
      return new Response('error1');
    return Response.redirect(redirect);                                            //[4]
  }
  if (action === 'callback') {                                                     //[5]
    const state = url.searchParams.get('state');
    if (!hasStateSecretOnce(state))
      return new Response('Error 667: state timed out');
    const code = url.searchParams.get('code');
    let userText;
    if (data === 'google')                                                         //[6]
      userText = 'go' + await googleProcessTokenPackage(code);                     
    else
      return new Response('error2');
    return new Response(userText, {status: 201});                                  //[8]
  }
  const mainpage = `hello sunshine GITHUB oauth28 <a href='/login/google'>login google</a>`
  return new Response(mainpage, {headers: {'Content-Type': 'text/html'}});     //[1]
}
```

1. When you first load a simple HTML that has a simple button for authentication. When you click on the button an additional path `/login/google` will be added to the url.
2. Each time fetch events are activated, the script checks for values that define actions and data. When the user presses a button:
    1. The variable `action` is defined as `login` and the variable `redirect` is initialized.
    2. `data` variable = `"google"`.
3. The `redirect' variable gets its value using the `makeRedirect()` function. The `makeRedirect()` function takes two parameters: `userAuthorizationUrl` and `params` object which defines the redirect parameters. Parameters of the redirect include:
   1. `state` - defines the state of the secret. Should include the value of the anti-forgery unique session token, as well as any other information needed to recover the context when the user returns to your application, e.g., the starting URL. The value is determined using the `getStateSecret()` function which accepts two parameters: `time to live` and `state registry size. 
     1. The state array is filled with hexString of a random number until the number exceeds the value of `state registry size`.
     2. The state secrets on live in the memory of cf worker until the timeout is reached. When the timeout (ttl) is reached, the state is deleted from the memory;
   2. `nonce` - is a random value generated by your app that enables replay protection when present;
   3. `client_id` - obtain from the API;
   4. `redirect_uri` - HTTP endpoint on your server that will receive the response from Google. The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client, which you configured in the API Console Credentials page;
   5. `scope` - basic request should be `openid email`;
   6. `response_type` - basic authorization code flow request should be code.
4. Redirect to the authentication page. It is a form in which the user can choose a Google account with which to log on to the site.
5. After successful authentication, the URL will be changed. This is a new fetch event which will determine the value of the variable action on the callback. This will only be done if user authentication is successful.  
6. The new URL should retrieve the "google" property and the `code` parameter. 
    ```
     https://auth-go-gi.2js-no.workers.dev/callback/github?code=....
    ```
    The `googleProcessTokenPackage()` function will define the token package using the `fetchAccessToken()` function.
7. The `fetchAccessToken()` function allows to get `JWT` using POST request and define `header`, `payload` (in Base64url format) and `signature`.
8. If the code execution is successful, the server will return `payloadText` of JWT.

### Reference
1. [Google APIs](https://console.developers.google.com/)
2. [Google+ API](https://console.developers.google.com/marketplace/product/google/plus.googleapis.com?q=search&referrer=search&hl=uk&project=spiritual-aloe-294222)
3. [Cloudflare workers](https://workers.cloudflare.com/)
4. [MDN: Redirections in HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)
 
