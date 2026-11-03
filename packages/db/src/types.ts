export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  price: string;
  image_url: string;
  category: string;
  description: string;
  details: string[];
  created_at?: string;
  updated_at?: string;
};

export type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string;
  category: string;
  duration: string;
  price_from: string;
  details: string[];
  created_at?: string;
  updated_at?: string;
};

export type SpecialistRow = {
  id: string;
  slug: string;
  name: string;
  role: string;
  specialty: string;
  experience: string;
  image_url: string;
  bio: string;
  skills: string[];
  created_at?: string;
  updated_at?: string;
};

export type CompanySettingsRow = {
  id: number;
  company_name: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp_number: string;
  address: string;
  city: string;
  country: string;
  map_embed_url: string;
  map_link_url: string;
  opening_hours: string;
  updated_at?: string;
};

type Tables = {
  company_settings: {
    Row: CompanySettingsRow;
    Insert: Partial<CompanySettingsRow> & { id?: number };
    Update: Partial<CompanySettingsRow>;
    Relationships: [];
  };
  products: {
    Row: ProductRow;
    Insert: Omit<ProductRow, "id" | "created_at" | "updated_at"> & {
      id?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: Partial<ProductRow>;
    Relationships: [];
  };
  services: {
    Row: ServiceRow;
    Insert: Omit<ServiceRow, "id" | "created_at" | "updated_at"> & {
      id?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: Partial<ServiceRow>;
    Relationships: [];
  };
  specialists: {
    Row: SpecialistRow;
    Insert: Omit<SpecialistRow, "id" | "created_at" | "updated_at"> & {
      id?: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: Partial<SpecialistRow>;
    Relationships: [];
  };
};

/** Replace with `supabase gen types` output when the project is linked. */
export type Database = {
  public: {
    Tables: Tables;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
