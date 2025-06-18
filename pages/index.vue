<script setup lang="ts">
import { RecentWinners } from '@/components/dashboard/recent-winners';
import { RecentMembers } from '@/components/dashboard/recent-members';
import { Button } from '@/components/ui/button';

const { guilds, isLoading: isGuildsLoading } = useGuilds();
const { members, isLoading: isMembersLoading } = useMembers();

const handleRaffle = async (raffleType: string) => {
  const wheelLink = await useWheel({
    apiKey: guilds.value?.[0]?.wheel_key ?? '',
    title: `${guilds.value?.[0]?.name}—${raffleType} Raffle`,
    description: `${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })} (${members.value?.length} Participants)`,
    entries: members.value?.map((member) => ({ text: member.name })) ?? [],
  });

  if (wheelLink) {
    window.open(wheelLink, '_blank');
  }
};
</script>

<template>
  <div class="flex flex-col gap-2 mx-auto pt-4 container">
    <div v-if="isGuildsLoading || !guilds.length" class="flex justify-center items-center w-full min-h-screen">
      <div class="flex flex-col gap-2 text-center">
        <h1 class="text-3xl">Not associated with any guild</h1>
        <div class="flex justify-center items-center gap-1.5 font-mono text-neutral-500 text-sm">
          <span>Please contact</span>
          <NuxtLink to="https://discord.gg/V5wZD4FymD" target="_blank" class="text-blue-500 hover:underline">
            @jepaninja
          </NuxtLink>
          <span>on Discord.</span>
        </div>
      </div>
    </div>

    <div v-else class="gap-x-4 gap-y-10 grid grid-cols-12">
      <div class="gap-10 grid grid-cols-12 col-span-12">
        <div class="flex flex-col gap-2 col-span-6">
          <div class="flex flex-col">
            <h1 class="font-semibold text-white text-3xl">Winners</h1>
            <span class="font-mono font-semibold text-neutral-500 text-sm">
              Latest guild loot winners
            </span>
          </div>

          <div class="mt-10 min-h-[425px]">
            <RecentWinners />
          </div>
        </div>

        <div class="flex flex-col gap-2 col-span-6">
          <div class="flex flex-col">
            <h1 class="font-semibold text-white text-3xl">Members</h1>
            <span class="font-mono font-semibold text-neutral-500 text-sm">
              Latest guild members
            </span>
          </div>

          <div class="mt-10 min-h-[425px]">
            <RecentMembers />
          </div>
        </div>
      </div>

      <div class="gap-4 grid grid-cols-12 col-span-12">
        <div class="flex flex-col gap-4 col-span-4">
          <Button class="group relative w-full min-h-[150px]" variant="default" @click="handleRaffle('FT')"
            :disabled="isGuildsLoading || isMembersLoading">
            <div class="top-0 left-0 absolute bg-cover bg-no-repeat bg-center opacity-15 w-full h-full"
              style="background-image: url('/assets/images/Celano_Wilderness_5.webp');" />

            <div class="z-10 relative flex w-full">
              <div class="relative flex justify-center items-center px-8 border-e border-neutral-400/20">
                <NuxtImg src="/assets/images/raffle_01_01.png" alt="Frozen Tear"
                  class="z-10 relative min-w-[70px] max-w-[70px] min-h-[70px] max-h-[70px]" />

                <div class="inline-flex absolute bg-[#866895] opacity-75 w-[60px] h-[60px] group-hover:animate-ping" />
              </div>

              <div class="flex flex-col gap-1.5 px-8 w-full text-start">
                <span class="text-xl">FROZEN TEAR</span>
                <span class="font-sans font-normal text-neutral-400 text-sm text-wrap">
                  Give the Wheel of Names a frosty spin—win a Frozen Tear and cry victorious!
                </span>
              </div>
            </div>
          </Button>

          <!-- <Button class="border-black w-full" variant="outline">
            ADD Frozen Tear Winners
          </Button> -->
        </div>

        <div class="flex flex-col gap-4 col-span-4">
          <Button class="group relative w-full min-h-[150px]" variant="default" @click="handleRaffle('SCROLL')"
            :disabled="isGuildsLoading || isMembersLoading">
            <div class="top-0 left-0 absolute bg-cover bg-no-repeat bg-center opacity-15 w-full h-full"
              style="background-image: url('/assets/images/Celano_Wilderness_7.webp');" />

            <div class="z-10 relative flex w-full">
              <div class="box-content relative flex justify-center items-center px-8 border-e border-neutral-400/20">
                <NuxtImg src="/assets/images/raffle_02_01.png" alt="Rare Scroll"
                  class="z-10 opacity-100 group-hover:opacity-0 min-w-[70px] max-w-[70px] min-h-[70px] max-h-[70px]" />

                <NuxtImg src="/assets/images/raffle_02.gif" alt="Rare Scroll"
                  class="z-10 absolute opacity-0 group-hover:opacity-100 min-w-[70px] max-w-[70px] min-h-[70px] max-h-[70px]" />

                <div class="inline-flex absolute bg-[#386480] opacity-75 w-[60px] h-[60px] group-hover:animate-ping" />
              </div>

              <div class="flex flex-col gap-1.5 px-8 w-full text-start">
                <span class="text-xl">RARE SCROLLS</span>
                <span class="font-sans font-normal text-neutral-400 text-sm text-wrap">
                  Spin the Wheel of Destiny for your chance at Rare Scrolls—may the odds be with you!
                </span>
              </div>
            </div>
          </Button>

          <!-- <Button class="border-black w-full" variant="outline">
            ADD Rare Scroll Winners
          </Button> -->
        </div>

        <div class="flex flex-col gap-4 col-span-4">
          <Button class="group relative w-full min-h-[150px]" variant="default" @click="handleRaffle('T2')"
            :disabled="isGuildsLoading || isMembersLoading">
            <div class="top-0 left-0 absolute bg-cover bg-no-repeat bg-center opacity-15 w-full h-full"
              style="background-image: url('/assets/images/Celano_Wilderness_8.webp');" />

            <div class="z-10 relative flex w-full">
              <div class="relative flex justify-center items-center px-8 border-e border-neutral-400/20">
                <NuxtImg src="/assets/images/raffle_03_01.png" alt="Tier 2 Rare Item"
                  class="z-10 opacity-100 group-hover:opacity-0 min-w-[70px] max-w-[70px] min-h-[70px] max-h-[70px]" />

                <NuxtImg src="/assets/images/raffle_03.gif" alt="Tier 2 Rare Item"
                  class="z-10 absolute opacity-0 group-hover:opacity-100 w-[70px] h-[70px]" />

                <div class="inline-flex absolute bg-[#386480] opacity-75 w-[60px] h-[60px] group-hover:animate-ping" />
              </div>

              <div class="flex flex-col gap-1.5 px-8 w-full text-start">
                <span class="text-xl">TIER 2 RARE ITEMS</span>
                <span class="font-sans font-normal text-neutral-400 text-sm text-wrap">
                  Spin the Wheel of Names for a shot at Tier 2 Rare Item—mediocrity is for NPCs!
                </span>
              </div>
            </div>
          </Button>

          <!-- <Button class="border-black w-full" variant="outline">
            ADD Tier 2 Rare Item Winners
          </Button> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>