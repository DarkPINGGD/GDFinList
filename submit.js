
const fs = require('fs');
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  if (req.method !== 'POST') return res.json({message:'Only POST'});
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const obj = JSON.parse(body);
      const pendingPath = __dirname + '/data/pending.json';
      const pending = JSON.parse(fs.readFileSync(pendingPath));
      pending.push(obj);
      fs.writeFileSync(pendingPath, JSON.stringify(pending,null,2));
      res.json({message:'Submitted for review'});
    } catch (e) {
      res.json({error: String(e)});
    }
  });
};
