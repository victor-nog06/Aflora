export type CategoryId = 
  | 'shakes' 
  | 'refreshers' 
  | 'salgados' 
  | 'doces' 
  | 'acai' 
  | 'saladas';

export interface Category {
  id: CategoryId;
  name: string;
  subtitle?: string;
  note?: string;
}

export interface Product {
  id: string;
  categoryId: CategoryId;
  name: string;
  description: string;
  ingredients?: string[];
  price?: string;
  image: string;
  badge?: 'Proteico' | 'Vegano' | 'Mais Pedido' | 'Natural' | 'Sem Açúcar';
  note?: string;
}

export interface Benefit {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
}

export interface EstablishmentInfo {
  name: string;
  slogan: string;
  address: string;
  neighborhood: string;
  city: string;
  hoursWeekdays: string;
  hoursWeekend: string;
  instagram: string;
  whatsapp: string;
  wifi: string;
  counterNotice: string;
}
