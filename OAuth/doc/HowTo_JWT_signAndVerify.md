# HowTo: sign and verify?

### Public key
When signing a message, the sender signs it with his private key and the recipient can use the sender's public key to verify the signature. Only the sender's keys are used here. The signature guarantees that the message sent from the identified sender and the content of the message have not changed during transmission.
Thus JSON Web Tokens (JWT) must first be signed and then encrypted for better security. While it is technically possible to do the opposite, it is always good to do it in this order to protect the privacy of the subscriber.

```javascript
  const publicKey = {
    kty: "RSA",
    e: "AQAB",
    use: "sig",
    kid: "8zaYXypVQPODbgom3580DpqYr8MPR5YPd-gcdfRdMzo",
    alg: "RS256",
    n: "vnxiHn6cuLLf-w3Js200XxwgESgy4Gc81AUqdSFLBoMH4juZEqS3yMBpEWtk5t5gcnlEM5qE42o8i7UMhQ9YVPwjBRKj0KnHtY7Br8XZxM-FeyVyYhtLKg1NFoLUItOd5A4Cmq2hOvyel_CW_XB9cgaTEGcyvL-GJAY9Vu4qHgvT6bYAcfxaxos951U0JHJAyJqOspBkF1tffvFwSQmfQDQK-p99-kZTqypa12LKPlXDAWaCbu-DTNVjfz4ufRIs_FobwdPuuJ2Nbm1ou3CxEkdhSaXBvRRF_P3Q3cN5kOuGJ0z5aQLVB45Vq3jH1fDQyc7hRGZQj72s4Oc5kFWorQ"
  }
```

If you trust the sender, sender might pre shared public key with you. In cryptography using a public key, the public key is available to everyone within the information system, and the private key belongs to the intended subject. There is no need to change key pairs unless they have been compromised. But sometimes you never know that your keys have been compromised unless it affects you. So it's always good to have an expiration date for your key pairs. In this case, entities that depend on your pre-shared public key to verify your signature are in trouble because of a key change. Therefore, it is better to expose your public key via a URL to make access to your public key dynamic. The code snippet below can be used to check the JWT token using the public key URL.

### Private key  
The private key is owned by the recipient. It is is used to create the signature.

```javascript
  const privateKey = {
    p: "5bxZBZejvyAK5_vtFMDI2vqmf2zBitAM-Y1tfpDZDIM5Q7jWSlFnhibcfkfK7fg_P4DC87gSkZtYRE5X5JttrG58CNsm8Vvj6DxLBhC_zbtxizhtlhbsV2euTxibeSSG45CjFWqlqXJqbPzhbQBxvwEL1gVu4_-AMU55gTcaHj0",
    kty: "RSA",
    q: "1ENQWNGAf3xBQM2UhUKsy7mHKYFiy3_dWS5JelId1hTdwm9g5sWMP8qsZNdtpfbG0nU7inpAO7vvt3CsAe7bgJR9io511gA32mhtOiswBQdoBDSYd_gJAJHWyp-_5WQP38XaJluuf0gLfxfFugFBs_MEwcByX5dlexMoFLUCSzE",
    d: "NSbh_h5YPtVy2EvVn2J2fZ-Mdx0fbSyBdavnV_2tQKjpV0BIC0K5IaRG7RxpcF5WzTp3RGr2b7qiIF2pm6tXe4dLgkvcOApX9ppaA2ESze8WEPG3BBcXlylU_FYPOZSQ9yTNpzmRxrLc0grJJvjvmBSrjqUtLCvJE15GWW5lhDJPXtadlBgxa7xkeQklddTmbZKhXnjEM4WhCQzUakAKMmK-iLOf2MKdV1Ht5Q6qTuEuxr8Eh6E2yMjnTWU11FIv0vcTtIHXUuHIoxYQsdtUrRc4uvY5Hfn1cjSJ7j8pY9666ac-BBn3bB_GvtXJqc9h0pWhTlNz9i_Xm6vj6JwswQ",
    e: "AQAB",
    use: "sig",
    kid: "8zaYXypVQPODbgom3580DpqYr8MPR5YPd-gcdfRdMzo",
    qi: "GqS1-jQkNIP1NWfYipa_tNpIyoJxqrI15adfSDsuBNUdOc-nTNBXEJZcPLL8xaAdqp7BENgORbsRFXQUFWg4DM_Gvs-6so5LNjI0Fr2ITnaSCYo9T5B9bMFYmLMZ72xfuj80sVl-OD5_5EWGWh-J4SZvqe8fo9bDR6XWvRUIZp8",
    dp: "aLUVpfTdTwkdr2olPmY3pYbESCObetckcsFA_ISsSIWune0qziiYFI61xGCYXyncOedH86kb3X1-F3PVn34v2H1qzuaDs1H8aCbC0vrjULN0Js4LNHMyOQwqaCaBBg_d4u5TRjmbU8WwOAhx_ipLrZCegmdriUM0fESWIIyqvMk",
    alg: "RS256",
    dq: "X3EVA5rQCIK6ZIULrw_X2pLFb6g53_7SbHMfntylhclEHVUvYRSah2R-N6mWJ_XaWG9WImHt1-4dT4JeFVBtaldaS57a5Sqb8pzZ4DnjEZ_O6XUsyWTBx3vL9Lf39REVAi1Ydb7rq1eds7vgsE44WM2A6g26X7kXbEukzgrFyUE",
    n: "vnxiHn6cuLLf-w3Js200XxwgESgy4Gc81AUqdSFLBoMH4juZEqS3yMBpEWtk5t5gcnlEM5qE42o8i7UMhQ9YVPwjBRKj0KnHtY7Br8XZxM-FeyVyYhtLKg1NFoLUItOd5A4Cmq2hOvyel_CW_XB9cgaTEGcyvL-GJAY9Vu4qHgvT6bYAcfxaxos951U0JHJAyJqOspBkF1tffvFwSQmfQDQK-p99-kZTqypa12LKPlXDAWaCbu-DTNVjfz4ufRIs_FobwdPuuJ2Nbm1ou3CxEkdhSaXBvRRF_P3Q3cN5kOuGJ0z5aQLVB45Vq3jH1fDQyc7hRGZQj72s4Oc5kFWorQ"
  };
```
 In order to get a private cryptoKey object, the `importKey()` method is used. 
