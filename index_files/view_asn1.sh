# Step 1: Get the certificate in PEM format
site_url='example.com'
echo | openssl s_client -servername "$site_url" -connect "$site_url":443 2>/dev/null | openssl x509 -outform PEM -out cert.pem

# Step 2: Convert the PEM certificate to DER format
openssl x509 -in cert.pem -outform der -out cert.der

# Step 3: Parse the DER certificate for ASN.1 structure
openssl asn1parse -in cert.der -inform der -i

rm -rf cert.der cert.pem