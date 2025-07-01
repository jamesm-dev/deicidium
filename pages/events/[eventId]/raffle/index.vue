<script setup lang="ts">
import { EventWinnerList } from '~/components/events';
import { Trophy } from 'lucide-vue-next';
import { toast } from 'vue-sonner';
import moment from 'moment';

const supabase = useSupabaseClient()

const route = useRoute()
const eventId = route.params.eventId as string

const { guilds, isLoading: isGuildsLoading } = useGuilds();
const { members, isLoading: isMembersLoading } = useMembers();
const { tags, isLoading: isTagsLoading } = useTags();
const { winners, isLoading: isWinnersLoading, refetch } = useWinners({ eventId })

const state = ref<{
  raffleCreate: boolean,
  raffleUpdate: boolean,
  raffleTitle: string | null,
  raffleTagId: string | null,
  winner: WinnerEvent | null,
}>({
  raffleCreate: false,
  raffleUpdate: false,
  raffleTitle: null,
  raffleTagId: null,
  winner: null,
})

const handleCloseCreateDialog = () => {
  state.value.raffleCreate = false
  state.value.raffleTitle = null
  state.value.raffleTagId = null
  state.value.winner = null
  refetch()
}

const handleCloseUpdateDialog = () => {
  state.value.raffleUpdate = false
  state.value.raffleTitle = null
  state.value.raffleTagId = null
  state.value.winner = null
  refetch()
}

const handleLoadWinner = (winner: WinnerEvent) => {
  state.value.raffleUpdate = true
  state.value.winner = winner
}

const handleDeleteWinner = async (winner: WinnerEvent) => {
  // state.value.winnerDelete = true
  // state.value.winner = winner

  const { error } = await supabase.from('winners').delete().eq('id', winner.id)

  if (error) {
    toast.error('Error deleting raffle entry', {
      description: error.message,
    })
  } else {
    toast.success('Raffle entry deleted', {
      description: 'Raffle entry has been deleted.',
    })
    refetch()
  }
}

const handleRaffle = async (raffleType: string) => {
  const tag = tags.value?.find((tag) => tag.symbol === raffleType)
  const identifier = moment().format('MM-DD-YYYY HH:mm:ss')

  state.value.raffleTitle = identifier
  state.value.raffleTagId = tag?.id ?? null

  const timer = setTimeout(() => {
    state.value.raffleCreate = true
    clearTimeout(timer)
  }, 1000)

  const filteredWinners = winners.value?.filter((winner) => winner.tag === tag?.id)

  const entries = new Set<{ id: string, text: string }>()

  filteredWinners?.forEach((winner) => {
    winner.participants.forEach((participant) => {
      if (participant.enabled) {
        entries.add({
          id: participant.id,
          text: participant.name,
        })
      }
    })
  })

  const entriesArray = Array.from(entries).filter((participant, index, self) =>
    index === self.findIndex(p => p.id === participant.id)
  )

  // Get members that are not in entries (winners)
  const allParticipants = (members.value?.map((member) => ({
    id: member.id,
    text: member.name
  })) ?? []).filter(member =>
    !entriesArray.some(entry => entry.id === member.id)
  ).map(({ id, text }) => ({ id: String(id), text }))

  const wheelLink = await useWheel({
    apiKey: guilds.value?.[0]?.wheel_key ?? '',
    title: identifier,
    description: `#${eventId} ${moment().format('MMM DD, YYYY')} (${allParticipants.length} Participants)— ${tag?.name ?? raffleType}`,
    entries: allParticipants,
  });

  if (wheelLink) {
    window.open(wheelLink, '_blank');
  }
};


const computedWinner = computed(() => state.value.winner ?? undefined)

const computedDisabled = computed(() => isGuildsLoading.value || isMembersLoading.value || isWinnersLoading.value || isTagsLoading.value)
</script>

