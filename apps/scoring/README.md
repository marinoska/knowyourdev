https://www.section.io/engineering-education/how-to-get-ssl-https-for-localhost/

````
cd ./cert
1. openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
2. openssl rsa -in keytmp.pem -out key.pem
3. const credentials = {
  key: key,
  cert: cert,
};

OR
1. openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
2. const credentials = {
  key: key,
  cert: cert,
  passphrase: 'your-password-here' // Replace with the actual passphrase
};

````

The best solution

```aiignore
🛠 Using mkcert (Recommended, Easier)
If you installed mkcert, just run:

mkcert -key-file key.pem -cert-file cert.pem localhost

This automatically generates a valid certificate for localhost.


```

$$ mongoose-encryption
Generate secret: `openssl rand -base64 32`
