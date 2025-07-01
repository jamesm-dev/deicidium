import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Participant } from '@/types'

interface DungeonBase {
  id: string
  type: string
  participants: Array<Participant>
  created_at: string
  updated_at: string
  guild: string
}

export interface DungeonEvent extends DungeonBase {
  guilds: { id: string, user_guilds: { user_id: string } }
  winners: Array<{
    id: string
    event: string
    tag: string
    participants: Array<Participant>
    is_deleted: boolean
    created_at: string
    tags: {
      id: string
      name: string
      color: string
      symbol: string
    }
  }>
}

export function useEvents() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const { data: events, ...rest } = useQuery({
    queryKey: ['userEvents', user.value?.id],
    queryFn: async () => {
      if (!user.value?.id) return { events: [], total: 0 }

      // Get events with guild join and winners in a single query
      const { data, error, count } = await supabase
        .from('events')
        .select(`
          *,
          guilds!inner (
            id,
            user_guilds!inner (user_id)
          ),
          winners (
            id,
            event,
            tag,
            participants,
            is_deleted,
            created_at,
            tags!inner (
              id,
              name,
              color,
              symbol
            )
          )
        `, { count: 'exact' })
        .eq('guilds.user_guilds.user_id', user.value.id) as {
          data: DungeonEvent[] | null
          error: Error | null
          count: number | null
        }

      if (error) {
        console.error(error)
        return { events: [], total: 0 }
      }

      return { events: data, total: count }
    },
    enabled: !!user.value?.id,
  })

  return {
    events: computed(() => events.value?.events ?? []),
    total: computed(() => events.value?.total ?? 0),
    ...rest
  }
} 