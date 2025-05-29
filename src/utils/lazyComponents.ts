import { lazy } from 'react';

// Lazy loading das páginas principais
export const Dashboard = lazy(() => import('../pages/Dashboard'));
export const News = lazy(() => import('../pages/News'));
export const Events = lazy(() => import('../pages/Events'));
export const Forum = lazy(() => import('../pages/Forum'));
export const Associacoes = lazy(() => import('../pages/Associacoes'));
export const Community = lazy(() => import('../pages/Community'));
export const Marketplace = lazy(() => import('../pages/Marketplace'));
export const Volunteer = lazy(() => import('../pages/Volunteer'));
export const Chatbot = lazy(() => import('../pages/Chatbot'));
export const MapPage = lazy(() => import('../pages/Map'));
export const Profile = lazy(() => import('../pages/Profile'));
export const Games = lazy(() => import('../pages/Games'));
export const NotFound = lazy(() => import('../pages/NotFound'));

// Lazy loading de componentes pesados
export const LeafletMap = lazy(() => import('../components/LeafletMap'));
export const AssociacoesMap = lazy(() => import('../components/AssociacoesMap'));