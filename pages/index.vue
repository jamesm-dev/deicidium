<script setup>
import { RecentWinners } from '@/components/dashboard/recent-winners';
import { RecentMembers } from '@/components/dashboard/recent-members';
import { Button } from '@/components/ui/button';

</script>

<template>
  <div class="flex flex-col gap-2 mx-auto pt-4 container">
    <div class="gap-x-4 gap-y-10 grid grid-cols-12">
      <div class="flex flex-col gap-2 col-span-6">
        <div class="flex flex-col">
          <h1 class="font-semibold text-xl">Loot Winners</h1>
          <span class="font-mono font-semibold text-neutral-500 text-sm">
            Latest guild loot winners
          </span>
        </div>

        <div class="bg-neutral-400/10 mt-4 p-10">
          <RecentWinners />
        </div>
      </div>

      <div class="flex flex-col gap-2 col-span-6">
        <div class="flex flex-col">
          <h1 class="font-semibold text-xl">New Members</h1>
          <span class="font-mono font-semibold text-neutral-500 text-sm">
            Latest guild members
          </span>
        </div>

        <div class="bg-neutral-400/10 mt-4 p-10">
          <RecentMembers />
        </div>
      </div>

      <div class="gap-4 grid grid-cols-12 col-span-12">
        <div class="flex flex-col gap-4 col-span-4">
          <Button class="w-full min-h-[150px]" variant="default">
            GET Frozen Tear Eligible
          </Button>

          <Button class="border-black w-full" variant="outline">
            ADD Frozen Tear Winners
          </Button>
        </div>

        <div class="flex flex-col gap-4 col-span-4">
          <Button class="w-full min-h-[150px]" variant="default">
            GET Rare Scroll Eligible
          </Button>

          <Button class="border-black w-full" variant="outline">
            ADD Rare Scroll Winners
          </Button>
        </div>

        <div class="flex flex-col gap-4 col-span-4">
          <Button class="w-full min-h-[150px]" variant="default">
            GET Tier 2 Rare Item Eligible
          </Button>

          <Button class="border-black w-full" variant="outline">
            ADD Tier 2 Rare Item Winners
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>