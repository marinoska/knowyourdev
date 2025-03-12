https://www.section.io/engineering-education/how-to-get-ssl-https-for-localhost/

````
cd ./cert
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
````

$$ mongoose-encryption
Generate secret: `openssl rand -base64 32`
