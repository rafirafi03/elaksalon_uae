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
  sort_order?: number;
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
  category_id?: string | null;
  sort_order?: number;
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
  sort_order?: number;
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
  social_links: string[];
  google_reviews_url: string;
  updated_at?: string;
};

export type OfferRow = {
  id: string;
  title: string;
  description: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  starts_at: string;
  ends_at: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type OfferProductRow = { offer_id: string; product_id: string };
export type OfferServiceRow = { offer_id: string; service_id: string };

export type ReviewRow = {
  id: string;
  name: string;
  role: string;
  rating: number;
  comment: string;
  image_url: string;
  is_published: boolean;
  sort_order: number;
  created_at?: string;
  updated_at?: string;
};

export type PackageRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  image_url: string;
  details: string[];
  is_published: boolean;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

export type PackageServiceRow = { package_id: string; service_id: string; position: number };

export type ServiceCategoryRow = {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

type Tables = {
  service_categories: {
    Row: ServiceCategoryRow;
    Insert: Omit<ServiceCategoryRow, "id" | "created_at" | "updated_at"> & { id?: string; updated_at?: string };
    Update: Partial<ServiceCategoryRow>;
    Relationships: [];
  };
  packages: {
    Row: PackageRow;
    Insert: Omit<PackageRow, "id" | "created_at" | "updated_at"> & { id?: string; updated_at?: string };
    Update: Partial<PackageRow>;
    Relationships: [];
  };
  package_services: {
    Row: PackageServiceRow;
    Insert: PackageServiceRow;
    Update: Partial<PackageServiceRow>;
    Relationships: [
      { foreignKeyName: "package_services_package_id_fkey"; columns: ["package_id"]; isOneToOne: false; referencedRelation: "packages"; referencedColumns: ["id"] },
      { foreignKeyName: "package_services_service_id_fkey"; columns: ["service_id"]; isOneToOne: false; referencedRelation: "services"; referencedColumns: ["id"] },
    ];
  };
  reviews: {
    Row: ReviewRow;
    Insert: Omit<ReviewRow, "id" | "created_at" | "updated_at" | "sort_order"> & {
      id?: string;
      sort_order?: number;
      updated_at?: string;
    };
    Update: Partial<ReviewRow>;
    Relationships: [];
  };
  offers: {
    Row: OfferRow;
    Insert: Omit<OfferRow, "id" | "created_at" | "updated_at" | "is_active"> & {
      id?: string;
      is_active?: boolean;
      updated_at?: string;
    };
    Update: Partial<OfferRow>;
    Relationships: [];
  };
  offer_products: {
    Row: OfferProductRow;
    Insert: OfferProductRow;
    Update: Partial<OfferProductRow>;
    Relationships: [
      { foreignKeyName: "offer_products_offer_id_fkey"; columns: ["offer_id"]; isOneToOne: false; referencedRelation: "offers"; referencedColumns: ["id"] },
      { foreignKeyName: "offer_products_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
    ];
  };
  offer_services: {
    Row: OfferServiceRow;
    Insert: OfferServiceRow;
    Update: Partial<OfferServiceRow>;
    Relationships: [
      { foreignKeyName: "offer_services_offer_id_fkey"; columns: ["offer_id"]; isOneToOne: false; referencedRelation: "offers"; referencedColumns: ["id"] },
      { foreignKeyName: "offer_services_service_id_fkey"; columns: ["service_id"]; isOneToOne: false; referencedRelation: "services"; referencedColumns: ["id"] },
    ];
  };
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
    Relationships: [
      { foreignKeyName: "services_category_id_fkey"; columns: ["category_id"]; isOneToOne: false; referencedRelation: "service_categories"; referencedColumns: ["id"] },
    ];
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
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      set_sort_order: { Args: { p_table: string; p_ids: string[] }; Returns: undefined };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
