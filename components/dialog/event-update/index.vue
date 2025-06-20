<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2, Minus, Plus } from 'lucide-vue-next'
import type { Database } from '@/types/database'
import type { DateValue } from '@internationalized/date'
import { parseDate } from '@internationalized/date'
import { DUNGEONS } from '@/types/enum'
import { DatePicker } from '@/components/ui/date-picker'
import type { DungeonEvent, Participant } from '@/composables/useEvents'
import moment from 'moment'

const supabase = useSupabaseClient<Database>()
const { guilds } = useGuilds()
const { refetch } = useEvents()

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  event: {
    type: Object as PropType<DungeonEvent>,
    default: null,
  }
})

const emit = defineEmits(['toggle'])

const dialogOpen = computed({
  get: () => props.open,
  set: (_value) => emit('toggle')
})

const isLoading = ref(false)

const participants = ref<Participant[]>([])

const formSchema = z.object({
  type: z.string().min(1, { message: 'Please enter a dungeon type' }),
  date: z.string().min(1, { message: 'Please enter a date' }),
})

const { handleSubmit, errors, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    type: '',
    date: '',
  },
})

// Watch both the member prop and dialog open state
watch([() => props.event, () => props.open], ([newEvent, isOpen]) => {
  if (newEvent && isOpen) {
    setFieldValue('type', newEvent.type)
    setFieldValue('date', newEvent.created_at)

    participants.value = (newEvent.participants as unknown as Array<Participant>).map((participant: Participant) => ({
      id: participant.id,
      name: participant.name,
      enabled: participant.enabled,
    }))
  }
}, { immediate: true })

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  if (guilds.value.length === 0) {
    toast.error('No guilds found', {
      description: 'Please associate a guild first',
    })
    isLoading.value = false
    return
  }

  const { type, date } = values


  const { error } = await supabase.from('events').update({
    guild: guilds.value[0].id,
    type,
    created_at: date ?? new Date().toISOString(),
    participants: participants.value.map(({ id, name, enabled }) => ({
      id,
      name,
      enabled,
    })),
  }).eq('id', props.event.id)

  if (error) {
    toast.error('Uh oh! Something went wrong.', {
      description: error.message,
    })

    isLoading.value = false
    return
  }

  toast.success('Event Updated', {
    description: 'Event has been updated.',
  })

  isLoading.value = false
  resetForm()
  refetch()

  emit('toggle')
})

const handleDateUpdate = (date: DateValue, onChange: (date: string) => void) => {
  const dateNow = new Date().toISOString()
  onChange(date ? `${date?.toString()}T${dateNow.split('T')[1]}` : '')
}

const handleAddParticipant = (participant: Participant) => {
  const updatedParticipants = participants.value?.map((p: Participant) => p.name === participant.name ? { ...p, enabled: !p.enabled } : p) || []
  participants.value = updatedParticipants
}

const handleRemoveParticipant = (participant: Participant) => {
  const updatedParticipants = participants.value?.map((p: Participant) => p.name === participant.name ? { ...p, enabled: !p.enabled } : p) || []
  participants.value = updatedParticipants
}

// Parse date string to DateValue for DatePicker
const parseDateValue = (dateString: string): DateValue | undefined => {
  if (!dateString) return undefined
  try {
    return parseDate(moment(dateString).format('YYYY-MM-DD'))
  } catch {
    return undefined
  }
}

</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="flex flex-col gap-8 p-10 rounded-none sm:max-w-4xl">
      <div class="flex flex-col">
        <h1 class="font-semibold text-xl">Event Info</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Dungeon type and participants
        </span>
      </div>

      <form class="gap-4 grid grid-cols-12 w-full" @submit.prevent="onSubmit">
        <FormField v-slot="{ field }" name="type">
          <FormItem class="flex flex-col gap-1 col-span-6">
            <FormLabel class="form-label">Dungeon Type</FormLabel>
            <FormControl>
              <Select :model-value="field.value" @update:modelValue="field.onChange" :disabled="isLoading">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Dungeon Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem v-for="(label, value) in DUNGEONS" :key="value" :value="value">
                    {{ label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage>{{ errors.type }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="date">
          <FormItem class="flex flex-col gap-1 col-span-6">
            <FormLabel class="form-label">Dungeon Date</FormLabel>
            <FormControl>
              <DatePicker :initial-value="parseDateValue(field.value)"
                @update="($event) => handleDateUpdate($event, field.onChange)" :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.date }}</FormMessage>
          </FormItem>
        </FormField>

        <div class="flex flex-col gap-1 col-span-12">
          <p class="font-semibold text-sm">Participants ({{participants?.filter((participant: Participant) =>
            participant.enabled).length}})</p>

          <div class="flex gap-4">
            <div class="flex flex-col gap-2 mt-2.5 w-1/2 max-h-[250px] overflow-y-auto">
              <div
                v-for="(participant, index) in participants?.filter((participant: Participant) => participant.enabled)"
                @click="handleRemoveParticipant(participant)" :key="index"
                class="group flex justify-between items-center bg-neutral-400/20 hover:bg-neutral-400/30 p-2 rounded w-full cursor-pointer select-none">
                <span class="px-2 text-sm">{{ participant.name }}</span>
                <Minus class="w-4 h-4 text-red-500 scale-100 group-hover:scale-150 transition-all" />
              </div>
            </div>

            <div class="flex flex-col gap-2 mt-2.5 w-1/2 max-h-[250px] overflow-y-auto">
              <div
                v-for="(participant, index) in participants?.filter((participant: Participant) => !participant.enabled)"
                @click="handleAddParticipant(participant)" :key="index"
                class="group flex justify-between items-center bg-neutral-400/20 hover:bg-neutral-400/30 p-2 rounded w-full cursor-pointer select-none">
                <span class="px-2 text-sm">{{ participant.name }}</span>
                <Plus class="w-4 h-4 text-green-500 scale-100 group-hover:scale-150 transition-all" />
              </div>
            </div>
          </div>
        </div>

        <div class="gap-4 grid grid-cols-12 col-span-12 mt-4">
          <div class="col-span-6" />

          <Button class="flex items-center gap-2.5 col-span-6 py-5 w-full text-base" type="submit"
            :disabled="isLoading">
            <span v-if="!isLoading">Submit</span>
            <span v-else>
              <Loader2 class="min-w-6 max-w-6 min-h-6 max-h-6 animate-spin" />
            </span>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>