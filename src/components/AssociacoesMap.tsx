import { useState } from 'react';
import StaticMap from './StaticMap';

interface AssociacoesMapProps {
  associacoes: any[];
}

const AssociacoesMap = ({ associacoes }: AssociacoesMapProps) => {
  const [loading] = useState(false);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Mapa das Associações</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
          <StaticMap />
        </div>
      )}
    </div>
  );
};

export default AssociacoesMap;