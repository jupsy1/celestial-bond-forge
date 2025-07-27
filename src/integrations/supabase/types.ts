export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      compatibility_reports: {
        Row: {
          advice: string | null
          challenges: string | null
          communication_style: string | null
          compatibility_score: number | null
          created_at: string
          friendship_compatibility: string | null
          id: string
          love_compatibility: string | null
          overall_summary: string
          partner_zodiac: string
          strengths: string | null
          user_id: string
          user_zodiac: string
        }
        Insert: {
          advice?: string | null
          challenges?: string | null
          communication_style?: string | null
          compatibility_score?: number | null
          created_at?: string
          friendship_compatibility?: string | null
          id?: string
          love_compatibility?: string | null
          overall_summary: string
          partner_zodiac: string
          strengths?: string | null
          user_id: string
          user_zodiac: string
        }
        Update: {
          advice?: string | null
          challenges?: string | null
          communication_style?: string | null
          compatibility_score?: number | null
          created_at?: string
          friendship_compatibility?: string | null
          id?: string
          love_compatibility?: string | null
          overall_summary?: string
          partner_zodiac?: string
          strengths?: string | null
          user_id?: string
          user_zodiac?: string
        }
        Relationships: []
      }
      horoscopes: {
        Row: {
          career_forecast: string | null
          content: string
          created_at: string
          date_for: string
          health_forecast: string | null
          horoscope_type: string
          id: string
          love_forecast: string | null
          lucky_colors: string[] | null
          lucky_numbers: number[] | null
          zodiac_sign: string
        }
        Insert: {
          career_forecast?: string | null
          content: string
          created_at?: string
          date_for: string
          health_forecast?: string | null
          horoscope_type: string
          id?: string
          love_forecast?: string | null
          lucky_colors?: string[] | null
          lucky_numbers?: number[] | null
          zodiac_sign: string
        }
        Update: {
          career_forecast?: string | null
          content?: string
          created_at?: string
          date_for?: string
          health_forecast?: string | null
          horoscope_type?: string
          id?: string
          love_forecast?: string | null
          lucky_colors?: string[] | null
          lucky_numbers?: number[] | null
          zodiac_sign?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
          zodiac_sign: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
          zodiac_sign?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
          zodiac_sign?: string | null
        }
        Relationships: []
      }
      readings: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          reading_type: string
          service_id: string
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          reading_type: string
          service_id: string
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          reading_type?: string
          service_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "readings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      reputation_audits: {
        Row: {
          audit_report: string | null
          business_name: string
          created_at: string | null
          email: string
          first_name: string
          id: string
          ip_address: unknown | null
          last_name: string
          phone_number: string | null
          reputation_challenges: string | null
          status: string | null
          website_url: string | null
        }
        Insert: {
          audit_report?: string | null
          business_name: string
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          ip_address?: unknown | null
          last_name: string
          phone_number?: string | null
          reputation_challenges?: string | null
          status?: string | null
          website_url?: string | null
        }
        Update: {
          audit_report?: string | null
          business_name?: string
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          ip_address?: unknown | null
          last_name?: string
          phone_number?: string | null
          reputation_challenges?: string | null
          status?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          price_credits: number | null
        }
        Insert: {
          category: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          price_credits?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          price_credits?: number | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          credits_balance: number | null
          daily_horoscope_enabled: boolean | null
          email_notifications: boolean | null
          favorite_services: string[] | null
          id: string
          preferred_reading_time: string | null
          push_notifications: boolean | null
          subscription_tier: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          credits_balance?: number | null
          daily_horoscope_enabled?: boolean | null
          email_notifications?: boolean | null
          favorite_services?: string[] | null
          id?: string
          preferred_reading_time?: string | null
          push_notifications?: boolean | null
          subscription_tier?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          credits_balance?: number | null
          daily_horoscope_enabled?: boolean | null
          email_notifications?: boolean | null
          favorite_services?: string[] | null
          id?: string
          preferred_reading_time?: string | null
          push_notifications?: boolean | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
