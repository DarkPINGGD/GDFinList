
const fs = require('fs');
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  const tokens = JSON.parse(fs.readFileSync(__dirname + '/data/tokens.json'));
  const auth = req.headers.authorization || '';
  if (!tokens.includes(auth)) return res.json({message:'unauthorized'});
  const pending = JSON.parse(fs.readFileSync(__dirname + '/data/pending.json'));
  res.json({pending});
};
