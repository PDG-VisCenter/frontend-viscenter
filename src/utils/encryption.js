import Cryptr from 'cryptr';

export function encrypt(text) {
  const secretKey = 'fx1y6jA8WtYw25qxAYZKYaW75JUCanAnzPLWTY+1D20';
  const cryptr = new Cryptr(secretKey);

  const encryptedString = cryptr.encrypt(text);
  return encryptedString;
}

export function decrypt(encryptedString) {
  const secretKey = 'fx1y6jA8WtYw25qxAYZKYaW75JUCanAnzPLWTY+1D20';
  const cryptr = new Cryptr(secretKey);

  const text = cryptr.decrypt(encryptedString);
  return text;
}
