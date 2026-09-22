import type { AcaiBatch, Combo, CostEntry, CustomerTab, Material, MaterialCategory, Product, Sale, StoreData } from '../types/controle';

export type UserRole = 'developer' | 'admin' | 'employee';
export interface SessionUser { username: string; role: UserRole }
export const emptyStore: StoreData = { products: [], combos: [], sales: [], tabs: [], batches: [], costs: [], materialCategories: [], materials: [] };

async function request<T>(path:string, options?:RequestInit):Promise<T>{
  let response:Response;
  try{response=await fetch(path,{...options,credentials:'same-origin',headers:{'Content-Type':'application/json',...(options?.headers||{})}})}
  catch{throw new Error('Serviço temporariamente indisponível. Tente novamente em instantes.')}
  const text=response.status===204?'':await response.text();
  let body:Record<string,unknown>={};
  try{body=text?JSON.parse(text):{}}catch{/* O proxy pode responder texto ou HTML. */}
  if(!response.ok){const detail=typeof body.message==='string'?body.message:'';const fallback=response.status>=500?'O servidor não conseguiu processar a solicitação.':'Não foi possível concluir a operação.';throw new Error(`${detail||fallback} (HTTP ${response.status})`);}
  return response.status===204?undefined as T:body as T;
}
export const getSession=()=>request<{user:SessionUser}>('/api/auth/session');
export const login=(username:string,password:string)=>request<{user?:SessionUser;setupRequired?:boolean;username?:string}>('/api/auth/login',{method:'POST',body:JSON.stringify({username,password})});
export const completeFirstAccess=(password:string)=>request<{user:SessionUser}>('/api/auth/set-password',{method:'POST',body:JSON.stringify({password})});
export const logout=()=>request<void>('/api/auth/logout',{method:'POST'});
const normalizeStore=(data:Partial<StoreData>|null|undefined):StoreData=>({
  products:Array.isArray(data?.products)?data.products:[],
  combos:Array.isArray(data?.combos)?data.combos:[],
  sales:Array.isArray(data?.sales)?data.sales:[],
  tabs:Array.isArray(data?.tabs)?data.tabs:[],
  batches:Array.isArray(data?.batches)?data.batches:[],
  costs:Array.isArray(data?.costs)?data.costs:[],
  materialCategories:Array.isArray(data?.materialCategories)?data.materialCategories:[],
  materials:Array.isArray(data?.materials)?data.materials:[],
});
export const loadStore=async()=>normalizeStore(await request<Partial<StoreData>>('/api/store'));
export const createSale=(sale:Sale)=>request('/api/sales',{method:'POST',body:JSON.stringify(sale)});
export const updateSale=(id:string,payment:Sale['payment'],createdAt?:string,total?:number)=>request<void>(`/api/sales/${id}`,{method:'PATCH',body:JSON.stringify({payment,...(createdAt?{createdAt}:{}),...(total!==undefined?{total}:{})})});
export const deleteSale=(id:string)=>request<void>(`/api/sales/${id}`,{method:'DELETE'});
export const createTab=(tab:CustomerTab)=>request('/api/tabs',{method:'POST',body:JSON.stringify(tab)});
export const addTabItems=(id:string,items:CustomerTab['items'])=>request<void>(`/api/tabs/${id}/items`,{method:'POST',body:JSON.stringify({items})});
export const closeTab=(id:string,payment:Sale['payment'],discount:number)=>request<{sale:Sale}>(`/api/tabs/${id}/close`,{method:'POST',body:JSON.stringify({payment,discount})});
export const deleteTab=(id:string)=>request<void>(`/api/tabs/${id}`,{method:'DELETE'});
export const createProduct=(product:Product)=>request('/api/products',{method:'POST',body:JSON.stringify(product)});
export const updateProduct=(product:Product)=>request<void>(`/api/products/${product.id}`,{method:'PUT',body:JSON.stringify(product)});
export const deleteProduct=(id:string)=>request<void>(`/api/products/${id}`,{method:'DELETE'});
export const createCombo=(combo:Combo)=>request('/api/combos',{method:'POST',body:JSON.stringify(combo)});
export const updateCombo=(combo:Combo)=>request<void>(`/api/combos/${combo.id}`,{method:'PUT',body:JSON.stringify(combo)});
export const deleteCombo=(id:string)=>request<void>(`/api/combos/${id}`,{method:'DELETE'});
export const createMaterialCategory=(category:MaterialCategory)=>request('/api/material-categories',{method:'POST',body:JSON.stringify(category)});
export const deleteMaterialCategory=(id:string)=>request<void>(`/api/material-categories/${id}`,{method:'DELETE'});
export const createMaterial=(material:Material)=>request('/api/materials',{method:'POST',body:JSON.stringify(material)});
export const updateMaterial=(material:Material)=>request<void>(`/api/materials/${material.id}`,{method:'PUT',body:JSON.stringify(material)});
export const deleteMaterial=(id:string)=>request<void>(`/api/materials/${id}`,{method:'DELETE'});
export const adjustStock=(id:string,delta:number)=>request(`/api/materials/${id}/stock`,{method:'PATCH',body:JSON.stringify({delta})});
export const addMaterialStock=(id:string,quantity:number,asPortions:boolean,materialName:string)=>request<{stock:number}>(`/api/materials/${id}/stock`,{method:'PATCH',body:JSON.stringify({quantity,mode:asPortions?'portions':'units',name:materialName})});
export const createBatch=(batch:AcaiBatch)=>request('/api/batches',{method:'POST',body:JSON.stringify(batch)});
export const closeBatch=(id:string)=>request(`/api/batches/${id}/close`,{method:'PATCH'});
export const deleteBatch=(id:string)=>request<void>(`/api/batches/${id}`,{method:'DELETE'});
export const createCost=(cost:CostEntry)=>request<{costs:CostEntry[]}>('/api/costs',{method:'POST',body:JSON.stringify(cost)});
export const updateCost=(cost:CostEntry)=>request<void>(`/api/costs/${cost.id}`,{method:'PUT',body:JSON.stringify(cost)});
export const setCostPaid=(id:string,paid:boolean)=>request<void>(`/api/costs/${id}/paid`,{method:'PATCH',body:JSON.stringify({paid})});
export const deleteCost=(id:string)=>request<void>(`/api/costs/${id}`,{method:'DELETE'});
export const importCosts=(costs:CostEntry[])=>request<{count:number}>('/api/costs/import',{method:'POST',body:JSON.stringify({costs})});
export interface ManagedUser { id:string; username:string; role:UserRole; active:boolean; needsPassword:boolean; createdAt:string }
export const listUsers=()=>request<{users:ManagedUser[]}>('/api/users');
export const createUser=(username:string,role:'admin'|'employee')=>request<{user:ManagedUser}>('/api/users',{method:'POST',body:JSON.stringify({username,role})});
export const setUserActive=(id:string,active:boolean)=>request<void>(`/api/users/${id}/active`,{method:'PATCH',body:JSON.stringify({active})});
export const updateUser=(id:string,username:string,role:'admin'|'employee')=>request<void>(`/api/users/${id}`,{method:'PUT',body:JSON.stringify({username,role})});
export const deleteUser=(id:string)=>request<void>(`/api/users/${id}`,{method:'DELETE'});
export interface AuditLog { id:string;actor_username:string;action:'create'|'update'|'delete';entity_type:string;entity_id:string;details:Record<string,unknown>;created_at:string }
export const listAuditLogs=()=>request<{logs:AuditLog[]}>('/api/audit-logs');
