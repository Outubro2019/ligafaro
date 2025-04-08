
export interface MarketplaceItem {
  id: number;
  title: string;
  description: string;
  price: number;
  location: string;
  seller: string;
  postedDate: string;
  imageUrl: string;
  category: string;
  condition: 'Novo' | 'Como novo' | 'Bom' | 'Usado' | 'Para peças';
}

export const marketplaceItems: MarketplaceItem[] = [
  {
    id: 1,
    title: "Bicicleta de Montanha",
    description: "Bicicleta de montanha em excelente estado. Pouco uso, sempre guardada em garagem. Ideal para trilhos em Faro e arredores.",
    price: 250,
    location: "Baixa de Faro",
    seller: "Miguel Santos",
    postedDate: "2025-03-20",
    imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=2070",
    category: "Desporto",
    condition: "Como novo"
  },
  {
    id: 2,
    title: "Sofá de 3 lugares",
    description: "Sofá confortável em tecido cinzento, comprado há 2 anos na IKEA. Vendo por mudança para casa mais pequena.",
    price: 180,
    location: "Montenegro, Faro",
    seller: "Ana Costa",
    postedDate: "2025-03-22",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2070",
    category: "Mobília",
    condition: "Bom"
  },
  {
    id: 3,
    title: "iPhone 11 Pro 64GB",
    description: "iPhone 11 Pro em perfeito estado, sem riscos. Inclui carregador e capa original. Vendo por upgrade para modelo mais recente.",
    price: 400,
    location: "Centro de Faro",
    seller: "João Mendes",
    postedDate: "2025-03-25",
    imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1974",
    category: "Eletrónicos",
    condition: "Como novo"
  },
  {
    id: 4,
    title: "Mesa de Jantar Extensível",
    description: "Mesa extensível em madeira maciça para 6-8 pessoas. Vendo por mudança de casa.",
    price: 220,
    location: "Gambelas, Faro",
    seller: "Sofia Almeida",
    postedDate: "2025-03-27",
    imageUrl: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?q=80&w=2070",
    category: "Mobília",
    condition: "Bom"
  },
  {
    id: 5,
    title: "Prancha de Surf 6'2\"",
    description: "Prancha de surf em excelente estado, pouco uso. Ideal para as ondas da Praia de Faro.",
    price: 300,
    location: "Praia de Faro",
    seller: "Rui Ferreira",
    postedDate: "2025-03-29",
    imageUrl: "https://images.unsplash.com/photo-1531722569936-825d3dd91b15?q=80&w=2010",
    category: "Desporto",
    condition: "Como novo"
  },
  {
    id: 6,
    title: "Máquina de Café Automática",
    description: "Máquina de café Delonghi em bom estado, faço revisão e limpeza recentemente.",
    price: 150,
    location: "Bom João, Faro",
    seller: "Teresa Silva",
    postedDate: "2025-04-01",
    imageUrl: "https://images.unsplash.com/photo-1525088572658-d886ea31abb6?q=80&w=2071",
    category: "Electrodomésticos",
    condition: "Bom"
  }
];
