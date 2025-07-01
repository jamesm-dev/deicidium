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

      // Get members with guild join in a single query
      let query = supabase
        .from('members')
        .select(`
          *,
          guilds!inner (
            id,
            user_guilds!inner (user_id)
          )
        `, { count: 'exact' })
        .eq('guilds.user_guilds.user_id', user.value.id)

      if (options.sort && options.sort !== 'none') {
        query = query.order('created_at', { ascending: options.sort === 'asc' })
      }

      if (options.limit && options.limit > 0) {
        query = query.limit(options.limit)
      }

      const { data, error, count } = await query as {
        data: (Member & { guilds: { id: string, user_guilds: { user_id: string } } })[] | null
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