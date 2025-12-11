
const fs = require('fs');
const crypto = require('crypto');
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "derinmercanlove";
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  if (req.method !== 'POST') return res.json({message:'Only POST'});
  let body = '';
  req.on('data', c=> body+=c);
  req.on('end', () => {
    try {
      const obj = JSON.parse(body);
      if (!obj.password) return res.json({message:'No password'});
      if (obj.password === ADMIN_PASS) {
        const token = crypto.randomBytes(18).toString('hex');
        const tokensPath = __dirname + '/data/tokens.json';
        const tokens = JSON.parse(fs.readFileSync(tokensPath));
        tokens.push(token);
        fs.writeFileSync(tokensPath, JSON.stringify(tokens,null,2));
        res.json({token});
      } else {
        res.json({message:'Wrong password'});
      }
    } catch(e) {
      res.json({error:String(e)});
    }
  });
};
