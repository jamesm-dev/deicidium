import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'
import type { Participant } from '@/types'

interface Base {
  id: string
  event: string
  tag: string
  participants: Participant[]
  is_deleted: boolean
  created_at: string
}

export interface WinnerEvent extends Base {
  events: DungeonEvent & {
    guilds: {
      id: string,
      user_guilds: { user_id: string }
    }
  }
  tags: {
    id: string,
    name: string,
    color: string,
    symbol: string
  }
}

interface UseWinnersOptions {
  eventId?: string
}

export function useWinners(options: UseWinnersOptions = {}) {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const { data: winners, ...rest } = useQuery({
    queryKey: ['userWinners', user.value?.id, options.eventId],
    queryFn: async () => {
      if (!user.value?.id) return { winners: [], total: 0 }

      let query = supabase
        .from('winners')
        .select(`
          *,
          events!inner (
            id,
            type,
            participants,
            created_at,
            updated_at,
            guild,
            guilds!inner (
              id,
              user_guilds!inner (user_id)
            )
          ),
          tags!inner (
            id,
            name,
            color,
            symbol
          )
        `, { count: 'exact' })
        .eq('events.guilds.user_guilds.user_id', user.value.id)

      // Filter by eventId if provided
      if (options.eventId) {
        query = query.eq('event', options.eventId)
      }

      const { data, error, count } = await query as {
        data: WinnerEvent[] | null
        error: Error | null
        count: number | null
      }

      if (error) {
        console.error(error)
        return { winners: [], total: 0 }
      }

      return { winners: data, total: count }
    },
    enabled: !!user.value?.id,
  })

  return {
    winners: computed(() => winners.value?.winners ?? []),
    total: computed(() => winners.value?.total ?? 0),
    ...rest
  }
} 