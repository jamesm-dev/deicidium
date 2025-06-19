<script setup lang="ts">
import { RecentWinners } from '@/components/dashboard/recent-winners';
import { RecentMembers } from '@/components/dashboard/recent-members';

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
  <div class="flex flex-col gap-2 mx-auto pt-4 pb-10 container">
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

    <div v-else class="flex flex-col">
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

      <div class="flex flex-col gap-10">
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
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('FT')" />

          <CommonRaffleButton class="col-span-4" title="Rare Scroll"
            description="Spin the Wheel of Destiny for your chance at Rare Scroll!" :options="{
              image: '/assets/images/Celano_Wilderness_7.webp',
              imageLoot: ['/assets/images/raffle_02_01.png', '/assets/images/raffle_02.gif'],
              pulseColor: '#386480',
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('RARESCROLL')" />

          <CommonRaffleButton class="col-span-4" title="Tier 2 Rare Item"
            description="Spin the Wheel of Names for a shot at Tier 2 Rare Item!" :options="{
              image: '/assets/images/Celano_Wilderness_8.webp',
              imageLoot: ['/assets/images/raffle_03_01.png', '/assets/images/raffle_03.gif'],
              pulseColor: '#386480',
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('RARET2')" />

          <CommonRaffleButton class="col-span-4" title="Epic Scroll"
            description="Try your luck today for a chance at Epic Scroll!" :options="{
              image: '/assets/images/Avalius_Coast_6.webp',
              imageLoot: ['/assets/images/raffle_04_01.png', '/assets/images/raffle_04.gif'],
              pulseColor: '#866895',
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('EPICSCROLL')" />

          <CommonRaffleButton class="col-span-4" title="Tier 1 Epic Item"
            description="Might be your lucky day for a chance at Tier 1 Epic Item!" :options="{
              image: '/assets/images/Avalius_Coast_5.webp',
              imageLoot: ['/assets/images/raffle_05_01.png'],
              pulseColor: '#866895',
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('EPICT1')" />
        </div>
      </div>

      <div class="flex flex-col gap-10 mt-20">
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
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('MORION')" />

          <CommonRaffleButton class="col-span-4" title="Artisan's Glider"
            description="Spin the Wheel of Destiny for your chance at Artisan's Glider!" :options="{
              image: '/assets/images/Avalius_Coast_3.webp',
              imageLoot: ['/assets/images/raffle_07_01.png'],
              pulseColor: '#866895',
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('EPICGLIDER')" />

          <CommonRaffleButton class="col-span-4" title="Pitch-Black Scroll"
            description="Try your luck today for a chance at Pitch-Black Scroll!" :options="{
              image: '/assets/images/NC_Area5_3.webp',
              imageLoot: ['/assets/images/raffle_08_01.png'],
              pulseColor: '#386480',
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('PITCHBLACK')" />

          <CommonRaffleButton class="col-span-4" title="Brilliant Scroll"
            description="Spin the Wheel of Names for a shot at Brilliant Scroll!" :options="{
              image: '/assets/images/Celano_Wilderness_5.webp',
              imageLoot: ['/assets/images/raffle_09_01.png'],
              pulseColor: '#386480',
            }" :disabled="isGuildsLoading || isMembersLoading" @click="handleRaffle('BRILLIANT')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>