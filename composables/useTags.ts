import { useQuery } from '@tanstack/vue-query'
import type { Tag } from '@/types'

export function useTags() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const { data: tags, ...rest } = useQuery({
    queryKey: ['userTags', user.value?.id],
    queryFn: async () => {
      if (!user.value?.id) return { tags: [], total: 0 }

      // Get events with guild join and winners in a single query
      const { data, error, count } = await supabase
        .from('tags')
        .select(`
          *,
          guilds!inner (
            id,
            user_guilds!inner (user_id)
          )
        `, { count: 'exact' })
        .eq('guilds.user_guilds.user_id', user.value.id) as {
          data: Tag[] | null
          error: Error | null
          count: number | null
        }

      if (error) {
        console.error(error)
        return { tags: [], total: 0 }
      }

      return { tags: data, total: count }
    },
    enabled: !!user.value?.id,
  })

  return {
    tags: computed(() => tags.value?.tags ?? []),
    total: computed(() => tags.value?.total ?? 0),
    ...rest
  }
} 