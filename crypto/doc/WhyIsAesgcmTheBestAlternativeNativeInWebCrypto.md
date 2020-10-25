# Why is aes-gcm the best alternative native in web crypto?

### 1. What is  AES-GCM 
   The `Advanced Encryption Standard` (AES) is a block cipher that provides a high level of security and can accept different key sizes. 
    The `Galois/Counter Mode`( GCM) is a widely used mode of operation of symmetric block ciphers, which has high efficiency and performance. It is an authenticated encryption mode (AEAD), providing both confidentiality and authentication of transferred data (guaranteeing its integrity).
      GCM mode is defined for block ciphers with block size of 128 bits. There is a variant of GCM called GMAC, providing only data authentication, it can be used as an incremental message authentication code. Both GCM and GMAC accept an initialization vector of any length as input.
      Due to the presence of a Message authentication code, this mode of authenticated encryption allows the recipient to easily detect any changes in the message (both encrypted and supplemented with information transmitted openly) before decrypting it, which greatly improves protection against distortion, active MITM attacks and oracle-based attacks.
 
   The `Galois/Counter Mode` (GCM) is an [AEAD](https://www.youtube.com/watch?v=od44W45sCQ4) mode of operation for block ciphers.  GCM uses Counter Mode to encrypt the data, an operation that can be efficiently pipelined.  Further, GCM authentication uses operations that are particularly well suited to efficient implementation in hardware, making it especially appealing for high-speed implementations, or for implementations in an efficient and compact circuit.
    
  >Any AEAD algorithm provides an intrinsic authentication tag.  In many applications, the authentication tag is truncated to less than full length.  
   
### 2.  AES-GCM properties list

The AES-GCM object of the Web Crypto API represents `Object` that should be passed as the _`algorithm`_ parameter into `decrypt()`, `wrapKey()`, or `unwrapKey()`, using the AES-GCM algorithm.

```javascript
const result = crypto.subtle.encrypt(algorithm, key, data);
```

 1. `additional-data` - contains additional data (`Uint8Array`) that will not encrypted but will be authenticated along with the encrypted. If `additionalData` is given here then the same data must be given the corresponding call to `decrypt()`: if the data given to the call does not match the original data, the decryption will throw exception. 

    This gives you a way to authenticate associated data having to encrypt it. The bit length of `additionalData` must be `≤ 264-1`. The `additionalData` property is optional and may be omitted without the security of the encryption operation.

 2. `iv` — the initialization vector (`Uint8Array`). This must be unique every encryption operation carried out with a given key.Put way: never reuse an IV with the same key. The AES-GCM specification that the IV should be 96 bits long, and typically contains bits a random number generator.
       > Note that the IV does not have to be secret, unique: so it is OK, for example, to transmit it in the clear the encrypted message.
 3. `name` - A `DOMString`/`UTF-16 String`.
 4. `tag-length` - This determines the size in bits (`Number`) of the authentication generated in the encryption operation and used for authentication the corresponding decryption. It is optional and defaults to 128 if it is not specified.
  According to the Web Crypto specification this must have one the following values: `32, 64, 96, 104, 112, 120, or 128`. 

     
   ```javascript
    let algorithm = {name: 'AES-gcm', 
                     iv: new Uint8Array(16),
                     additionalData: new Uint8Array(1),
                     tagLength: 120}
   ```  

### 3. How to encrypt data
```javascript
const result = crypto.subtle.encrypt({name: 'AES-gcm', iv: new Uint8Array(16), additionalData: new Uint8Array(1), tagLength: 130}, key, data);
```
### 4. How to decrypt data

### 5. How to make a key 
Like this. Describe in detail
```javascript
Promise.resolve(null).then(function(result) {
    var usages = ['encrypt', 'decrypt'];
    var extractable = false;
    var algorithm = {name: 'aes-gcm'};

    debug('\nImporting AES-GCM key...');
    return crypto.subtle.importKey('raw', keyData, algorithm, extractable, usages);
}).then(function(result) {
    key = result;
```
### 6. why is the secret hashed before you make the key




### 2.1 And chapter 1 is: why is aes-gcm the best alternative native in web crypto?

### Reference
* [AES-GCM](https://www.w3.org/TR/WebCryptoAPI/#aes-gcm)
* [MDN: encrypt()](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt)
* [MDN: CryptoKey](https://developer.mozilla.org/en-US/docs/Web/API/CryptoKey)