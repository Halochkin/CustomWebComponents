# HowTo: Google Github Auth with Cloudflare worker

## Why Cloudflare?

CloudFlare "accelerates" the work of the site by caching your site in its CDNs around the world. If you look at the map of CloudFlare servers distribution on their main page, you will see that more than 100 Cloudflare data centers are located around the world. Thus, a huge part of Internet users is almost in direct peering with them, so their CDN system is quite effective and allows you to "speed up" the work of your site, located, for example, in Ukraine, for users from, for example, Australia. 
Cloudflare uses CDN as an infrastructure to load your site faster. Hosting technologies of Cloudflare instantly optimize content. Reduces traffic consumption by 60% and 65% reduces the load on the server.


## Create and configure Google/Github App. Create worker (Cloudflare).
Before you start, create and configure both [Google](HowTo_GoogleAuth.md) and [Github](HowTo_GithubAuth.md) application. Create new common worker and define global variables.

### Configure worker
1. Open [Cloudflare dashboard] (https://dash.cloudflare.com/) and go to the **"Workers"** tab using the menu on the right side of the page.
2. Create a new worker.
3. Go to the **Settings** tab.
4. Define next global variables 
  * `GITHUB_ACCESS_TOKEN_LINK  :   https://github.com/login/oauth/access_token` HTTP POST request url to exchange this access code for Github authentication access token.
  * `GITHUB_CLIENTID	<Your Github application clientID>` Github application clientID.
  * `GITHUB_CLIENTSECRET	<Your Github application client Secret>` Github application client secret.
  * `GITHUB_OAUTH_LINK	https://github.com/login/oauth/authorize` A basic redirect url to GitHub to authorize your application.
  * `GITHUB_REDIRECT	https://<Your worker domain>.workers.dev/callback/github` Redirect url after successful Github authentication.
  * `GOOGLE_CLIENT_ID	<Your Google application clientID>` Google application clientID.
  * `GOOGLE_CLIENT_SECRET	<Your Google application Client Secret>` Google application client secret.
  * `GOOGLE_CODE_LINK	https://oauth2.googleapis.com/token`  HTTP POST request url to exchange this access code for Google auth access token.
  * `GOOGLE_REDIRECT_1	https://accounts.google.com/o/oauth2/v2/auth`  A basic redirect url to GitHub to authorize your application.
  * `GOOGLE_REDIRECT_2	https://<Your worker domain>.workers.dev/callback/google` Redirect url after successful Google authentication.
  * `SECRET	klasjdfoqjpwoekfj!askdfj` Cypher key.
  * `STATE_SECRET_TTL_MS	300000` State secret relevance time.
## Code the worker

Make a `handleRequest()` function:

```javascript
let rememberUser;

async function handleRequest(req) {
  const url = new URL(req.url);                                       // Getting the URL values. 
  const state = getState(STATE_SECRET_TTL_MS);                        //[1]
  const encryptedState = await getEncryptedData(state);               //[2]
  const [ignore, action, data, rememberMe] = url.pathname.split('/'); // get data from url

  if (action === "login") {
    let redirect;
    rememberUser = !!(rememberMe && rememberMe === "rememberMe");     //depending on the value will be determined max-age of cookies
    if (data === 'github') {                                          //[6]
      redirect = makeRedirect(GITHUB_OAUTH_LINK, {
        state: encryptedState,
        client_id: GITHUB_CLIENTID,
        redirect_url: GITHUB_REDIRECT,
        scope: 'user',
      });
    } else if (data === 'google') {
      redirect = makeRedirect(GOOGLE_REDIRECT_1, {
        state: encryptedState,
        nonce: randomString(12),
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_2,
        scope: 'openid email profile',
        response_type: 'code',
      });
    } else
      return new Response('error1');
    return Response.redirect(redirect);
  }

  if (action === 'callback') {                        //After successful authentication, the user is redirected to `/callback` url.
    const stateParam = url.searchParams.get('state'); //get state param from response url
    let decryptedStateParam = await decryptData(stateParam, SECRET);  //[7]
    if (!await checkStateSecret(decryptedStateParam))                 //[8]
      return new Response(res);
    const code = url.searchParams.get('code');                        //get code param to have access to user data

    //AES-GCM
    let userText;
    if (data === 'google')
      userText = {result: await googleProcessTokenPackage(code)} //the userText is the sub.
    else if (data === 'github')
      userText = {result: await githubProcessTokenPackage(code)}; //userText is the github id nr.
    else
      return new Response('404');
    
    const encryptedData = await getEncryptedData(JSON.stringify(userText.result)); // encrypt userText object

    return new Response(popup(userText.result, 'https://' + myDomain), {         //set encryptedData as sessionID cookie value
      status: 201, headers: {
        'content-type': 'text/html',                                
        'Set-Cookie': `sessionID=${encryptedData}; HttpOnly; SameSite=Strict; Path=/; Domain=${myDomain};` + (rememberUser ? `Max-Age=10000;` : ``) //depending on the value of rememberUser we define cookies Max-Age 
      }
    });
  }
   // Remove cookie and response with login form if user log out
  if (action === 'logout') {
    return new Response(mainpage("logout", "", 'https://' + myDomain), {
      status: 201,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': `sessionID=undefined; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=-1; Domain=${myDomain}; `
      }
    });
  }

  const cookie = getCookieValue(req.headers.get('cookie'), 'sessionID');                                           //[3]
  if (cookie) {                                                                                                    //[4]
    let decryptedData = await decryptData(cookie, SECRET);
    return new Response(mainpage("logged", decryptedData, 'https://' + myDomain), {
      status: 201,
      headers: {
        'Content-Type': 'text/html',
      }
    });
  }

  return new Response(mainpage("logout", "", 'https://' + myDomain), {headers: {'Content-Type': 'text/html'}});    //[5]
}
```
1.  Both Google and Github have parameters that are random string using `getState()` which generate such string.
 ```javascript
function getState(ttl) {
    return [Date.now(), ttl, uint8ToHexString(crypto.getRandomValues(new Uint8Array(8)))].join('.');
}
```
 It is used to protect against XSRF. Your application generates a random string and send it to the authorization server using parameters.
2. Encrypt state using `AES-GCM` cypher. To encrypt data `getEncryptedData()` is use.
### HowTo encrypt data.
```javascript
async function getEncryptedData(data) {          
    const iv = crypto.getRandomValues(new Uint8Array(12)); 
    const cipher = await encryptAESGCM(SECRET, iv, data);
    return uint8ToHexString(iv) + '.' + toBase64url(btoa(cipher));
}
```
 The function accepts data to be encrypted. To encrypt the data with AESGCM cipher, you need to create Uint8Array initialization vector (iv). `iv` — A random or pseudo-random sequence of characters that is added to an encryption key to improve its security. Must be unique every encryption operation carried out with a given key. Put way: never reuse an IV with the same key. Don't re-use initialization vectors. It is necessary to generate a new iv every time your encrypt. Recommended to use 12 bytes length. Initialization vector does not require encryption and is usually transmitted together with the cryptographic key. So result of function execution will be a string which contain iv and encrypted data divided by `.`.
 To encrypt data use:
  *`SECRET` (secret key which we define as global variable)
  * `iv`
  * `data` data to be encrypted.
   
```javascript
let cachedPassHash;

async function passHash(pw) {
    return cachedPassHash || (cachedPassHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw)));
}

async function makeKeyAESGCM(password, iv) {
    const pwHash = await passHash(password);    //small value generated by a hash function from a whole message
    const alg = { name: 'AES-GCM', iv: iv };    // specify algorithm to use
    return await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt', 'encrypt']);  // use pw to generate key
}

async function encryptAESGCM(password, iv, plaintext) {
    const key = await makeKeyAESGCM(password, iv);            //crypto key
    const ptUint8 = new TextEncoder().encode(plaintext);     // encode plaintext as UTF-8
    const ctBuffer = await crypto.subtle.encrypt({ name: key.algorithm.name, iv: iv }, key, ptUint8);// encrypt plaintext using key
    const ctArray = Array.from(new Uint8Array(ctBuffer));     // ciphertext as byte array
    return ctArray.map(byte => String.fromCharCode(byte)).join('');   // ciphertext as string
}
```

3. Server will check the cookies before response. For example, if a user chose "Remember Me" before login - the server will place a small
4. If there are "sessionID" cookie, the server will not response with login form, but will assume that the user already logged in. It should be noted that the data that the server adds as the value of cookies encrypted, and without a key it is very difficult for attackers to spoof it. Server responds with `mainpage()` which provide HTML template with `<script>`. 
```javascript
function mainpage(command, value, popupOrigin) {
  const login = `<a href='/login/google'>login google</a><br>
                   <a href='/login/github'>login github</a><br>
                   <label>RememberMe:
                       <input type='checkbox'>
                   </label>`
  const logout = `<span>Hello ${value}</span><a href="/logout">logout</a>`
  const script = `<script>
  let loginWindow;
  let loginWindowUrl;

  function receiveLoginData(e) {
    if (e.origin !== "${popupOrigin}" || e.source !== loginWindow)
      return;
    window.location = '${popupOrigin}';                           //open origin url after login
  }

  window.addEventListener('message', receiveLoginData);

  for (let link of document.querySelectorAll("a"))
    link.addEventListener('click', openRequestedSinglePopup);


  function popupParameters() {                                       
    const width = Math.min(600, window.screen.width);
    const height = Math.min(600, window.screen.height);
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    return "resizable,scrollbars,status,opener," +
      Object.entries({width, height, left, top}).map(kv => kv.join('=')).join(',');
  }

  function openRequestedSinglePopup(event) {         
    event.preventDefault();
    let url = event.currentTarget.href;
    if (event.currentTarget.pathname === "/logout"){
      return window.location = url;                  // return and change location to prevent open popup window when user log out
    }
    let input = document.querySelector('input');
    if (input && input.checked)
      url += '/rememberMe';                         
    if (!loginWindow || loginWindow.closed) {
      loginWindow = window.open(url, "_blank", popupParameters()); 
    } else if (loginWindowUrl !== url)
      loginWindow.location = url;
    loginWindowUrl = url;
    loginWindow.focus();
  }
</script>`;
    return (command === "logged" ? logout : login) + script;
}
```
5. If there are no cookies, the server will prompt the user to login.
6. After clicking on the button for login (Google or Github), the user must be redirected to the `/login` which represents form provided by the API. For successful authentication the browser must make a request using `makeRedirect()` which return redirect url. Function get next parameters: 
              * `state`: An unguessable random string. It is used to protect against cross-site request forgery attacks.
              * `client_id` The client ID you received from GitHub when you registered.
              * `redirect_uri` (Google) / `redirect_uri` (Github)  The URL in your application where users will be sent after authorization.
              * `scope` must be "user" string for Github and "openid email profile" for Google.
              * `nonce` (Google only) random value generated by your app that enables replay protection.
              * `response_type` (Google only) launches a basic authorization code flow.        
7.    Application generates a random string (`state` variable from step 1) and send it to the authorization server using the `state`  parameter. The authorization server send back that `state` parameter. To decrypt it we need to use password, ivand data. Password, stored in `SECRET` global variable, iv contains inside encrypted data string.
```javascript

async function decryptData(data, password) {
    const [ivText, cipherB64url] = data.split('.');  //split encrypted data to get iv and cipher
    const iv = hexStringToUint8(ivText);
    const cipher = atob(fromBase64url(cipherB64url));
    return await decryptAESGCM(password, iv, cipher);
}

async function decryptAESGCM(password, iv, ctStr) {
    const key = await makeKeyAESGCM(password, iv);  //make crypto key 
    const ctUint8 = new Uint8Array(ctStr.match(/[\s\S]/g).map(ch => ch.charCodeAt(0))); // ciphertext as Uint8Array
    const plainBuffer = await crypto.subtle.decrypt({ name: key.algorithm.name, iv: iv }, key, ctUint8); // decrypt ciphertext using key
    return new TextDecoder().decode(plainBuffer);   // return the plaintext
}

 function fromBase64url(base64urlStr) {
     base64urlStr = base64urlStr.replace(/-/g, '+').replace(/_/g, '/');
     if (base64urlStr.length % 4 === 2)
         return base64urlStr + '==';
     if (base64urlStr.length % 4 === 3)
         return base64urlStr + '=';
     return base64urlStr;
 }

function hexStringToUint8(str) {
    return new Uint8Array(str.match(/.{2}/g).map(byte => parseInt(byte, 16)));
}

```
8. If both states (initial from step 1 and `state` param value) are the same, this confirms that request and response sent in the same browser. If state parameters are different, someone else has initiated the request. To check it we use `checkStateSecret()`. 
```javascript
async function checkStateSecret(data) {
    let [iat, ttl, someOtherState] = data.split('.');
    iat = parseInt(iat);
    ttl = parseInt(ttl);
    const now = Date.now();
    const stillTimeToLive = now < iat + ttl;   // check that difference between  sum of initial ttl and responded ttl is not more than the maximum allowed value. 
    const notAFutureDream = iat < now;
    return stillTimeToLive && notAFutureDream;
}
```
9. After checking the stateSecret and getting the parameter code, you can make a user request. User information request in Google and Github is a bit different.

## Process Github Access Token

```javascript
async function githubProcessTokenPackage(code) {
 const accessTokenPackage = await fetchAccessToken(GITHUB_ACCESS_TOKEN_LINK, { //[1]
        code,
        client_id: GITHUB_CLIENTID,
        client_secret: GITHUB_CLIENTSECRET,
        redirect_uri: GITHUB_REDIRECT,
        state
    });
  const tokenText = await tokenPackage.text();                                //[2]
  const access_token = tokenText.split('&')[0].split("=")[1];                 //[3]
  const user = await fetchUser(access_token);                                 //[4]
  return await user.json();                                                   //[5]
}
```
  1. POST request is used to get JWT. 
  ```javascript
  async function fetchAccessToken(data) {
                      return await fetch(GITHUB_TOKEN, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                          body: data
                      });
                  }
   ```
  The request must include the following parameters in the POST body:
    * `client_id` The client ID you received from GitHub for your GitHub App.
    * `client_secret` The client secret you received from GitHub for your GitHub App.
    * `code` The code you received as a response.
    * `redirect_uri` The URL in your application where users are sent after authorization.
    * `state` The unguessable random string.
  3. `text()` method takes a response stream and reads it to completion.  
  4. To get information about the user you should use the value of the access_token property. Since the object is returned as a string, it is necessary to get its value.
  5. GET request to get a user.
```javascript
async function fetchUser(token) {
  return await fetch(GITHUB_LINK4_USER_API, {
    method: 'GET',
    headers: {
      'Authorization': 'token ' + token,
      'User-Agent': 'maksgalochkin2',   // https://github-auth.<maksgalochkin2>.workers.dev. Takes from worker url
      'Accept': 'application/vnd.github.v3+json'
    }
  });
}
``` 
6. The `json()` method of the Body mixin takes a response and reads it to completion. The result of execution is JWT.  
7. Return a new Response with user info.

## Process Google Access Token
 
```javascript
    async function googleProcessTokenPackage(code) {
    const tokenPackage = await fetchAccessToken(                              //[1]
        GOOGLE_CODE_LINK, {
            code,
            client_id: GOOGLE_CLIENT_ID,
            client_secret: GOOGLE_CLIENT_SECRET,
            redirect_uri: GOOGLE_REDIRECT_2,
            grant_type: 'authorization_code'
        }
    );                                                       
      const jwt = await tokenPackage.json();                                  //[2]
      const [header, payloadB64url, signature] = jwt.id_token.split('.');     //[3]
      const payloadText = atob(fromBase64url(payloadB64url));                 //[4]
      const payload = JSON.parse(payloadText);                                //[5]
      return JSON.stringify({                                                 //[6]
          id: payload.sub,
          email: payload.email,
          fullname: (payload.given_name + payload.family_name),
          provider: payload.iss
      });
    }
```

   1. POST request is used to get JWT. The request must include the following parameters in the POST body:
       * `code` the authorization code that is returned from the initial request.
       *` client_id`	the **client ID** that you obtain from the API Console Credentials page.
       * `client_secret`	the **client secret** that you obtain from the API Console Credentials page.
       * `redirect_uri` an authorized **redirect URI** for the given client_id specified in the API Console Credentials page.
       * `grant_type` this field must contain a  string value of "authorization_code".
   2. The `json()` takes a response and reads it to completion. The result of execution is JWT.
   3. Getting a header, payload u signature with JWT.
   4. Decoding a string from base64url.
       ```javascript
        function fromBase64url(base64urlStr) {
          base64urlStr = base64urlStr.replace(/-/g, '+').replace(/_/g, '/');
          if (base64urlStr.length % 4 === 2)
            return base64urlStr + '==';
          if (base64urlStr.length % 4 === 3)
            return base64urlStr + '=';
          return base64urlStr;
        }
       ```
   5. Conversion into object.
   6. Response JWT payload.
 ### Example
 Full example here
```javascript
let GITHUB_ACCESS_TOKEN_LINK = "https://github.com/login/oauth/access_token"
let GITHUB_CLIENTID = "Iv1.8b7189daaf358732"
let GITHUB_CLIENTSECRET = "c54696046f8f0a050f5bd040e4bbce5d1e39d64c"
let GITHUB_OAUTH_LINK = "https://github.com/login/oauth/authorize"
let GITHUB_REDIRECT = "https://auth-go-gi.maksgalochkin2.workers.dev/callback/github"
let GOOGLE_CLIENT_ID = "1088792034478-t22k7p03nsenhlcthph8pdqidmq3skrb.apps.googleusercontent.com"
let GOOGLE_CLIENT_SECRET = "qwt--5urahCnsyuJ- Ttq6pHE"
let GOOGLE_CODE_LINK = "https://oauth2.googleapis.com/token"
let GOOGLE_REDIRECT_1 = "https://accounts.google.com/o/oauth2/v2/auth"
let GOOGLE_REDIRECT_2 = "https://auth-go-gi.maksgalochkin2.workers.dev/callback/google"
let SECRET = "klasjdfoqjpwoekfj!askdfj"
let STATE_SECRET_REGISTRY_LENGTH = 10000
let STATE_SECRET_TTL_MS = 300000

function randomString(length) {
  const iv = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(iv).map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

function getCookieValue(cookie, key) {
  return cookie?.match(`(^|;)\\s*${key}\\s*=\\s*([^;]+)`)?.pop();
}

//Base64url
function toBase64url(base64str) {
  return base64str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function uint8ToHexString(ar) {
  return Array.from(ar).map(b => ('00' + b.toString(16)).slice(-2)).join('');
}

function hexStringToUint8(str) {
  return new Uint8Array(str.match(/.{2}/g).map(byte => parseInt(byte, 16)));
}


function fromBase64url(base64urlStr) {
  base64urlStr = base64urlStr.replace(/-/g, '+').replace(/_/g, '/');
  if (base64urlStr.length % 4 === 2)
    return base64urlStr + '==';
  if (base64urlStr.length % 4 === 3)
    return base64urlStr + '=';
  return base64urlStr;
}

let cachedPassHash;

async function passHash(pw) {
  return cachedPassHash || (cachedPassHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(pw)));
}

async function makeKeyAESGCM(password, iv) {
  const pwHash = await passHash(password);
  const alg = {name: 'AES-GCM', iv: iv};                            // specify algorithm to use
  return await crypto.subtle.importKey('raw', pwHash, alg, false, ['decrypt', 'encrypt']);  // use pw to generate key
}

async function encryptAESGCM(password, iv, plaintext) {
  const key = await makeKeyAESGCM(password, iv);
  const ptUint8 = new TextEncoder().encode(plaintext);                               // encode plaintext as UTF-8
  const ctBuffer = await crypto.subtle.encrypt({name: key.algorithm.name, iv: iv}, key, ptUint8);                   // encrypt plaintext using key
  const ctArray = Array.from(new Uint8Array(ctBuffer));                              // ciphertext as byte array
  return ctArray.map(byte => String.fromCharCode(byte)).join('');             // ciphertext as string
}

async function decryptAESGCM(password, iv, ctStr) {
  const key = await makeKeyAESGCM(password, iv);
  const ctUint8 = new Uint8Array(ctStr.match(/[\s\S]/g).map(ch => ch.charCodeAt(0))); // ciphertext as Uint8Array
  const plainBuffer = await crypto.subtle.decrypt({name: key.algorithm.name, iv: iv}, key, ctUint8);                 // decrypt ciphertext using key
  return new TextDecoder().decode(plainBuffer);                                       // return the plaintext
}

function getState(ttl) {
  return [Date.now(), ttl, uint8ToHexString(crypto.getRandomValues(new Uint8Array(8)))].join('.');
}

async function getEncryptedData(data) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await encryptAESGCM(SECRET, iv, data);
  return uint8ToHexString(iv) + '.' + toBase64url(btoa(cipher));
}

//GET REDIRECT AND POST ACCESS_TOKEN
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


async function checkStateSecret(data) {
  let [iat, ttl, someOtherState] = data.split('.');
  iat = parseInt(iat);
  ttl = parseInt(ttl);
  const now = Date.now();
  const stillTimeToLive = now < iat + ttl;
  const notAFutureDream = iat < now;
  return stillTimeToLive && notAFutureDream;
}

async function decryptData(data, password) {
  const [ivText, cipherB64url] = data.split('.');
  const iv = hexStringToUint8(ivText);
  const cipher = atob(fromBase64url(cipherB64url));
  return await decryptAESGCM(password, iv, cipher);
}


async function googleProcessTokenPackage(code) {
  const tokenPackage = await fetchAccessToken(
    GOOGLE_CODE_LINK, {
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_REDIRECT_2,
      grant_type: 'authorization_code'
    }
  );
  const jwt = await tokenPackage.json();
  const [header, payloadB64url, signature] = jwt.id_token.split('.');
  const payloadText = atob(fromBase64url(payloadB64url));
  const payload = JSON.parse(payloadText);
  return {
    name: payload.name,
    id: payload.sub
  };
}

async function githubProcessTokenPackage(code, state) {
  const accessTokenPackage = await fetchAccessToken(GITHUB_ACCESS_TOKEN_LINK, {
    code,
    client_id: GITHUB_CLIENTID,
    client_secret: GITHUB_CLIENTSECRET,
    redirect_uri: GITHUB_REDIRECT,
    state
  });
  const data = await accessTokenPackage.text();
  const x = {};
  data.split('&').map(pair => pair.split('=')).forEach(([k, v]) => x[k] = v);
  const accessToken = x['access_token'];
  const user = await fetch('https://api.github.com/user', {
    headers: {
      'Authorization': 'token ' + accessToken,
      'User-Agent': 'maksgalochkin2',
      'Accept': 'application/vnd.github.v3.raw+json'
    }
  });
  const userData = await user.json();
  return {
    name: userData.name,
    id: userData.id
  };
}


function mainpage(command, value, popupOrigin) {
  const login = `<a href='/login/google'>login google</a><br>
<a href='/login/github'>login github</a><br>
RememberMe: <input type='checkbox'/><hr>`
  const logout = `<span>Hello ${value}</span><a href="/logout">logout</a>`

  const script = `<script>
  let loginWindow;
  let loginWindowUrl;


  // handle message event. When we got message event from /callback it means that user logged in, So just change location
  function receiveLoginData(e) {
    if (e.origin !== "${popupOrigin}" || e.source !== loginWindow)
      return;
    window.location = '${popupOrigin}';
  }

  window.addEventListener('message', receiveLoginData);


  for (let link of document.querySelectorAll("a"))
    link.addEventListener('click', openRequestedSinglePopup);


  function popupParameters() {
    const width = Math.min(600, window.screen.width);
    const height = Math.min(600, window.screen.height);
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    return "resizable,scrollbars,status,opener," +
      Object.entries({width, height, left, top}).map(kv => kv.join('=')).join(',');
  }

  function openRequestedSinglePopup(event) {
    event.preventDefault();
    let url = event.currentTarget.href;
    if (event.currentTarget.pathname === "/logout"){
      return window.location = url;                  // return and change location to prevent open popup window
    }
    let input = document.querySelector('input');
    if (input && input.checked)
      url += '/rememberMe';
    if (!loginWindow || loginWindow.closed) {
      loginWindow = window.open(url, "_blank", popupParameters());
    } else if (loginWindowUrl !== url)
      loginWindow.location = url;
    loginWindowUrl = url;
    loginWindow.focus();
  }
</script>`;
  return (command === "logged" ? logout : login) + script;
}

function popup(cookieData, myDomain) {
  return `
 <script>
  setTimeout(function () {
    window.opener.postMessage('${cookieData}', '${myDomain}');
    window.close();
  }, 200);
</script>`;
}

const myDomain = 'auth-go-gi.maksgalochkin2.workers.dev';
let rememberUser;


async function handleRequest(req) {
  const url = new URL(req.url);
  const state = getState(STATE_SECRET_TTL_MS);
  const encryptedState = await getEncryptedData(state);
  const [ignore, action, data, rememberMe] = url.pathname.split('/');

  if (action === "login") {
    let redirect;

    rememberUser = !!(rememberMe && rememberMe === "rememberMe");
    if (data === 'github') {
      redirect = makeRedirect(GITHUB_OAUTH_LINK, {
        state: encryptedState,
        client_id: GITHUB_CLIENTID,
        redirect_url: GITHUB_REDIRECT,
        scope: 'user',
      });
    } else if (data === 'google') {
      redirect = makeRedirect(GOOGLE_REDIRECT_1, {
        state: encryptedState,
        nonce: randomString(12),
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: GOOGLE_REDIRECT_2,
        scope: 'openid email profile',
        response_type: 'code',
      });
    } else
      return new Response('error1' + action + data);
    return Response.redirect(redirect);
  }

  if (action === 'callback') {
    const stateParam = url.searchParams.get('state');
    // return new Response(stateParam)

    let decryptedStateParam = await decryptData(stateParam, SECRET);
    if (!await checkStateSecret(decryptedStateParam))
      return new Response("Wrong code param");
    const code = url.searchParams.get('code');

    //AES-GCM
    let userText;
    if (data === 'google')
      userText = {result: await googleProcessTokenPackage(code)} //the userText is the sub.
    else if (data === 'github')
      userText = {result: await githubProcessTokenPackage(code)}; //userText is the github id nr.
    else
      return new Response('404');

    // encrypt userText object
    const encryptedData = await getEncryptedData(JSON.stringify(userText.result));

    //set user info as cookie
    return new Response(popup(userText.result, 'https://' + myDomain), {
      status: 201, headers: {
        'content-type': 'text/html',
        'Set-Cookie': `sessionID=${encryptedData}; HttpOnly; SameSite=Strict; Path=/; Domain=${myDomain};` + (rememberUser ? `Max-Age=10000;` : ``)
      }
    });
  }

  if (action === 'logout') {
    return new Response(mainpage("logout", "", 'https://' + myDomain), {
      status: 201,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': `sessionID=undefined; Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=-1; Domain=${myDomain}; `
      }
    });
  }

  const cookie = getCookieValue(req.headers.get('cookie'), 'sessionID');
  if (cookie) {
    let decryptedData = await decryptData(cookie, SECRET);
    return new Response(mainpage("logged", decryptedData, 'https://' + myDomain), {
      status: 201,
      headers: {
        'Content-Type': 'text/html',
      }
    });
  }

  return new Response(mainpage("logout", "", 'https://' + myDomain), {headers: {'Content-Type': 'text/html'}});
}

addEventListener('fetch', e => e.respondWith(handleRequest(e.request)));

```
## Reference
 * [OpenID Connect](https://developers.google.com/identity/protocols/oauth2/openid-connect)
 * [MDN: .json()](https://developer.mozilla.org/en-US/docs/Web/API/Body/json)
 * [Base64](https://en.wikipedia.org/wiki/Base64)
 * [Google APIs](https://console.developers.google.com/)
 * [Authorizing OAuth Apps](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/)
 * [Live demo](https://github-auth.maksgalochkin2.workers.dev/)