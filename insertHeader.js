const fs = require("fs");

const sourceFilePath = "D:\\Lab\\seminar\\Selenium2\\customHeader.js";
const destinationFilePath =
  "D:\\Lab\\seminar\\Selenium2\\reports\\mochawesome\\assets\\app.js";

const sourceFileContent = fs.readFileSync(sourceFilePath, "utf8");

let destinationFileContent = fs.readFileSync(destinationFilePath, "utf8");

destinationFileContent += `\n\n${sourceFileContent}`;

fs.writeFileSync(destinationFilePath, destinationFileContent);
