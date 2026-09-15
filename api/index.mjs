import app from '../server/index.mjs';

export default function handler(req,res){
  const url=new URL(req.url,'http://localhost');
  const path=url.searchParams.get('__path');
  if(path!==null){
    url.searchParams.delete('__path');
    const query=url.searchParams.toString();
    req.url=`/api/${path}${query?`?${query}`:''}`;
  }
  return app(req,res);
}
