import { useState } from 'react';
import StaticMap from '@/components/StaticMap';

const MapPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold tracking-tight bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Mapa de Faro</h1>
        <p className="text-muted-foreground">Visualize o mapa da cidade de Faro e região.</p>
      </div>
      
      <div className="h-[600px] rounded-lg overflow-hidden border border-gray-200">
        <StaticMap />
      </div>
    </div>
  );
};

export default MapPage;