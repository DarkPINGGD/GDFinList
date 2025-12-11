
const fs = require('fs');
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  if (req.method !== 'POST') return res.json({message:'Only POST'});
  const auth = req.headers.authorization || '';
  const tokens = JSON.parse(fs.readFileSync(__dirname + '/data/tokens.json'));
  if (!tokens.includes(auth)) return res.json({message:'unauthorized'});
  let body='';
  req.on('data', c=> body+=c);
  req.on('end', () => {
    try {
      const obj = JSON.parse(body);
      const pendingPath = __dirname + '/data/pending.json';
      const pending = JSON.parse(fs.readFileSync(pendingPath));
      const index = Number(obj.index);
      if (isNaN(index) || index<0 || index>=pending.length) return res.json({message:'invalid index'});
      const record = pending.splice(index,1)[0];
      fs.writeFileSync(pendingPath, JSON.stringify(pending,null,2));
      res.json({message:'rejected',record});
    } catch(e) {
      res.json({error:String(e)});
    }
  });
};
