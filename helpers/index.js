const fs = require("fs");

const read = (filePath) => {
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
};

module.exports = read;
