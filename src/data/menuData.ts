import type { Category, Product, Benefit, EstablishmentInfo } from '../types/menu';

export const CATEGORIES: Category[] = [
  {
    id: 'shakes',
    name: 'Shakes Proteicos',
    subtitle: 'Energia limpa e nutrição para o seu dia',
    note: 'Proteína: whey protein. Opção de proteína vegetal disponível.'
  },
  {
    id: 'refreshers',
    name: 'Refreshers',
    subtitle: 'Bebidas botânicas leves, geladas e revitalizantes',
    note: 'Leve, refrescante e feito com ingredientes naturais.'
  },
  {
    id: 'salgados',
    name: 'Salgados',
    subtitle: 'Opções quentinhas e saborosas assadas na hora',
  },
  {
    id: 'doces',
    name: 'Doces',
    subtitle: 'Sobremesas artesanais para adoçar o seu momento',
    note: 'Feito com carinho para adoçar seu dia.'
  },
  {
    id: 'acai',
    name: 'Açaí',
    subtitle: 'Puro açaí da Amazônia com acompanhamentos selecionados',
    note: 'Self-service por KG'
  },
  {
    id: 'saladas',
    name: 'Saladas',
    subtitle: 'Combinações frescas e nutritivas preparadas diariamente',
    note: 'Self-service por KG'
  }
];

export const PRODUCTS: Product[] = [
  // SHAKES PROTEICOS
  {
    id: 'girassol',
    categoryId: 'shakes',
    name: 'Girassol',
    description: 'Bebida cremosa e tropical com perfil nutritivo e refrescante.',
    ingredients: ['Maracujá', 'Manga', 'Proteína de baunilha', 'Água de coco', 'Gelo'],
    price: 'R$ 26,90',
    image: 'https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?auto=format&fit=crop&w=800&q=80',
    badge: 'Proteico'
  },
  {
    id: 'violeta',
    categoryId: 'shakes',
    name: 'Violeta',
    description: 'Combo potente de antioxidantes com sabor marcante de açaí e aveia.',
    ingredients: ['Açaí', 'Banana congelada', 'Proteína de baunilha', 'Leite de aveia', 'Gelo'],
    price: 'R$ 27,90',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    badge: 'Mais Pedido'
  },
  {
    id: 'tulipa',
    categoryId: 'shakes',
    name: 'Tulipa',
    description: 'Harmonia aveludada de morango com iogurte natural e toque suave de mel.',
    ingredients: ['Morango congelado', 'Iogurte natural', 'Proteína de baunilha', 'Mel', 'Gelo'],
    price: 'R$ 25,90',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80',
    badge: 'Proteico'
  },
  {
    id: 'lavanda',
    categoryId: 'shakes',
    name: 'Lavanda',
    description: 'Sabor marcante de blueberry com iogurte leve e textura cremosíssima.',
    ingredients: ['Blueberry', 'Banana congelada', 'Iogurte natural', 'Proteína de baunilha', 'Gelo'],
    price: 'R$ 28,90',
    image: 'https://images.unsplash.com/photo-1600718374662-0483d2b9da44?auto=format&fit=crop&w=800&q=80',
    badge: 'Proteico'
  },
  {
    id: 'lirio',
    categoryId: 'shakes',
    name: 'Lírio',
    description: 'Deliciosa combinação de banana com pasta de amendoim e canela aromática.',
    ingredients: ['Banana congelada', 'Pasta de amendoim integral', 'Proteína de baunilha', 'Canela', 'Gelo'],
    price: 'R$ 26,90',
    image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
    badge: 'Proteico'
  },

  // REFRESHERS
  {
    id: 'camelia',
    categoryId: 'refreshers',
    name: 'Camélia',
    description: 'Super refrescante, unindo o azedinho da limonada com o doce natural do morango.',
    ingredients: ['Morango', 'Limonada artesanal', 'Gelo'],
    price: 'R$ 19,90',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    badge: 'Natural'
  },
  {
    id: 'margarida',
    categoryId: 'refreshers',
    name: 'Margarida',
    description: 'Mistura revitalizante de maracujá e manga hidratada com pura água de coco.',
    ingredients: ['Maracujá', 'Manga', 'Água de coco', 'Gelo'],
    price: 'R$ 20,90',
    image: 'https://images.unsplash.com/photo-1546171753-97d7676e4602?auto=format&fit=crop&w=800&q=80',
    badge: 'Natural'
  },
  {
    id: 'hibisco',
    categoryId: 'refreshers',
    name: 'Hibisco',
    description: 'A bebida assinatura da casa. Infusão de hibisco com frutas vermelhas e toque borbulhante.',
    ingredients: ['Hibisco', 'Frutas vermelhas', 'Água com gás', 'Gelo'],
    price: 'R$ 21,90',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    badge: 'Mais Pedido'
  },

  // SALGADOS
  {
    id: 'croissant',
    categoryId: 'salgados',
    name: 'Croissant',
    description: 'Massa folhada francesa bem amanteigada e crocante. Consulte as opções de recheio no balcão.',
    ingredients: ['Consulte opções de recheio disponíveis hoje'],
    price: 'R$ 14,90',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'waffle-misto',
    categoryId: 'salgados',
    name: 'Waffle Misto',
    description: 'Waffle de massa leve feito na hora com recheio derretido de presunto e queijo artesanal.',
    ingredients: ['Massa leve', 'Presunto', 'Queijo derretido'],
    price: 'R$ 18,90',
    image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'quiche-dia',
    categoryId: 'salgados',
    name: 'Quiche do Dia',
    description: 'Massa podre artesanal com recheio cremoso e assado no ponto certo.',
    ingredients: ['Consulte o sabor especial do dia no balcão'],
    price: 'R$ 16,90',
    image: 'https://images.unsplash.com/photo-1621236378699-8597faf6a176?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'empada',
    categoryId: 'salgados',
    name: 'Empada',
    description: 'Empadinha dourada que desmancha na boca com recheios caseiros.',
    ingredients: ['Consulte os sabores disponíveis no dia'],
    price: 'R$ 12,90',
    image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=800&q=80'
  },

  // DOCES
  {
    id: 'torta-dia',
    categoryId: 'doces',
    name: 'Torta do Dia',
    description: 'Fatia generosa de torta artesanal preparada pelos nossos confeiteiros.',
    ingredients: ['Consulte as fatias disponíveis na vitrine'],
    price: 'R$ 17,90',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cookie',
    categoryId: 'doces',
    name: 'Cookie',
    description: 'Cookie estilo americano com casquinha crocante e centro macio e recheado.',
    ingredients: ['Consulte as opções de chocolate e castanhas'],
    price: 'R$ 11,90',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'waffle-nutella',
    categoryId: 'doces',
    name: 'Waffle com Nutella',
    description: 'Waffle quentinho recém-saído da chapa, coberto com bastante Nutella cremosa.',
    ingredients: ['Waffle artesanal', 'Nutella de avelã'],
    price: 'R$ 19,90',
    image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=800&q=80',
    badge: 'Mais Pedido'
  },

  // AÇAÍ
  {
    id: 'acai-kg',
    categoryId: 'acai',
    name: 'Açaí Self-Service por KG',
    description: 'Monte do seu jeito! Açaí puro e cremoso com dezenas de toppings frescos e crocantes.',
    ingredients: ['Frutas frescas', 'Granolas artesanais', 'Leite em pó', 'Cremes', 'Mel', 'Paçoca'],
    price: 'R$ 79,90 / kg',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=800&q=80',
    note: 'Monte do seu jeito. Sabores e acompanhamentos disponíveis no balcão.'
  },

  // SALADAS
  {
    id: 'saladas-kg',
    categoryId: 'saladas',
    name: 'Salada Self-Service por KG',
    description: 'Monte sua combinação leve e nutritiva com folhas, proteínas e molhos da casa.',
    ingredients: ['Mix de folhas', 'Grãos', 'Queijos', 'Vegetais grelhados', 'Proteínas', 'Molhos artesanais'],
    price: 'R$ 69,90 / kg',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    note: 'Monte sua combinação com os ingredientes disponíveis no dia.'
  }
];

