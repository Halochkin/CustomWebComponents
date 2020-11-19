  //todo: fix this
  
  Application generates a random string (`state` variable from step 1) and send it to the authorization server using the `state`  parameter. The authorization server send back that `state` parameter. To decrypt it we need to use password, ivand data. Password, stored in `SECRET` global variable, iv contains inside encrypted data string.
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