export interface Trip {
    trip_id: number;
    user_id: number;
    school: string;
    date?: string;
    status?: "pending" | "completed" | "cancelled";
    created_at?: string;
    updated_at?: string;
  }
  