```javascript
    const privKey = await crypto.subtle.importKey('jwk', privateKey, {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'sha-256'
    }, true, ['sign']);
```

### HowTo sign
To generate a digital signature, `sign()` method is used. It takes as its key to sign with, some algorithm-specific parameters, and the data to sign. But in order to transfer the data they need to be converted to a JWT object. JWT consists of three parts: `header`, `payload` and `signature`. Use `publicKey.alg` and `publicKey.kid` to configure JWT header.

```javascript
  const rawJWTobj = {
    header: {
      typ: "JWT",
      alg: publicKey.alg,
      kid: publicKey.kid,
    },
    payload: {
      // ...
    }
  };
```

To get `signature` it is neccessary to convert both `header` and `payload` properties into `Base64` and then encode it and pass like an argument to `sign()`. The `sign()` method of the SubtleCrypto interface generates a digital signature. It takes as its arguments a key to sign with, some algorithm-specific parameters, and the data to sign. It returns a Promise which will be fulfilled with the signature.

````javascript
  async function signJwt(rawJWTobj, privKey) {
    const base64urlHeader = toBase64url(rawJWTobj.header);
    const base64urlPayload = toBase64url(rawJWTobj.payload);
    const data = base64urlHeader + '.' + base64urlPayload;

    const signature = await crypto.subtle.sign({
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'sha-256'
    }, privKey, new TextEncoder().encode(data));
    return data + '.' + Uint8ToBase64url(new Uint8Array(signature));
  }
 const jwt = await signJwt(rawJWTobj, privKey);
````

### How to verify
Before you can verify the keys. This is done using the `publicKey` and `importKey()` method.
```javascript
    const keys = {};
    keys[publicKey.kid] = await crypto.subtle.importKey('jwk', publicKey, {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'sha-256'
    }, false, ['verify']);
```

Now that we have the keys we can do verification.  The `verify()` method verifies a digital signature. It takes as its arguments a key to verify the signature with, some algorithm-specific parameters, the signature, and the original signed data. It returns a Promise which will be fulfilled with a Boolean value indicating whether the signature is valid.

```javascript
async function verifyAndExtract(jwt, pubKeys) {
    const [h64, p64, s64] = jwt.split('.');
    const header = JSON.parse(base64urlToString(h64));

    const verify = await crypto.subtle.verify({
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'sha-256'
    }, pubKeys[header.kid], base64urlToUint8Array(s64), new TextEncoder().encode(h64 + "." + p64));
    if (!verify)
      throw 'hackkkkk!';
    return {header, payload: JSON.parse(base64urlToString(p64))};
  }

 const verify = await verifyAndExtract(jwt, keys);

```

### Reference

*[MDN: importKey()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey)
*[MDN: verify()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/verify)
*[MDN: sign()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/sign)