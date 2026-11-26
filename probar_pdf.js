const {buildPdf}=require('./guia');const fs=require('fs');
(async()=>{for(const lang of ['es','en']){const b=await buildPdf({name:'Ana',topics:[0,2,4],lang});fs.writeFileSync(`prueba_${lang}.pdf`,b);console.log(lang,b.length,'bytes')}})();
