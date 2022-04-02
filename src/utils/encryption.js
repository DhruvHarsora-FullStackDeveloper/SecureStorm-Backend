import cryptoJS from "crypto-js";
import fs from "fs";
import path from "path";

// provide binary file path here
const binaryPath = path.resolve("./binaries");

export const encryptFile = async (filePath, key) => {
  const fileName = path.basename(filePath);
  const dataFile = fs.readFileSync(`${filePath}`);
  const dataBase64 = dataFile.toString("base64");
  const encryptFile = cryptoJS.AES.encrypt(dataBase64, key);
  const buffer = new Buffer(encryptFile.toString(), "base64");
  fs.writeFileSync(path.join(binaryPath, `${fileName}.enc`), buffer);
};
