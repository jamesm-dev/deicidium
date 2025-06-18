<script setup lang="ts">
import { EventList } from '@/components/events/event-list';
import type { DungeonEvent } from '@/composables/useEvents';
import { UserPlus } from 'lucide-vue-next';

const state = ref({
  eventCreate: false,
  eventUpdate: false,
  event: null as DungeonEvent | null,
})

const { refetch } = useEvents()

const handleEventUpdate = () => {
  state.value.eventUpdate = false
  state.value.event = null
  refetch()
}

const computedEvent = computed(() => state.value.event)

</script>

<template>
  <div class="flex flex-col gap-2 mx-auto pt-4 container">
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <h1 class="font-semibold text-white text-3xl">Guild Events</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Manage your guild events
        </span>
      </div>

      <Button class="border-black" @click="state.eventCreate = true">
        <UserPlus />
        <span>Add Event</span>
      </Button>
    </div>

    <div class="mt-10">
      <EventList :on-event-update="(event) => {
        state.eventUpdate = true
        state.event = event
      }" />
    </div>

    <DialogEventCreate :open="state.eventCreate" @toggle="state.eventCreate = !state.eventCreate" />
    <DialogEventUpdate :open="state.eventUpdate" :event="computedEvent ?? undefined" @toggle="handleEventUpdate" />
  </div>
</template>

<style scoped></style>