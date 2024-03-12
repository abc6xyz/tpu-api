import CryptoJS from 'crypto-js';

// Encrypt function
export function apiKeyGen(text: string): string {
    return CryptoJS.AES.encrypt(text, process.env.SECRET_KEY as string).toString();
}

// Decrypt function
export function decryptApiKey(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.SECRET_KEY as string);
    return bytes.toString(CryptoJS.enc.Utf8);
}
