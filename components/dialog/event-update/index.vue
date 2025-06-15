<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import type { Database } from '@/types/database'
import { DUNGEONS } from '@/types/enum'
import type { DungeonEvent } from '@/composables/useEvents'

const supabase = useSupabaseClient<Database>()

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

const formSchema = z.object({
  type: z.string().min(1, { message: 'Please enter a dungeon type' }),
  participants: z.string().min(1, { message: 'Please enter participants' }),
})

const { handleSubmit, errors, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    type: '',
    participants: '',
  },
})

// Watch both the member prop and dialog open state
watch([() => props.event, () => props.open], ([newEvent, isOpen]) => {
  if (newEvent && isOpen) {
    setFieldValue('type', newEvent.type)
    setFieldValue('participants', newEvent.participants)
  }
}, { immediate: true })

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  const { type, participants } = values

  const { error } = await supabase.from('events').update({
    guild: props.event.guild,
    type,
    participants,
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
  emit('toggle')
})
</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="flex flex-col gap-8 p-10 rounded-none sm:max-w-md">
      <div class="flex flex-col">
        <h1 class="font-semibold text-xl">Event Update</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Update event information
        </span>
      </div>

      <form class="gap-4 grid grid-cols-12 w-full" @submit.prevent="onSubmit">
        <FormField v-slot="{ field }" name="type">
          <FormItem class="flex flex-col gap-1 col-span-12">
            <FormLabel class="form-label">Dungeon Type</FormLabel>
            <FormControl>
              <Select v-bind="field" :disabled="isLoading">
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

        <FormField v-slot="{ field }" name="participants">
          <FormItem class="flex flex-col gap-1 col-span-12">
            <FormLabel class="form-label">Participants</FormLabel>
            <FormControl>
              <Textarea class="min-h-[250px]" v-bind="field" placeholder="Guild members" :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.participants }}</FormMessage>
          </FormItem>
        </FormField>

        <div class="flex flex-col gap-4 col-span-12 mt-4">
          <Button class="flex items-center gap-2.5 px-0 py-5 w-full text-base" type="submit" :disabled="isLoading">
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