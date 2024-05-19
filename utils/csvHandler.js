const csvParser = require("csv-parser");

exports.parseCSV = () => {
  return csvParser({
    mapHeaders: ({ header }) => header.trim(),
    mapValues: ({ value }) => value.trim(),
  });
};
