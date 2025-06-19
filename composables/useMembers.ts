import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

export interface Member {
  id: string
  name: string
  class: string
  stat_atk: string
  stat_def: string
  stat_acc: string
  growth_rate: string
  grade: number
  created_at: string
  guild: string
}

interface UseMembersOptions {
  limit?: number
  sort?: 'asc' | 'desc' | 'none'
}

// Helper function to create consistent cache keys
function createMembersCacheKey(userId: string | undefined, options: UseMembersOptions) {
  return ['userMembers', userId, options]
}

export function useMembers(options: UseMembersOptions = {}) {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const { data: members, ...rest } = useQuery({
    queryKey: createMembersCacheKey(user.value?.id, options),
    queryFn: async () => {
      if (!user.value?.id) return { members: [], total: 0 }

      // First get the user's guild
      const { data: userGuild, error: userGuildError } = await supabase
        .from('user_guilds')
        .select('guilds (id)')
        .eq('user_id', user.value.id)
        .single() as { data: UserGuild | null, error: Error | null }

      if (userGuildError || !userGuild) {
        console.error(userGuildError)
        return { members: [], total: 0 }
      }

      // Then get all members from that guild
      let query = supabase
        .from('members')
        .select('*', { count: 'exact' })
        .eq('guild', userGuild.guilds.id)

      if (options.sort && options.sort !== 'none') {
        query = query.order('created_at', { ascending: options.sort === 'asc' })
      }

      if (options.limit && options.limit > 0) {
        query = query.limit(options.limit)
      }

      const { data, error, count } = await query as {
        data: Member[] | null
        error: Error | null
        count: number | null
      }

      if (error) {
        console.error(error)
        return { members: [], total: 0 }
      }

      return { members: data, total: count }
    },
    enabled: !!user.value?.id,
  })

  return {
    members: computed(() => members.value?.members ?? []),
    total: computed(() => members.value?.total ?? 0),
    ...rest
  }
} 