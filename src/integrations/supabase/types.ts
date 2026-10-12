export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.17"
  }
  public: {
    Tables: {
      page_views: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          device: string | null
          id: string
          locale: string | null
          path: string
          referrer: string | null
          region: string | null
          session_id: string | null
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          id?: string
          locale?: string | null
          path: string
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          id?: string
          locale?: string | null
          path?: string
          referrer?: string | null
          region?: string | null
          session_id?: string | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      partner_access_codes: {
        Row: {
          code_hash: string
          created_at: string
          disabled_at: string | null
          email: string
          expires_at: string
          id: string
          partner_id: string
          used_at: string | null
          used_by: string | null
        }
        Insert: {
          code_hash: string
          created_at?: string
          disabled_at?: string | null
          email: string
          expires_at: string
          id?: string
          partner_id: string
          used_at?: string | null
          used_by?: string | null
        }
        Update: {
          code_hash?: string
          created_at?: string
          disabled_at?: string | null
          email?: string
          expires_at?: string
          id?: string
          partner_id?: string
          used_at?: string | null
          used_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_access_codes_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_applications: {
        Row: {
          contact_email: string
          contact_name: string
          country: string
          created_at: string
          description: string | null
          id: string
          locale: string
          organisation_name: string
          review_note: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["partner_application_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          contact_email: string
          contact_name: string
          country: string
          created_at?: string
          description?: string | null
          id?: string
          locale?: string
          organisation_name: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["partner_application_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          contact_email?: string
          contact_name?: string
          country?: string
          created_at?: string
          description?: string | null
          id?: string
          locale?: string
          organisation_name?: string
          review_note?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["partner_application_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      partner_events: {
        Row: {
          created_at: string
          event_type: Database["public"]["Enums"]["partner_event_type"]
          id: string
          locale: string | null
          partner_id: string
          path: string | null
          referral_code_id: string | null
          session_id: string | null
          visitor_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: Database["public"]["Enums"]["partner_event_type"]
          id?: string
          locale?: string | null
          partner_id: string
          path?: string | null
          referral_code_id?: string | null
          session_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: Database["public"]["Enums"]["partner_event_type"]
          id?: string
          locale?: string | null
          partner_id?: string
          path?: string | null
          referral_code_id?: string | null
          session_id?: string | null
          visitor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_events_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_events_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "partner_referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_redemptions: {
        Row: {
          created_at: string
          id: string
          partner_id: string
          referral_code_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          partner_id: string
          referral_code_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          partner_id?: string
          referral_code_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_redemptions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_redemptions_referral_code_id_fkey"
            columns: ["referral_code_id"]
            isOneToOne: false
            referencedRelation: "partner_referral_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_referral_codes: {
        Row: {
          active: boolean
          code: string
          created_at: string
          discount_percent: number
          id: string
          partner_id: string
          redemption_count: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          discount_percent?: number
          id?: string
          partner_id: string
          redemption_count?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          discount_percent?: number
          id?: string
          partner_id?: string
          redemption_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_referral_codes_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_users: {
        Row: {
          created_at: string
          id: string
          partner_id: string
          role: Database["public"]["Enums"]["partner_user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          partner_id: string
          role?: Database["public"]["Enums"]["partner_user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          partner_id?: string
          role?: Database["public"]["Enums"]["partner_user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_users_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partners: {
        Row: {
          application_id: string | null
          contact_email: string
          contact_name: string
          country: string
          created_at: string
          id: string
          logo_url: string | null
          organisation_name: string
          slug: string
          status: Database["public"]["Enums"]["partner_status"]
          updated_at: string
          website: string | null
        }
        Insert: {
          application_id?: string | null
          contact_email: string
          contact_name: string
          country: string
          created_at?: string
          id?: string
          logo_url?: string | null
          organisation_name: string
          slug: string
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          website?: string | null
        }
        Update: {
          application_id?: string | null
          contact_email?: string
          contact_name?: string
          country?: string
          created_at?: string
          id?: string
          logo_url?: string | null
          organisation_name?: string
          slug?: string
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partners_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: true
            referencedRelation: "partner_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      poi_corridor_cache: {
        Row: {
          cache_key: string
          categories: string[]
          created_at: string
          expires_at: string
          id: string
          payload: Json
          source: string
          updated_at: string
        }
        Insert: {
          cache_key: string
          categories?: string[]
          created_at?: string
          expires_at: string
          id?: string
          payload?: Json
          source?: string
          updated_at?: string
        }
        Update: {
          cache_key?: string
          categories?: string[]
          created_at?: string
          expires_at?: string
          id?: string
          payload?: Json
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      price_snapshots: {
        Row: {
          created_at: string
          fetched_at: string
          payload: Json
          snapshot_key: string
          source: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          fetched_at?: string
          payload?: Json
          snapshot_key: string
          source?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          fetched_at?: string
          payload?: Json
          snapshot_key?: string
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      product_events: {
        Row: {
          city: string | null
          country: string | null
          created_at: string
          device: string | null
          event_name: string
          id: string
          locale: string | null
          metadata: Json
          path: string | null
          region: string | null
          session_id: string | null
          user_id: string | null
          visitor_id: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          event_name: string
          id?: string
          locale?: string | null
          metadata?: Json
          path?: string | null
          region?: string | null
          session_id?: string | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string
          device?: string | null
          event_name?: string
          id?: string
          locale?: string | null
          metadata?: Json
          path?: string | null
          region?: string | null
          session_id?: string | null
          user_id?: string | null
          visitor_id?: string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          created_at: string | null
          creem_customer_id: string | null
          creem_subscription_id: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          price_id: string
          product_id: string
          provider: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          creem_customer_id?: string | null
          creem_subscription_id?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id: string
          product_id: string
          provider?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cancel_at_period_end?: boolean | null
          created_at?: string | null
          creem_customer_id?: string | null
          creem_subscription_id?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          price_id?: string
          product_id?: string
          provider?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_partner_access: { Args: { _code_hash: string }; Returns: string }
      activate_partner_access_for_user: {
        Args: { _code_hash: string; _email: string; _user_id: string }
        Returns: string
      }
      has_active_subscription: {
        Args: { check_env?: string; user_uuid: string }
        Returns: boolean
      }
      has_partner_access: { Args: { _partner_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
      redeem_partner_referral: {
        Args: { _code: string }
        Returns: {
          discount_percent: number
          partner_id: string
        }[]
      }
      redeem_partner_referral_for_user: {
        Args: { _code: string; _user_id: string }
        Returns: {
          discount_percent: number
          partner_id: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      partner_application_status: "pending" | "approved" | "rejected"
      partner_event_type: "link_click" | "signup" | "conversion"
      partner_status: "active" | "suspended"
      partner_user_role: "owner" | "manager"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      partner_application_status: ["pending", "approved", "rejected"],
      partner_event_type: ["link_click", "signup", "conversion"],
      partner_status: ["active", "suspended"],
      partner_user_role: ["owner", "manager"],
    },
  },
} as const
