export type Unit = 'un' | 'kg' | 'L';

export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  unit: Unit;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  active: boolean;
  recipe?: RecipeItem[];
}

export interface MaterialCategory { id:string; name:string }
export interface Material { id:string;name:string;categoryId:string;unit:'un'|'g'|'ml'|'kg'|'L';stock:number;minStock:number;cost:number;active:boolean;portionEnabled:boolean;portionQuantity:number }
export interface RecipeItem { materialId:string;quantity:number }

export interface SaleItem {
  productId?: string;
  name: string;
  quantity: number;
  unitPrice: number;
  kind: 'product' | 'acai';
}

export interface Sale {
  id: string;
  createdAt: string;
  items: SaleItem[];
  total: number;
  payment: 'Pix' | 'Dinheiro' | 'Cartão';
}

export interface AcaiBatch {
  id: string;
  kind: 'acai' | 'sorvete';
  flavor: string;
  liters: number;
  openedAt: string;
  endedAt?: string;
  cost: number;
  status: 'open' | 'closed';
}

export type CostCategory = 'Estoque' | 'Mão de obra' | 'Construção' | 'Aluguel' | 'Energia' | 'Marketing' | 'Impostos' | 'Outros';
export interface CostEntry { id:string; description:string; category:CostCategory; amount:number; date:string; paymentDate:string; recurring:boolean; paid:boolean; paidAt?:string; notes?:string; installmentNumber?:number; installmentsTotal?:number; installmentGroupId?:string; installments?:number }

export interface StoreData {
  products: Product[];
  sales: Sale[];
  batches: AcaiBatch[];
  costs: CostEntry[];
  materialCategories: MaterialCategory[];
  materials: Material[];
}
