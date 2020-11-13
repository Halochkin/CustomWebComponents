async function handleRequest(req) {
  const url = new URL(req.url);                                                          // Getting the URL values.
  const state = getState(STATE_SECRET_TTL_MS);                                           //[1]
  const encryptedState = await getEncryptedData(state);                                  //[2]
  const [ignore, action, data, rememberMe] = url.pathname.split('/');                    // get data from url

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
      return new Response('error1');
    return Response.redirect(redirect);
  }

  if (action === 'callback') {
    const stateParam = url.searchParams.get('state');
    let decryptedStateParam = await decryptData(stateParam, SECRET);
    if (!await checkStateSecret(decryptedStateParam))
      return new Response(res);
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