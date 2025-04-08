
export const getCategoryColor = (category: string) => {
  switch(category) {
    case "Ambiente": return "bg-soft-green text-green-700";
    case "Comida & Bebida": return "bg-soft-peach text-orange-700";
    case "Música": return "bg-soft-purple text-purple-700";
    case "Compras": return "bg-soft-blue text-blue-700";
    case "Cultural": return "bg-soft-yellow text-yellow-700";
    case "Desporto": return "bg-red-100 text-red-700";
    case "Tecnologia": return "bg-gray-100 text-gray-700";
    default: return "bg-soft-gray text-gray-700";
  }
};
