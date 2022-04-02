import cryptoJS from "crypto-js";
import fs from "fs";
import path from "path";

// provide binary file path and decoded file path here
const binaryPath = path.resolve("./binaries");
const decodePath = path.resolve("./decoded");

export const encryptFile = async (filePath, key) => {
  const fileName = path.basename(filePath);
  const dataFile = fs.readFileSync(`${filePath}`);
  const dataBase64 = dataFile.toString("base64");
  const encryptFile = cryptoJS.AES.encrypt(dataBase64, key);
  const buffer = new Buffer.from(encryptFile.toString(), "base64");
  fs.writeFileSync(path.join(binaryPath, `${fileName}.enc`), buffer);
};

export const decryptFile = async (filePath, key) => {
  const dataFile = fs.readFileSync(filePath);
  const fileName = path.basename(filePath);
  const decodedFileName = path.parse(fileName).name;
  const decryptFile = CryptoJS.AES.decrypt(dataFile.toString("base64"), key);
  const result = decryptFile.toString(CryptoJS.enc.Utf8);
  const buffer = new Buffer.from(result, "base64");
  fs.writeFileSync(path.join(decodePath, `${decodedFileName}`), buffer);
};
