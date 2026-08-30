import type { Category, Product, Benefit, EstablishmentInfo } from '../types/menu';

export const CATEGORIES: Category[] = [
  { id: 'smoothies', name: 'Smoothies', subtitle: 'Smoothies proteicos de 400 ml', note: 'Todos levam 20 g de proteína.' },
  { id: 'refresh', name: 'Refresh', subtitle: 'Bebidas refrescantes de 400 ml' },
  { id: 'crepes-salgados', name: 'Crepes Salgados', subtitle: 'Crepes preparados na hora' },
  { id: 'crepes-doces', name: 'Crepes Doces', subtitle: 'Crepes doces preparados na hora' },
  { id: 'tortas', name: 'Tortas', subtitle: 'Fatias de tortas artesanais' },
  { id: 'promocoes', name: 'Promoções', subtitle: 'Promoções de inauguração — sábado e domingo', note: 'Válidas durante sábado e domingo.' },
];

const img = {
  smoothie: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80',
  berries: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
  refresh: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  crepe: 'https://images.unsplash.com/photo-1519676867240-f03562e64548?auto=format&fit=crop&w=800&q=80',
  cake: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
  promo: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=80',
};

export const PRODUCTS: Product[] = [
  { id: 'margarida', categoryId: 'smoothies', name: 'Margarida', description: 'Morango, banana, iogurte natural, tâmara e 20 g de proteína.', ingredients: ['Morango', 'Banana', 'Iogurte natural', 'Tâmara', '20 g de proteína'], price: 'R$ 28,90', image: img.smoothie, badge: 'Proteico' },
  { id: 'girassol', categoryId: 'smoothies', name: 'Girassol', description: 'Maracujá, manga, banana, tâmara, água de coco e 20 g de proteína.', ingredients: ['Maracujá', 'Manga', 'Banana', 'Tâmara', 'Água de coco', '20 g de proteína'], price: 'R$ 29,90', image: img.smoothie, badge: 'Proteico' },
  { id: 'hibisco-smoothie', categoryId: 'smoothies', name: 'Hibisco', description: 'Pitaya, cupuaçu, banana, água de coco e 20 g de proteína.', ingredients: ['Pitaya', 'Cupuaçu', 'Banana', 'Água de coco', '20 g de proteína'], price: 'R$ 30,90', image: img.berries, badge: 'Proteico' },
  { id: 'lirio', categoryId: 'smoothies', name: 'Lírio', description: 'Pasta de amendoim, banana, iogurte natural, canela e 20 g de proteína.', ingredients: ['Pasta de amendoim', 'Banana', 'Iogurte natural', 'Canela', '20 g de proteína'], price: 'R$ 30,90', image: img.smoothie, badge: 'Proteico' },
  { id: 'orquidea', categoryId: 'smoothies', name: 'Orquídea', description: 'Amora, mirtilo, banana, iogurte natural e 20 g de proteína.', ingredients: ['Amora', 'Mirtilo', 'Banana', 'Iogurte natural', '20 g de proteína'], price: 'R$ 34,90', image: img.berries, badge: 'Proteico' },
  { id: 'hibisco-refresh', categoryId: 'refresh', name: 'Hibisco', description: 'Limão, Sprite, chá de hibisco e gelo.', ingredients: ['Limão', 'Sprite', 'Chá de hibisco', 'Gelo'], price: 'R$ 16,90', image: img.refresh },
  { id: 'maracuja-refresh', categoryId: 'refresh', name: 'Maracujá', description: 'Maracujá natural, limão, Sprite e gelo.', ingredients: ['Maracujá natural', 'Limão', 'Sprite', 'Gelo'], price: 'R$ 16,90', image: img.refresh },
  { id: 'bauru', categoryId: 'crepes-salgados', name: 'Bauru', description: 'Queijo e presunto.', ingredients: ['Queijo', 'Presunto'], price: 'R$ 22,90', image: img.crepe },
  { id: 'frango-catupiry', categoryId: 'crepes-salgados', name: 'Frango com Catupiry', description: 'Frango desfiado e Catupiry.', ingredients: ['Frango desfiado', 'Catupiry'], price: 'R$ 24,90', image: img.crepe },
  { id: 'calabresa-mussarela', categoryId: 'crepes-salgados', name: 'Calabresa com Mussarela', description: 'Calabresa e mussarela.', ingredients: ['Calabresa', 'Mussarela'], price: 'R$ 24,90', image: img.crepe },
  { id: 'carne-seca-catupiry', categoryId: 'crepes-salgados', name: 'Carne-Seca com Catupiry', description: 'Carne-seca desfiada e Catupiry.', ingredients: ['Carne-seca desfiada', 'Catupiry'], price: 'R$ 27,90', image: img.crepe },
  { id: 'brigadeiro', categoryId: 'crepes-doces', name: 'Brigadeiro', description: 'Crepe doce de brigadeiro.', price: 'R$ 21,90', image: img.crepe },
  { id: 'romeu-julieta', categoryId: 'crepes-doces', name: 'Romeu & Julieta', description: 'Queijo e goiabada.', ingredients: ['Queijo', 'Goiabada'], price: 'R$ 21,90', image: img.crepe },
  { id: 'torta-limao', categoryId: 'tortas', name: 'Torta de Limão', description: 'Fatia de torta de limão.', price: 'R$ 19,90', image: img.cake },
  { id: 'casadinho', categoryId: 'tortas', name: 'Casadinho', description: 'Fatia de torta casadinho.', price: 'R$ 24,90', image: img.cake },
  { id: 'morango-chocolate', categoryId: 'tortas', name: 'Morango com Chocolate', description: 'Fatia de torta de morango com chocolate.', price: 'R$ 24,90', image: img.cake },
  { id: 'combo-smoothies', categoryId: 'promocoes', name: '2 Smoothies', description: 'Escolha entre Margarida, Girassol, Hibisco ou Lírio.', price: 'R$ 49,90', image: img.promo, badge: 'Mais Pedido', note: 'Orquídea: adicional de R$ 5,00 por unidade.' },
  { id: 'combo-crepe-refresh', categoryId: 'promocoes', name: 'Combo Crepe + Refresh', description: 'Escolha um crepe salgado participante e um Refresh.', ingredients: ['Bauru + Refresh — R$ 34,90', 'Frango com Catupiry ou Calabresa com Mussarela + Refresh — R$ 36,90', 'Carne-Seca com Catupiry + Refresh — R$ 39,90'], image: img.promo },
  { id: 'funcional-desconto', categoryId: 'promocoes', name: 'Alunos do Funcional — 20% OFF', description: '20% de desconto nos smoothies individuais durante sábado e domingo.', image: img.promo, note: 'Não cumulativo com o combo de 2 smoothies.' },
];

