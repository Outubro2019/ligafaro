
export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: string;
  avatarUrl?: string;
  datePosted: string;
  likes: number;
  comments: number;
  category: string;
}

export const forumPosts: ForumPost[] = [
  {
    id: 1,
    title: "Melhores restaurantes de peixe fresco em Faro?",
    content: "Olá a todos! Sou novo na cidade e estou à procura de recomendações para restaurantes que sirvam bom peixe fresco na zona de Faro. Agradeço todas as sugestões!",
    author: "Miguel Oliveira",
    avatarUrl: "https://i.pravatar.cc/150?img=11",
    datePosted: "2025-03-28",
    likes: 24,
    comments: 15,
    category: "Gastronomia"
  },
  {
    id: 2,
    title: "Alguém interessado num grupo para caminhadas?",
    content: "Estou a pensar em criar um grupo para caminhadas semanais pela Ria Formosa e arredores de Faro. Seria aos domingos de manhã. Quem estaria interessado em participar?",
    author: "Ana Sofia",
    avatarUrl: "https://i.pravatar.cc/150?img=5",
    datePosted: "2025-03-25",
    likes: 42,
    comments: 28,
    category: "Atividades"
  },
  {
    id: 3,
    title: "Procuro professor de português para estrangeiros",
    content: "Acabei de me mudar do Reino Unido para Faro e gostaria de melhorar o meu português. Alguém conhece um bom professor particular que dê aulas em Faro?",
    author: "John Smith",
    avatarUrl: "https://i.pravatar.cc/150?img=7",
    datePosted: "2025-03-22",
    likes: 8,
    comments: 12,
    category: "Educação"
  },
  {
    id: 4,
    title: "Mudanças nos horários dos autocarros urbanos",
    content: "Reparei que os horários dos autocarros urbanos de Faro mudaram esta semana. Alguém sabe onde posso encontrar os novos horários atualizados online?",
    author: "Teresa Vieira",
    avatarUrl: "https://i.pravatar.cc/150?img=9",
    datePosted: "2025-03-19",
    likes: 16,
    comments: 7,
    category: "Transportes"
  }
];
