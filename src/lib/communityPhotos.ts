// Lista de fotos del Mural Comunitario (Solo fotos reales de distintivos en vehículos, celulares, laptops)
// Para agregar una nueva foto:
// 1. Coloca el archivo de imagen en la carpeta /public
// 2. Agrega la ruta aquí abajo, por ejemplo: '/mi_foto.jpg'

export interface CommunityPhoto {
  id: string;
  url: string;
  alt?: string;
}

export const COMMUNITY_PHOTOS: CommunityPhoto[] = [
  {
    id: 'coche-1',
    url: '/campechano_soy_coche.jpg',
    alt: 'Distintivo oficial en vehículo'
  }
];
