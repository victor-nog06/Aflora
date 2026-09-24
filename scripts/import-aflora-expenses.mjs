import 'dotenv/config';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { readSheet } from 'read-excel-file/node';

const projectFile='C:/Users/nogue/Downloads/Despesas_Projeto_Aflora.xlsx';
const installmentsFile='C:/Users/nogue/Downloads/Controle_Gastos_Parcelados_Loja.xlsx';
const apply=process.argv.includes('--apply');
const db=createClient(process.env.SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const id=(source,row,part=1)=>`imp-${createHash('sha1').update(`${source}:${row}:${part}`).digest('hex').slice(0,24)}`;
const date=value=>value instanceof Date?value.toISOString().slice(0,10):(/^\d{4}-\d{2}-\d{2}/.exec(String(value||''))?.[0]||'');
const addMonths=(value,months)=>{const [year,month,day]=value.split('-').map(Number),target=new Date(Date.UTC(year,month-1+months,1)),last=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();return `${target.getUTCFullYear()}-${String(target.getUTCMonth()+1).padStart(2,'0')}-${String(Math.min(day,last)).padStart(2,'0')}`};
const category=(value,type='')=>{const text=norm(`${value} ${type}`);if(text.includes('estoque')||text.includes('insumo'))return'Estoque';if(text.includes('mao de obra'))return'Mão de obra';if(text.includes('marketing')||text.includes('comunicacao'))return'Marketing';if(text.includes('taxa')||text.includes('documentacao')||text.includes('imposto'))return'Impostos';if(text.includes('aluguel'))return'Aluguel';if(text.includes('energia'))return'Energia';if(/reforma|obra|equipamento|moveis|mobiliario|decoracao|construcao/.test(text))return'Construção';return'Outros'};
const rowBase=(key,description,categoryName,amount,costDate,paymentDate,payee,notes,part=1,total=1,group=null)=>{const destination=String(payee||'').trim();return{id:id(key.split(':')[0],Number(key.split(':')[1]),part),description:String(description).trim(),category:categoryName,amount:Math.round(Number(amount)*100)/100,cost_date:costDate,payment_date:paymentDate,paid_by:destination.length>=2?destination:'Não informado',recurring:false,paid:false,paid_at:null,notes,installment_number:part,installments_total:total,installment_group_id:group}};

const project=await readSheet(projectFile,'Lançamento de Gastos');
const projectRows=[];
for(let index=1;index<project.length;index++){
  const row=project[index],amount=Number(row[9]),costDate=date(row[0]);
  if(!row[4]||!Number.isFinite(amount)||amount<=0||!costDate)continue;
  const pendingCard=norm(row[10])==='cartao de credito'&&norm(row[11])==='pendente';
  if(pendingCard)continue;
  const paid=norm(row[11])==='pago',paidDate=date(row[13]),dueDate=date(row[12]);
  const entry=rowBase(`project:${index+1}`,row[4],category(row[2],row[1]),amount,costDate,(paid&&paidDate)||dueDate||costDate,row[5],`Importado de Despesas_Projeto_Aflora.xlsx, linha ${index+1}. ${row[15]||''}`.trim());
  entry.paid=paid;entry.paid_at=paid?`${paidDate||costDate}T12:00:00Z`:null;projectRows.push(entry);
}

const installments=await readSheet(installmentsFile,'Parcelas');
const installmentRows=[];
for(let index=1;index<installments.length;index++){
  const row=installments[index],total=Number(row[4]),costDate=date(row[0]),firstDue=date(row[7]);
  if(!row[1]||!Number.isFinite(total)||total<=0||!costDate||!firstDue)continue;
  const numericParts=Number(row[5]),parts=Number.isFinite(numericParts)&&numericParts>0?Math.floor(numericParts):1,paidParts=Math.max(0,Number(row[8])||0),sheetPart=Number(row[6]),base=Number.isFinite(sheetPart)?sheetPart:total/parts,group=parts>1?id('parcel-group',index+1):null;
  for(let part=1;part<=parts;part++){
    const amount=part===parts?total-base*(parts-1):base,due=addMonths(firstDue,part-1);
    const entry=rowBase(`parcel:${index+1}`,row[1],category(row[2]),amount,costDate,due,row[3],`Importado de Controle_Gastos_Parcelados_Loja.xlsx, linha ${index+1}.`,part,parts,group);
    entry.paid=part<=paidParts;entry.paid_at=entry.paid?`${due}T12:00:00Z`:null;installmentRows.push(entry);
  }
}

const rows=[...projectRows,...installmentRows];
const summary={projectExpenses:projectRows.length,installmentPayments:installmentRows.length,totalRecords:rows.length,totalAmount:Math.round(rows.reduce((sum,row)=>sum+row.amount,0)*100)/100,apply};
if(apply){
  const {error}=await db.from('costs').upsert(rows,{onConflict:'id'});
  if(error)throw error;
  const {count,error:countError}=await db.from('costs').select('id',{count:'exact',head:true});
  if(countError)throw countError;
  summary.databaseCount=count;
}
console.log(JSON.stringify(summary,null,2));
