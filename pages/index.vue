<script setup>
import { RecentWinners } from '@/components/dashboard/recent-winners';
import { RecentMembers } from '@/components/dashboard/recent-members';
import { Button } from '@/components/ui/button';


</script>

<template>
  <div class="flex flex-col gap-2 mx-auto pt-4 container">
    <div class="gap-x-4 gap-y-10 grid grid-cols-12">
      <div class="flex flex-col gap-2 col-span-6 bg-neutral-100/50 p-4 rounded">
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Recent Winners
        </span>

        <RecentWinners />
      </div>

      <div class="flex flex-col gap-2 col-span-6 bg-neutral-100/50 p-4 rounded">
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Recent Members
        </span>

        <RecentMembers />
      </div>

      <div class="gap-4 grid grid-cols-12 col-span-12">
        <div class="flex flex-col gap-4 col-span-4">
          <Button class="w-full min-h-[100px]" variant="default">
            GET Frozen Tear Eligible
          </Button>

          <Button class="border-black w-full" variant="outline">
            ADD Frozen Tear Winners
          </Button>
        </div>

        <div class="flex flex-col gap-4 col-span-4">
          <Button class="w-full min-h-[100px]" variant="default">
            GET Rare Scroll Eligible
          </Button>

          <Button class="border-black w-full" variant="outline">
            ADD Rare Scroll Winners
          </Button>
        </div>

        <div class="flex flex-col gap-4 col-span-4">
          <Button class="w-full min-h-[100px]" variant="default">
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