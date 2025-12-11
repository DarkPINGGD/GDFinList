
const fs = require('fs');
module.exports = (req, res) => {
  const data = JSON.parse(fs.readFileSync(__dirname + '/data/levels.json'));
  res.setHeader('Access-Control-Allow-Origin','*');
  res.json(data);
};
