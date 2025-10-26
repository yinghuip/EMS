export interface Location {
  name: string;
  address: string;
  lat?: number;
  lng?: number;
}

export interface Speaker {
  name: string;
  bio: string;
  avatar_url?: string;
}

export interface EventModel {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  location: Location;
  hero_image_url: string;
  gallery?: string[];
  speakers: Speaker[];
  tags: string[];
  published_at: string;
  is_featured: boolean;
}
