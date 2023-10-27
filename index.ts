
import * as crypto from "crypto-js";

export function verifySignature(psk: string, sigHeader: string, payload: string, ttl: number): boolean {
    try {
        const header = parseHeader(sigHeader, ttl);
        const expectedSig = generateExpectedSignature(header, psk, payload);

        return !!header.signatures.find((val) => val == expectedSig);
    } catch (error) {
        console.error(error);
        return false;
    }
}

class SignedHeader {
    timestamp: number;
    signatures: string[];

    constructor(ts = 0, sigs = []) {
        this.timestamp = ts;
        this.signatures = sigs;
    }
}

function parseHeader(sigHeader: string, ttl: number): SignedHeader {
    var pairs: string[] = sigHeader.split(',');
    var sh = decode(pairs, ttl);
    if (sh.signatures.length == 0) {
        throw "Invalid Signature";
    }

    return sh;
}

function decode(pairs: string[], ttl: number): SignedHeader {
    const sh = new SignedHeader();
    for (const p of pairs) {
        var parts = p.split('=');

        if (parts.length != 2) {
            throw "Invalid Header";
        }

        const [item, value] = parts;

        if (item == "t") {
            var timestamp = parseInt(value, 10);
            if (timestamp == undefined || isNaN(timestamp)) {
                throw "Invalid Header";
            }
            sh.timestamp = timestamp;
        }

        if (item[0] == "v") {
            sh.signatures.push(value);
        }
    }

    if ((Date.now() / 1000) > (sh.timestamp + ttl)) {
        throw "Timestamp Expired";
    }

    return sh;
}

function generateExpectedSignature(sh: SignedHeader, psk: string, payload: string) {
    const sig = sh.timestamp.toLocaleString().split(',').join('') + "," + payload;
    return crypto.enc.Hex.stringify(crypto.HmacSHA256(sig, crypto.enc.Hex.parse(psk)));
}