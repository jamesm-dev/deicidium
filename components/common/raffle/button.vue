<script setup lang="ts">
import { Button } from '@/components/ui/button';

const props = defineProps<{
  title: string
  description: string
  disabled?: boolean
  class?: string
  options?: {
    image?: string
    imageLoot?: string[]
    pulseColor?: string
  }
}>()

const emit = defineEmits<{
  (e: 'click'): void
}>()
</script>

<template>
  <div :class="['flex flex-col gap-4', props.class]">
    <Button class="group relative w-full min-h-[150px]" variant="default" @click="emit('click')" :disabled="disabled">
      <div class="top-0 left-0 absolute bg-cover bg-no-repeat bg-center opacity-15 w-full h-full"
        :style="{ backgroundImage: `url(${options?.image})` }" />

      <div class="z-10 relative flex w-full">
        <div class="relative flex justify-center items-center px-8 border-e border-neutral-400/20">
          <NuxtImg v-if="options?.imageLoot?.[0]" :src="options.imageLoot[0]" :alt="title"
            :class="['z-10 opacity-100 min-w-[70px] max-w-[70px] min-h-[70px] max-h-[70px]', options?.imageLoot?.[1] ? 'group-hover:opacity-0' : '']" />

          <NuxtImg v-if="options?.imageLoot?.[1]" :src="options.imageLoot[1]" :alt="title"
            :class="['z-10 absolute opacity-0 group-hover:opacity-100 min-w-[70px] max-w-[70px] min-h-[70px] max-h-[70px]', options?.imageLoot?.[0] ? 'group-hover:opacity-100' : '']" />

          <div class="inline-flex absolute opacity-75 w-[60px] h-[60px] group-hover:animate-ping"
            :style="{ backgroundColor: options?.pulseColor ?? '#866895' }" />
        </div>

        <div class="flex flex-col px-8 w-full text-start">
          <span class="text-lg uppercase">
            {{ title }}
          </span>

          <span class="font-sans font-normal text-neutral-400 text-sm text-wrap">
            {{ description }}
          </span>
        </div>
      </div>
    </Button>

    <!-- <Button class="border-black w-full" variant="outline">
      ADD Frozen Tear Winners
    </Button> -->
  </div>
</template>

<style scoped></style>