<template>
  <div class="flex flex-col gap-2 mx-auto pt-4 pb-10 container">
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <h1 class="font-semibold text-white text-3xl">Raffle Results</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Manage your dungeon raffle results
        </span>
      </div>

      <Button class="border-black" @click="state.raffleCreate = true">
        <Trophy />
        <span>Add Winners</span>
      </Button>
    </div>

    <div class="mt-10">
      <EventWinnerList :on-update="handleLoadWinner" :on-delete="handleDeleteWinner" />
    </div>

    <div class="flex flex-col gap-10 mt-10">
      <div class="flex flex-col">
        <h1 class="font-semibold text-primary text-3xl">Dungeon— Kodshee</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          List of possible rewards for the guild dungeon Kodshee
        </span>
      </div>

      <div class="gap-4 grid grid-cols-12 col-span-12">
        <CommonRaffleButton class="col-span-4" title="Frozen Tear"
          description="Give the Wheel of Names a frosty spin—win a Frozen Tear!" :options="{
            image: '/assets/images/Celano_Wilderness_5.webp',
            imageLoot: ['/assets/images/raffle_01_01.png'],
            pulseColor: '#866895',
          }" :disabled="computedDisabled" @click="handleRaffle('FT')" />

        <CommonRaffleButton class="col-span-4" title="Rare Scroll"
          description="Spin the Wheel of Destiny for your chance at Rare Scroll!" :options="{
            image: '/assets/images/Celano_Wilderness_7.webp',
            imageLoot: ['/assets/images/raffle_02_01.png', '/assets/images/raffle_02.gif'],
            pulseColor: '#386480',
          }" :disabled="computedDisabled" @click="handleRaffle('RARESCROLL')" />

        <CommonRaffleButton class="col-span-4" title="Tier 2 Rare Item"
          description="Spin the Wheel of Names for a shot at Tier 2 Rare Item!" :options="{
            image: '/assets/images/Celano_Wilderness_8.webp',
            imageLoot: ['/assets/images/raffle_03_01.png', '/assets/images/raffle_03.gif'],
            pulseColor: '#386480',
          }" :disabled="computedDisabled" @click="handleRaffle('RARET2')" />

        <CommonRaffleButton class="col-span-4" title="Epic Scroll"
          description="Try your luck today for a chance at Epic Scroll!" :options="{
            image: '/assets/images/Avalius_Coast_6.webp',
            imageLoot: ['/assets/images/raffle_04_01.png', '/assets/images/raffle_04.gif'],
            pulseColor: '#866895',
          }" :disabled="computedDisabled" @click="handleRaffle('EPICSCROLL')" />

        <CommonRaffleButton class="col-span-4" title="Tier 1 Epic Item"
          description="Might be your lucky day for a chance at Tier 1 Epic Item!" :options="{
            image: '/assets/images/Avalius_Coast_5.webp',
            imageLoot: ['/assets/images/raffle_05_01.png'],
            pulseColor: '#866895',
          }" :disabled="computedDisabled" @click="handleRaffle('EPICT1')" />
      </div>
    </div>

    <div class="flex flex-col gap-10 mt-10">
      <div class="flex flex-col">
        <h1 class="font-semibold text-primary text-3xl">Dungeon— Tiarak</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          List of possible rewards for the guild dungeon Tiarak
        </span>
      </div>

      <div class="gap-4 grid grid-cols-12 col-span-12">
        <CommonRaffleButton class="col-span-4" title="Morion"
          description="Give the Wheel of Names a frosty spin—win a Morion!" :options="{
            image: '/assets/images/Avalius_Coast_4.webp',
            imageLoot: ['/assets/images/raffle_06_01.png'],
            pulseColor: '#9D7F4A',
          }" :disabled="computedDisabled" @click="handleRaffle('MORION')" />

        <CommonRaffleButton class="col-span-4" title="Artisan's Glider"
          description="Spin the Wheel of Destiny for your chance at Artisan's Glider!" :options="{
            image: '/assets/images/Avalius_Coast_3.webp',
            imageLoot: ['/assets/images/raffle_07_01.png'],
            pulseColor: '#866895',
          }" :disabled="computedDisabled" @click="handleRaffle('EPICGLIDER')" />

        <CommonRaffleButton class="col-span-4" title="Pitch-Black Scroll"
          description="Try your luck today for a chance at Pitch-Black Scroll!" :options="{
            image: '/assets/images/NC_Area5_3.webp',
            imageLoot: ['/assets/images/raffle_08_01.png'],
            pulseColor: '#386480',
          }" :disabled="computedDisabled" @click="handleRaffle('PITCHBLACK')" />

        <CommonRaffleButton class="col-span-4" title="Brilliant Scroll"
          description="Spin the Wheel of Names for a shot at Brilliant Scroll!" :options="{
            image: '/assets/images/Celano_Wilderness_5.webp',
            imageLoot: ['/assets/images/raffle_09_01.png'],
            pulseColor: '#386480',
          }" :disabled="computedDisabled" @click="handleRaffle('BRILLIANT')" />
      </div>
    </div>

    <DialogWinnerCreate :open="state.raffleCreate" @toggle="handleCloseCreateDialog" />
    <DialogWinnerUpdate :open="state.raffleUpdate" :winner="computedWinner" @toggle="handleCloseUpdateDialog" />
  </div>
</template>

<style scoped></style>