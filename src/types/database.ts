export type VideoProvider = "cloudflare" | "youtube";

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

export type Video = {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  duration_seconds: number | null;
  category: string | null;
  provider: VideoProvider;
  video_id: string;
  is_locked: boolean;
  position: number;
  created_at: string;
};

type ProfileInsert = Partial<Profile> & { id: string };
type ProfileUpdate = Partial<Profile>;
type VideoInsert = Partial<Video> & { title: string; provider: VideoProvider; video_id: string };
type VideoUpdate = Partial<Video>;

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: [];
      };
      videos: {
        Row: Video;
        Insert: VideoInsert;
        Update: VideoUpdate;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
