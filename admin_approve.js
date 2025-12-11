
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
      const playersPath = __dirname + '/data/players.json';
      const pending = JSON.parse(fs.readFileSync(pendingPath));
      const players = JSON.parse(fs.readFileSync(playersPath));
      const index = Number(obj.index);
      if (isNaN(index) || index<0 || index>=pending.length) return res.json({message:'invalid index'});
      const record = pending.splice(index,1)[0];
      // simple points: give 150 for 100%, else 50
      const points = record.percent === 100 ? 150 : 50;
      let p = players.find(x=> x.name===record.player);
      if (!p) { p = {name: record.player, nationality: '??', points}; players.push(p); }
      else p.points = (p.points || 0) + points;
      fs.writeFileSync(playersPath, JSON.stringify(players,null,2));
      fs.writeFileSync(pendingPath, JSON.stringify(pending,null,2));
      res.json({message:'approved',record});
    } catch(e) {
      res.json({error:String(e)});
    }
  });
};
