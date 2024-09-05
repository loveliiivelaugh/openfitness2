export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chats: {
        Row: {
          created_at: string
          id: number
          messages: Json
          session_id: string
          session_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          messages?: Json
          session_id?: string
          session_name: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          messages?: Json
          session_id?: string
          session_name?: string
          user_id?: string
        }
        Relationships: []
      }
      cross_platform_apps: {
        Row: {
          appId: string | null
          created_at: string
          data: Json | null
          destination_app: string | null
          destination_url: string | null
          id: number
          name: string | null
          session_id: string | null
          source: string | null
          token: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          appId?: string | null
          created_at?: string
          data?: Json | null
          destination_app?: string | null
          destination_url?: string | null
          id?: number
          name?: string | null
          session_id?: string | null
          source?: string | null
          token?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          appId?: string | null
          created_at?: string
          data?: Json | null
          destination_app?: string | null
          destination_url?: string | null
          id?: number
          name?: string | null
          session_id?: string | null
          source?: string | null
          token?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string | null
          email: string
          id: number
          name: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: number
          name: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: number
          name?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      exercise: {
        Row: {
          calories_burned: number | null
          created_at: string
          date: string
          difficulty: string | null
          equipment: string | null
          id: number
          instructions: string | null
          muscle: string | null
          name: string
          reps: number
          sets: number
          time: string
          type: string | null
          user_id: string | null
          weight: number
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string
          date?: string
          difficulty?: string | null
          equipment?: string | null
          id?: number
          instructions?: string | null
          muscle?: string | null
          name: string
          reps?: number
          sets?: number
          time?: string
          type?: string | null
          user_id?: string | null
          weight?: number
        }
        Update: {
          calories_burned?: number | null
          created_at?: string
          date?: string
          difficulty?: string | null
          equipment?: string | null
          id?: number
          instructions?: string | null
          muscle?: string | null
          name?: string
          reps?: number
          sets?: number
          time?: string
          type?: string | null
          user_id?: string | null
          weight?: number
        }
        Relationships: []
      }
      food: {
        Row: {
          calories: number | null
          created_at: string
          date: string | null
          id: number
          meal: string | null
          name: string | null
          num_servings: number | null
          nutrients: Json | null
          serving_size: number | null
          time: string | null
          user_id: string | null
        }
        Insert: {
          calories?: number | null
          created_at?: string
          date?: string | null
          id?: number
          meal?: string | null
          name?: string | null
          num_servings?: number | null
          nutrients?: Json | null
          serving_size?: number | null
          time?: string | null
          user_id?: string | null
        }
        Update: {
          calories?: number | null
          created_at?: string
          date?: string | null
          id?: number
          meal?: string | null
          name?: string | null
          num_servings?: number | null
          nutrients?: Json | null
          serving_size?: number | null
          time?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      menu: {
        Row: {
          created_at: string | null
          id: number
          name: string
          price: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          price: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      models: {
        Row: {
          description: string | null
          id: number
          name: string | null
          notes: string | null
          value: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
          notes?: string | null
          value?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
          notes?: string | null
          value?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          cancelled: boolean | null
          cancelled_at: string | null
          cancelled_reason: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          customer_id: number | null
          employee_id: number | null
          id: number
          items: Json
          order_id: number
          table_number: number | null
          total: number | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          cancelled?: boolean | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: number | null
          employee_id?: number | null
          id?: number
          items: Json
          order_id?: number
          table_number?: number | null
          total?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          cancelled?: boolean | null
          cancelled_at?: string | null
          cancelled_reason?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: number | null
          employee_id?: number | null
          id?: number
          items?: Json
          order_id?: number
          table_number?: number | null
          total?: number | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          description: string | null
          id: number
          image: string
          image_name: string | null
          image_names: Json[] | null
          name: string
          price: number
          recipe: string
        }
        Insert: {
          category: string
          description?: string | null
          id?: number
          image: string
          image_name?: string | null
          image_names?: Json[] | null
          name: string
          price: number
          recipe: string
        }
        Update: {
          category?: string
          description?: string | null
          id?: number
          image?: string
          image_name?: string | null
          image_names?: Json[] | null
          name?: string
          price?: number
          recipe?: string
        }
        Relationships: []
      }
      profile: {
        Row: {
          age: number | null
          bmr: number | null
          created_at: string
          exercise: string
          goal: string
          height: number | null
          id: number
          tdee: number | null
          user_id: string | null
          weight: number | null
        }
        Insert: {
          age?: number | null
          bmr?: number | null
          created_at?: string
          exercise?: string
          goal?: string
          height?: number | null
          id?: number
          tdee?: number | null
          user_id?: string | null
          weight?: number | null
        }
        Update: {
          age?: number | null
          bmr?: number | null
          created_at?: string
          exercise?: string
          goal?: string
          height?: number | null
          id?: number
          tdee?: number | null
          user_id?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      sleep: {
        Row: {
          created_at: string | null
          duration: string | null
          endDate: string | null
          id: number
          startDate: string | null
          value: string | null
        }
        Insert: {
          created_at?: string | null
          duration?: string | null
          endDate?: string | null
          id?: number
          startDate?: string | null
          value?: string | null
        }
        Update: {
          created_at?: string | null
          duration?: string | null
          endDate?: string | null
          id?: number
          startDate?: string | null
          value?: string | null
        }
        Relationships: []
      }
      staff: {
        Row: {
          active_tables: Json | null
          created_at: string | null
          email: string
          id: number
          job: string
          manager_id: number | null
          name: string
          password: string
          pay: number
          updated_at: string | null
        }
        Insert: {
          active_tables?: Json | null
          created_at?: string | null
          email: string
          id?: number
          job: string
          manager_id?: number | null
          name: string
          password: string
          pay: number
          updated_at?: string | null
        }
        Update: {
          active_tables?: Json | null
          created_at?: string | null
          email?: string
          id?: number
          job?: string
          manager_id?: number | null
          name?: string
          password?: string
          pay?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "staff"
            referencedColumns: ["id"]
          },
        ]
      }
      steps: {
        Row: {
          created_at: string
          duration: string | null
          endDate: string | null
          id: number
          startDate: string | null
          type: string | null
          value: number | null
        }
        Insert: {
          created_at?: string
          duration?: string | null
          endDate?: string | null
          id?: number
          startDate?: string | null
          type?: string | null
          value?: number | null
        }
        Update: {
          created_at?: string
          duration?: string | null
          endDate?: string | null
          id?: number
          startDate?: string | null
          type?: string | null
          value?: number | null
        }
        Relationships: []
      }
      tables: {
        Row: {
          active_orders: number | null
          created_at: string | null
          employee_id: string | null
          id: number
          order_history: Json | null
          seat_count: number | null
          table_number: number | null
          updated_at: string | null
        }
        Insert: {
          active_orders?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: number
          order_history?: Json | null
          seat_count?: number | null
          table_number?: number | null
          updated_at?: string | null
        }
        Update: {
          active_orders?: number | null
          created_at?: string | null
          employee_id?: string | null
          id?: number
          order_history?: Json | null
          seat_count?: number | null
          table_number?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          role: string | null
          user_id: string
        }
        Insert: {
          id?: never
          role?: string | null
          user_id: string
        }
        Update: {
          id?: never
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      weight: {
        Row: {
          created_at: string
          date: string | null
          id: number
          time: string | null
          user_id: string | null
          weight: string | null
        }
        Insert: {
          created_at?: string
          date?: string | null
          id?: number
          time?: string | null
          user_id?: string | null
          weight?: string | null
        }
        Update: {
          created_at?: string
          date?: string | null
          id?: number
          time?: string | null
          user_id?: string | null
          weight?: string | null
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
