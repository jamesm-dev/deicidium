import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

export interface Participant {
  id: string
  name: string
  enabled: boolean
}

export interface DungeonEvent {
  id: string
  type: string
  participants: string
  created_at: string
  updated_at: string
  guild: string
}

export function useEvents() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const { data: events, ...rest } = useQuery({
    queryKey: ['userEvents', user.value?.id],
    queryFn: async () => {
      if (!user.value?.id) return { events: [], total: 0 }

      // First get the user's guild
      const { data: userGuild, error: userGuildError } = await supabase
        .from('user_guilds')
        .select('guilds (id)')
        .eq('user_id', user.value.id)
        .single() as { data: UserGuild | null, error: Error | null }

      if (userGuildError || !userGuild) {
        console.error(userGuildError)
        return { events: [], total: 0 }
      }

      // Then get all events from that guild
      const { data, error, count } = await supabase
        .from('events')
        .select('*', { count: 'exact' })
        .eq('guild', userGuild.guilds.id) as {
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