export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export interface Database {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: {
      is_attendance_admin: { Args: Record<string, never>; Returns: boolean };
      attendance_workspace: { Args: Record<string, never>; Returns: Json };
      attendance_commit: { Args: { p_revision: number; p_changes: Json }; Returns: Json };
      attendance_original: { Args: { p_import: string }; Returns: Json };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
