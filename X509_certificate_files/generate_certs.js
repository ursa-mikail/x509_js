    document.getElementById("m").value = "Hello";
    var crlDistributionPoint = 'http://ursa.com/';
            
    function padWithZeros(str, length) {
        if (typeof str !== 'string') {
            str = String(str); // Convert to string if not already
        }
        while (str.length < length) {
            str = '0' + str; // Pad with zeros
        }
        return str;
    }

    function convertToLinuxTimeFormat(dateTimeString) {
        const [year, month, part_later] = dateTimeString.split('-');
        const [day, time, second] = part_later.split('_');
        console.log("time: ", time);
        const hour = time.substring(0, 2);
        const minute = time.substring(2, 4);

        // Check if both parts are defined
        //if (!datePart || !timePart) {
        //    throw new Error('Invalid dateTimeString format. Expected format: YYYY-MM-DD_HHmm-ss');
        //}

        // Log the components for debugging
        console.log("Parsed components:");
        console.log("Year:", year, "Month:", month, "Day:", day);
        console.log("Hour:", hour, "Minute:", minute);

        // Ensure all components are defined
        if (!year || !month || !day || !hour || !minute) {
            throw new Error('Invalid date or time components. Please check the input.');
        }

        const yy = year.slice(-2); // Last two digits of the year
        const mm = padWithZeros(month, 2);
        const dd = padWithZeros(day, 2);
        const hh = padWithZeros(hour, 2);
        const mi = padWithZeros(minute, 2);
        const ss = padWithZeros(second, 2); // "00"; // Set second to "00" or remove if you want seconds optional

        return `${yy}${mm}${dd}${hh}${mi}${ss}Z`;
    }


    function convertFromLinuxTimeFormat(linuxTimeString) {
        // Ensure the input string has the correct length and format
        const trimmedString = linuxTimeString.slice(0, 12) + 'Z';
        
        // Ensure the input string is in the correct format
        const match = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(trimmedString);
        if (!match) {
            throw new Error('Invalid Linux time format. Expected format: YYMMDDHHMMSSZ');
        }

        // Extract components
        const [yy, mm, dd, hh, mi, ss] = match.slice(1);

        // Convert year to four digits
        const currentYear = new Date().getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        const yyyy = century + parseInt(yy);

        // Format to YYYY-MM-DD_HHmm_ss
        return `${yyyy}-${mm}-${dd}_${hh}${mi}_${ss}`;
    }

    function gorsa(size) {
        var kp = KEYUTIL.generateKeypair("RSA", size);
        var priv = KEYUTIL.getPEM(kp.prvKeyObj, "PKCS8PRV");

        var privhex = pemtohex(priv);
        var privasn1 = ASN1HEX.dump(pemtohex(priv));

        document.getElementById("privatekey").innerHTML = priv;
        document.getElementById("privatekey").innerHTML += "\n\nHex:\n" + privhex;
        document.getElementById("privatekey").innerHTML += "\n\nASN1:\n" + privasn1;

        pub = KEYUTIL.getPEM(kp.pubKeyObj, "PKCS8PUB");
        var pubhex = pemtohex(pub);
        var pubasn1 = ASN1HEX.dump(pemtohex(pub));

        document.getElementById("publickey").innerHTML = pub;
        document.getElementById("publickey").innerHTML += "\n\nHex:\n" + pubhex;
        document.getElementById("publickey").innerHTML += "\n\nASN1:\n" + pubasn1;

        var notBefore_time = convertToLinuxTimeFormat('2023-10-14_1215_30'); // 2023-10-14 12:15:30, e.g. "151231235959Z"
        var notAfter_time = convertToLinuxTimeFormat('2025-10-14_1215_30'); // 2025-10-14 12:15:30, e.g. "251231235959Z"

        //console.log('Not Before:', notBefore_time); // Outputs: Not Before: 231014121530Z
        //console.log('Not After:', notAfter_time);   // Outputs: Not After: 251014121530Z

        var x = new KJUR.asn1.x509.Certificate({
            version: 3,
            serial: { int: 4 },
            issuer: { str: "/CN=ursa" },
            notbefore: notBefore_time,
            notafter: notAfter_time,
            subject: { str: "/CN=Web server" },
            sbjpubkey: kp.pubKeyObj,
            ext: [
                { extname: "basicConstraints", cA: false },
                { extname: "keyUsage", critical: true, names: ["digitalSignature"] },
                {
                    extname: "cRLDistributionPoints",
                    array: [{ fulluri: crlDistributionPoint }]
                }
            ],
            sigalg: "SHA256withRSA",
            cakey: kp.prvKeyObj
        });

        document.getElementById("X509").innerHTML = "RSA Signed Certificate [SHA256withRSA]: (" + size + " bits)\n" + x.getPEM();
        var certasn1 = ASN1HEX.dump(pemtohex(x.getPEM()));
        document.getElementById("X509").innerHTML += "\nASN.1:\n" + certasn1;

    }

    function goecc(name) {
        var kp = KEYUTIL.generateKeypair("EC", name);
        var priv = KEYUTIL.getPEM(kp.prvKeyObj, "PKCS8PRV");

        var privhex = pemtohex(priv);
        var privasn1 = ASN1HEX.dump(pemtohex(priv));

        document.getElementById("privatekey").innerHTML = priv;
        document.getElementById("privatekey").innerHTML += "\n\nHex:\n" + privhex;
        document.getElementById("privatekey").innerHTML += "\n\nASN1:\n" + privasn1;

        pub = KEYUTIL.getPEM(kp.pubKeyObj, "PKCS8PUB");
        var pubhex = pemtohex(pub);
        var pubasn1 = ASN1HEX.dump(pemtohex(pub));

        document.getElementById("publickey").innerHTML = pub;
        document.getElementById("publickey").innerHTML += "\n\nHex:\n" + pubhex;
        document.getElementById("publickey").innerHTML += "\n\nASN1:\n" + pubasn1;

        var notBefore_time = convertToLinuxTimeFormat('2023-10-14_1215_30'); // 2023-10-14 12:15:30, e.g. "151231235959Z"
        var notAfter_time = convertToLinuxTimeFormat('2025-10-14_1215_30'); // 2025-10-14 12:15:30, e.g. "251231235959Z"

        var x = new KJUR.asn1.x509.Certificate({
            version: 3,
            serial: { int: 4 },
            issuer: { str: "/CN=ursa.org" },
            notbefore: notBefore_time,
            notafter: notAfter_time,
            subject: { str: "/CN=Web server" },
            sbjpubkey: kp.pubKeyObj,
            ext: [
                { extname: "basicConstraints", cA: false },
                { extname: "keyUsage", critical: true, names: ["digitalSignature"] },
                {
                    extname: "cRLDistributionPoints",
                    array: [{ fulluri: crlDistributionPoint }]
                }
            ],
            sigalg: "SHA256withECDSA",
            cakey: kp.prvKeyObj
        });

        document.getElementById("X509").innerHTML = "ECC Certificate [SHA256withECDSA]: (" + name + ")\n" + x.getPEM();
        var certasn1 = ASN1HEX.dump(pemtohex(x.getPEM()));
        document.getElementById("X509").innerHTML += "\nASN.1:\n" + certasn1;
    }
