import { useQuery } from '@tanstack/vue-query'
import { computed } from 'vue'

export interface Guild {
  id: string
  name: string
  intro: string
  region: string
  server: string
}

export interface UserGuild {
  guilds: Guild
}

export function useGuilds() {
  const user = useSupabaseUser()
  const supabase = useSupabaseClient()

  const { data: guilds, ...rest } = useQuery({
    queryKey: ['userGuilds', user.value?.id],
    queryFn: async () => {
      if (!user.value?.id) return []

      const { data, error } = await supabase
        .from('user_guilds')
        .select(`guilds (id, name, intro, region, server)`)
        .eq('user_id', user.value.id) as { data: UserGuild[] | null, error: Error | null }

      if (error) {
        console.error(error)
        navigateTo('/', { replace: true })
        return []
      }

      return data?.map((item) => item.guilds) ?? []
    },
    enabled: !!user.value?.id,
  })

  return {
    guilds: computed(() => guilds.value ?? []),
    ...rest
  }
} 