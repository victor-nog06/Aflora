import fs from 'node:fs';
const file='src/components/controle/Controle.tsx';
let text=fs.readFileSync(file,'utf8');
const from=": view === 'Usuários'&&isAdmin ? <UsersManager currentUsername={user.username} notify={notify}/> : isAdmin?<Reports data={data}/>:null}";
const to=": view === 'Usuários'&&isAdmin ? <UsersManager currentUsername={user.username} notify={notify}/> : view === 'Auditoria'&&isAdmin ? <AuditLogs notify={notify}/> : isAdmin?<Reports data={data}/>:null}";
if(!text.includes(from))throw new Error('View anchor not found');
fs.writeFileSync(file,text.replace(from,to),'utf8');
