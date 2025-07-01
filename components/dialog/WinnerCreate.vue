<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2, Minus, Plus } from 'lucide-vue-next'
import type { Database } from '@/types/database'
import type { DateValue } from '@internationalized/date'
import { parseDate } from '@internationalized/date'
import { DatePicker } from '@/components/ui/date-picker'
import moment from 'moment'
import type { Participant } from '@/types'

const supabase = useSupabaseClient<Database>()

const route = useRoute()
const eventId = route.params.eventId as string

const { guilds } = useGuilds()
const { members } = useMembers()
const { tags } = useTags()
const { refetch } = useEvents()

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
})

const emit = defineEmits(['toggle'])

const dialogOpen = computed({
  get: () => props.open,
  set: (_value) => emit('toggle')
})

const isLoading = ref(false)

const participants = ref<Participant[]>([])

const formSchema = z.object({
  tag: z.number().min(1, { message: 'Please enter a tag' }),
  date: z.string().min(1, { message: 'Please enter a date' }),
})

const { handleSubmit, errors, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    tag: 0,
    date: moment().toISOString(),
  },
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  if (guilds.value.length === 0) {
    toast.error('No guilds found', {
      description: 'Please associate a guild first',
    })
    isLoading.value = false
    return
  }

  const { tag, date } = values

  const { error } = await supabase.from('winners').insert({
    guild: guilds.value[0].id,
    event: eventId,
    tag,
    created_at: moment(date).toISOString(),
    participants: participants.value.map(({ id, name, enabled }) => ({
      id,
      name,
      enabled,
    })),
  })

  if (error) {
    toast.error('Uh oh! Something went wrong.', {
      description: error.message,
    })

    isLoading.value = false
    return
  }

  toast.success('New Winners Added', {
    description: 'New winners have been added.',
  })

  isLoading.value = false
  resetForm()
  refetch()

  emit('toggle')
})

const handleDateUpdate = (date: DateValue, onChange: (date: string) => void) => {
  onChange(date ? moment(date.toString()).toISOString() : '')
}

const handleAddParticipant = (participant: Participant) => {
  const updatedParticipants = participants.value?.map((p: Participant) => p.name === participant.name ? { ...p, enabled: !p.enabled } : p) || []
  participants.value = updatedParticipants
}

const handleRemoveParticipant = (participant: Participant) => {
  const updatedParticipants = participants.value?.map((p: Participant) => p.name === participant.name ? { ...p, enabled: !p.enabled } : p) || []
  participants.value = updatedParticipants
}

watch(members, (newMembers) => {
  if (newMembers?.length) {
    participants.value = newMembers.map(member => ({
      id: member.id,
      name: member.name,
      enabled: true,
    }))
  }
}, { immediate: true })

watch(() => props.open, (newOpen) => {
  if (newOpen) {
    setFieldValue('date', moment().toISOString())
  }
})

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
        <h1 class="font-semibold text-xl">Raffle Info</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Raffle type and winners
        </span>
      </div>

      <form class="gap-4 grid grid-cols-12 w-full" @submit.prevent="onSubmit">
        <FormField v-slot="{ field }" name="tag">
          <FormItem class="flex flex-col gap-1 col-span-6">
            <FormLabel class="form-label">Raffle Type</FormLabel>
            <FormControl>
              <Select v-bind="field" :disabled="isLoading">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Raffle Type">
                    {{tags.find(tag => tag.id === field.value)?.name || 'Raffle Type'}}
                  </SelectValue>
                </SelectTrigger>

                <SelectContent>
                  <SelectItem v-for="tag in tags" :key="tag.id" :value="tag.id">
                    <div class="flex items-center gap-2.5">
                      <span class="text-sm">{{ tag.name }}</span>

                      <span class="flex justify-center items-center px-1.5 py-0.5 text-[10px] text-white"
                        :style="{ backgroundColor: tag.color }">
                        {{ tag.symbol }}
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage>{{ errors.tag }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="date">
          <FormItem class="flex flex-col gap-1 col-span-6">
            <FormLabel class="form-label">Raffle Date</FormLabel>
            <FormControl>
              <DatePicker :initial-value="parseDateValue(field.value)"
                @update="($event) => handleDateUpdate($event, field.onChange)" :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.date }}</FormMessage>
          </FormItem>
        </FormField>

        <div class="flex flex-col gap-1 col-span-12">
          <p class="font-semibold text-sm">Winners ({{participants?.filter((participant: Participant) =>
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
          <!-- <div class="col-span-6" /> -->
          <Button class="flex items-center gap-2.5 col-span-6 py-5 w-full text-base" type="button" variant="outline"
            :disabled="isLoading">
            <span v-if="!isLoading">Load Winners</span>
            <span v-else>
              <Loader2 class="min-w-6 max-w-6 min-h-6 max-h-6 animate-spin" />
            </span>
          </Button>

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