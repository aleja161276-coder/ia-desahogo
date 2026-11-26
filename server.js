// Proxy mínimo para que la IA de la web funcione para CUALQUIER visitante (la página la llama con CONFIG.AI_ENDPOINT).
// Tu clave NUNCA va en la página: queda aquí. Uso: ANTHROPIC_API_KEY=... ALLOW_ORIGIN=https://tu-sitio.com node server.js  (Node 20+)
// OJO: cada respuesta cuesta dinero (API de pago). El límite de abajo protege tu presupuesto.
const http=require('http');
const GKEY=process.env.GEMINI_API_KEY; // GRATIS: clave de https://aistudio.google.com/apikey (cuota gratuita con límites)
const KEY=process.env.ANTHROPIC_API_KEY,ORIGIN=process.env.ALLOW_ORIGIN||'*',MODEL=process.env.MODEL||'claude-haiku-5-5';
const MAX_PER_HOUR=+process.env.MAX_PER_HOUR||60,hits=new Map();
http.createServer((req,res)=>{
  const H={'Access-Control-Allow-Origin':ORIGIN,'Access-Control-Allow-Headers':'Content-Type','Content-Type':'application/json'};
  if(req.method==='OPTIONS'){res.writeHead(204,H);return res.end()}
  if(req.method!=='POST'){res.writeHead(404,H);return res.end('{}')}
  const ip=req.socket.remoteAddress,n=Date.now(),a=(hits.get(ip)||[]).filter(t=>n-t<3600e3);a.push(n);hits.set(ip,a);
  if(a.length>MAX_PER_HOUR){res.writeHead(429,H);return res.end('{"error":"rate"}')}
  let d='';req.on('data',c=>{d+=c;if(d.length>30000)req.destroy()});
  req.on('end',async()=>{try{
    const {prompt}=JSON.parse(d);if(typeof prompt!=='string'||!prompt)throw 0;
    if(GKEY){ // proveedor gratuito (Gemini). Modelo configurable con MODEL.
      const gm=process.env.MODEL||'gemini-2.0-flash';
      const g=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${gm}:generateContent`,{method:'POST',headers:{'x-goog-api-key':GKEY,'content-type':'application/json'},body:JSON.stringify({contents:[{parts:[{text:prompt}]}],generationConfig:{maxOutputTokens:500}})});
      const gj=await g.json();if(!g.ok)throw 0;
      res.writeHead(200,H);return res.end(JSON.stringify({text:((gj.candidates&&gj.candidates[0]&&gj.candidates[0].content.parts)||[]).map(c=>c.text||'').join('')}));
    }
    const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'x-api-key':KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},body:JSON.stringify({model:MODEL,max_tokens:500,messages:[{role:'user',content:prompt}]})});
    const j=await r.json();if(!r.ok)throw 0;
    res.writeHead(200,H);res.end(JSON.stringify({text:(j.content||[]).map(c=>c.text||'').join('')}));
  }catch(e){res.writeHead(500,H);res.end('{"error":"server"}')}});
}).listen(+process.env.PORT||8788,()=>console.log('Proxy IA listo'));
