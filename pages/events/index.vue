<script setup lang="ts">
import { EventList } from '@/components/events/event-list';
import type { DungeonEvent } from '@/composables/useEvents';
import { UserPlus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const supabase = useSupabaseClient()

const state = ref({
  eventCreate: false,
  eventUpdate: false,
  eventDelete: false,
  event: null as DungeonEvent | null,
})

const { refetch } = useEvents()

const handleCloseUpdateDialog = () => {
  state.value.eventUpdate = false
  state.value.event = null
  refetch()
}

const handleLoadEvent = (event: DungeonEvent) => {
  state.value.eventUpdate = true
  state.value.event = event
}

const handleDeleteEvent = async (event: DungeonEvent) => {
  // state.value.eventDelete = true
  // state.value.event = event

  const { error } = await supabase.from('events').delete().eq('id', event.id)

  if (error) {
    toast.error('Error deleting event', {
      description: error.message,
    })
  } else {
    toast.success('Event deleted', {
      description: 'Event has been deleted.',
    })
    refetch()
  }
}

const computedEvent = computed(() => state.value.event ?? undefined)

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
      <EventList :on-event-update="handleLoadEvent" :on-event-delete="handleDeleteEvent" />
    </div>

    <DialogEventCreate :open="state.eventCreate" @toggle="state.eventCreate = !state.eventCreate" />
    <DialogEventUpdate :open="state.eventUpdate" :event="computedEvent" @toggle="handleCloseUpdateDialog" />
  </div>
</template>

<style scoped></style>