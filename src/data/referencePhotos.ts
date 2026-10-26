export interface ReferencePhoto {
  id: string;
  title: string;
  subtitle: string;
  category: 'hardware' | 'semiconductor' | 'isolation' | 'containment' | 'thermal';
  description: string;
  imageUrl: string;
  externalLink?: string;
  dateAdded: string;
  source: string;
  specifications?: Record<string, string>;
}

export const INITIAL_REFERENCE_PHOTOS: ReferencePhoto[] = [];
