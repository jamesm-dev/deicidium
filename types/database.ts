export interface Database {
  public: {
    Tables: {
      members: {
        Row: {
          id: string
          guild: number
          name: string
          class: string
          stat_atk: number | null
          stat_def: number | null
          stat_acc: number | null
          growth_rate: string | null
          grade: number | null
        }
        Insert: {
          id?: string
          guild: number
          name: string
          class: string
          stat_atk?: number | null
          stat_def?: number | null
          stat_acc?: number | null
          growth_rate?: string | null
          grade?: number | null
        }
        Update: {
          id?: string
          guild?: number
          name?: string
          class?: string
          stat_atk?: number | null
          stat_def?: number | null
          stat_acc?: number | null
          growth_rate?: string | null
          grade?: number | null
        }
      }
    }
  }
} 