export const BENEFITS: Benefit[] = [
  {
    id: '1',
    title: 'Ingredientes de Verdade',
    subtitle: 'Mais sabor, mais saúde, mais Aflora.',
    icon: 'Leaf'
  },
  {
    id: '2',
    title: 'Feito com Propósito',
    subtitle: 'Nutre o corpo, acolhe a mente e floresce todos os dias.',
    icon: 'Heart'
  },
  {
    id: '3',
    title: 'Preparado na Hora',
    subtitle: 'Tudo preparado com cuidado especial para você.',
    icon: 'Sparkles'
  },
  {
    id: '4',
    title: 'Leve e Natural',
    subtitle: 'Sem corantes, sem açúcar refinado e sem leite animal.',
    icon: 'Sun'
  }
];

export const ESTABLISHMENT: EstablishmentInfo = {
  name: 'AFLORA',
  slogan: 'Mais que sabor, um estilo de vida.',
  address: 'Rua Principal, 123 - Centro',
  neighborhood: 'Bairro Jardim',
  city: 'Sua Cidade - UF',
  hoursWeekdays: 'Segunda a Sexta: 08:00 às 20:00',
  hoursWeekend: 'Sábado e Domingo: 09:00 às 18:00',
  instagram: '@aflora.cafe',
  whatsapp: '(00) 99999-8888',
  wifi: 'AFLORA_WIFI',
  counterNotice: 'Escolha seus favoritos e faça o pedido diretamente no balcão.'
};
