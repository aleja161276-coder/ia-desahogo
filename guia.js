// Genera el PDF corto y personalizado. Contenido: SOLO consejos parafraseados de guías de la OMS (ver contenido_guia.json).
const PDFDocument=require('pdfkit');const path=require('path');const fs=require('fs');
const C=JSON.parse(fs.readFileSync(path.join(__dirname,'contenido_guia.json'),'utf8'));
const TOPIC_KEYS=['stress','hook','lonely','sad','values'];
const OSC='#284D54',VIV='#48C0C7',CLA='#86E2E5',MEN='#D0F0EE',CRE='#ECE4D5';
function buildPdf({name,topics=[],lang='es'}){
  const c=C[lang]||C.es;
  return new Promise((resolve,reject)=>{
    const doc=new PDFDocument({size:'A4',margin:51,bufferPages:true});const bufs=[];
    doc.on('data',b=>bufs.push(b));doc.on('end',()=>resolve(Buffer.concat(bufs)));doc.on('error',reject);
    const W=doc.page.width,M=51;
    doc.rect(0,0,W,165).fill(OSC);doc.rect(0,165,W,7).fill(VIV);
    try{doc.image(path.join(__dirname,'avatar-hero.jpg'),W-M-115,14,{height:142})}catch(e){}
    doc.fillColor(CRE).font('Helvetica-Bold').fontSize(11).text('IA DE DESAHOGO · NEURO CIAN',M,40);
    doc.fillColor('#fff').fontSize(24).text(c.helloFmt.replace('{name}',String(name).slice(0,40)),M,62,{width:W-2*M-130});
    doc.fillColor(CLA).font('Helvetica').fontSize(13).text(c.title,M,doc.y+4);
    doc.fillColor(OSC).fontSize(11).text(c.intro,M,195,{width:W-2*M});doc.moveDown();
    const keys=['base',...topics.map(i=>TOPIC_KEYS[i]).filter(Boolean)];
    for(const k of keys){const s=c.sections[k];if(!s)continue;
      if(doc.y>700)doc.addPage();
      doc.moveDown(.6);const y=doc.y;doc.roundedRect(M,y-3,W-2*M,22,5).fill(MEN);
      doc.fillColor(OSC).font('Helvetica-Bold').fontSize(12).text(s.t,M+8,y+2);doc.moveDown(.8);
      doc.font('Helvetica').fontSize(10.5);
      for(const it of s.items){if(doc.y>740)doc.addPage();doc.fillColor(OSC).text('•  '+it,M+6,doc.y,{width:W-2*M-12});doc.moveDown(.3)}
    }
    doc.moveDown();if(doc.y>690)doc.addPage();
    const y=doc.y,h=Math.max(80,c.help.join(' ').length/1.7);doc.roundedRect(M,y,W-2*M,h,8).fill(OSC);
    doc.fillColor(CLA).font('Helvetica-Bold').fontSize(12).text(c.helpT,M+12,y+10);
    doc.fillColor(CRE).font('Helvetica').fontSize(10).text(c.help.join('\n'),M+12,y+28,{width:W-2*M-24});
    doc.y=y+h+10;doc.fillColor(OSC).fontSize(10).text(c.note,M,doc.y,{width:W-2*M});
    const n=doc.bufferedPageRange().count;
    for(let i=0;i<n;i++){doc.switchToPage(i);doc.fillColor('#3E6D71').fontSize(7).text(c.src,M,doc.page.height-62,{width:W-2*M,lineBreak:true});
      doc.text(`${c.page} ${i+1}/${n}`,M,doc.page.height-22,{width:W-2*M,align:'right'})}
    doc.end();
  });
}
module.exports={buildPdf};
