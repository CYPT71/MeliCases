const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');

const root=__dirname,port=Number(process.env.PORT)||4173;
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.svg':'image/svg+xml','.woff2':'font/woff2','.webm':'video/webm'};
const server=http.createServer((request,response)=>{
  const pathname=decodeURIComponent(new URL(request.url,'http://localhost').pathname),relative=pathname==='/'?'index.html':pathname.replace(/^\/+/,''),file=path.resolve(root,relative);
  if(file!==root&&!file.startsWith(`${root}${path.sep}`)){response.writeHead(403);response.end('Forbidden');return}
  fs.stat(file,(error,stat)=>{
    const target=!error&&stat.isDirectory()?path.join(file,'index.html'):file;
    fs.readFile(target,(readError,data)=>{
      if(readError){response.writeHead(readError.code==='ENOENT'?404:500);response.end('Not found');return}
      response.writeHead(200,{'Content-Type':mime[path.extname(target)]||'application/octet-stream','Cache-Control':'no-store','Cross-Origin-Resource-Policy':'same-origin'});response.end(data);
    });
  });
});
server.listen(port,'127.0.0.1',()=>console.log(`MeliCases test server: http://127.0.0.1:${port}`));