export const BENEFITS: Benefit[] = [
  { id: '1', title: 'Ingredientes de Verdade', subtitle: 'Mais sabor, mais saúde, mais Aflora.', icon: 'Leaf' },
  { id: '2', title: 'Feito com Propósito', subtitle: 'Nutre o corpo, acolhe a mente e floresce todos os dias.', icon: 'Heart' },
  { id: '3', title: 'Preparado na Hora', subtitle: 'Tudo preparado com cuidado especial para você.', icon: 'Sparkles' },
  { id: '4', title: 'Leve e Natural', subtitle: 'Escolhas frescas e preparadas com carinho.', icon: 'Sun' },
];

export const ESTABLISHMENT: EstablishmentInfo = {
  name: 'AFLORA', slogan: 'Mais que sabor, um estilo de vida.', address: 'Rua Principal, 123 - Centro', neighborhood: 'Bairro Jardim', city: 'Sua Cidade - UF', hoursWeekdays: 'Segunda a Sexta: 08:00 às 20:00', hoursWeekend: 'Sábado e Domingo: 09:00 às 18:00', instagram: '@aflora.cafe', whatsapp: '(00) 99999-8888', wifi: 'AFLORA_WIFI', counterNotice: 'Escolha seus favoritos e faça o pedido diretamente no balcão.'
};
