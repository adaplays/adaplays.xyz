# How to run

```
yarn
cp .env.local.example .env.local
yarn dev
```

# 🎲 adaplays.xyz

Place to play staked games with moves verified by blockchain.

## Use case of password

Under [commit-reveal pattern](https://en.wikipedia.org/wiki/Commitment_scheme), some games require the generation of random numbers (& multiple moves might require multiple of these). It would be inconvenient for the end user to memorize / note them down.

Mechanism is proposed where user just needs to set up a session password and random numbers generated would be effectively encrypted (via [symmetric key encryption](https://en.wikipedia.org/wiki/Symmetric-key_algorithm)) with it and stored on blockchain. Being stored on blockchain itself, it also bypasses need for any conventional database. To reveal, one would simply decrypt it effectively with the same password.

Also in case their is a powercut or any xyz reason for which a game couldn't be completed, one can simply login with the same password and have previous games restored.

### How to do it?

We use user's password to generate 256 bit key using [PBKDF2](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) algorithm. See our choice of parameters [here](#pbkdf2-parameters).

This key is then used in [AES-GCM](https://en.wikipedia.org/wiki/Galois/Counter_Mode)[^aes-gcm] algorithm to encrypt/decrypt secret numbers. Consideration was given to use [ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) due to its [time complexity](https://en.wikipedia.org/wiki/ChaCha20-Poly1305) but it seemingly doesn't have support in [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API).

### PBKDF2 parameters

- Salt (Initialization vector, IV) in PBKDF2 is not intended to be secret, but should be as unique as possible (not to be reused)[^nist-pbkdf2][^web-crypto-pbkdf2][^crypto-pbkdf2][^pbkdf2-stack]. All parameters mentioned here (except, of course, the actual password) are not meant to be secret. Minimum recommendation by [NIST](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf) for size of salt is 16 bytes, I have considered 24.
- Number of iterations was taken to be $2048,000 + r$ where $r$ is a random integer such that $0 \le r \lt 200,000$. This choice was motivated from [here](https://crypto.stackexchange.com/a/3498).
- Digest algorithm is taken to be SHA512. This choice was motivated from [A](https://security.stackexchange.com/a/18006), [B](https://security.stackexchange.com/a/27971) and [C](https://support.1password.com/cs/opvault-overview/).
- Key size is taken to be 32 bytes (256 bits) to match with symmetric encryption algorithm.

# License

[MIT](./LICENSE).

[^aes-gcm]: For description of its parameters, see [here](https://developer.mozilla.org/en-US/docs/Web/API/AesGcmParams).
[^nist-pbkdf2]: https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-132.pdf
[^web-crypto-pbkdf2]: https://developer.mozilla.org/en-US/docs/Web/API/Pbkdf2Params
[^crypto-pbkdf2]: https://nodejs.org/api/crypto.html#cryptopbkdf2syncpassword-salt-iterations-keylen-digest
[^pbkdf2-stack]: https://crypto.stackexchange.com/a/3487
