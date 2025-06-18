<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import type { Database } from '@/types/database'
import { CLASSES } from '@/types/enum'

const supabase = useSupabaseClient<Database>()
const { guilds } = useGuilds()
const { refetch } = useMembers()

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

const formSchema = z.object({
  name: z.string().min(1, { message: 'Please enter a name' }),
  class: z.string().min(1, { message: 'Please select a class' }),
  stat_atk: z.number().optional(),
  stat_def: z.number().optional(),
  stat_acc: z.number().optional(),
  growth_rate: z.number().optional(),
  grade: z.number().optional(),
})

const { handleSubmit, errors, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: '',
    class: '',
    stat_atk: 0,
    stat_def: 0,
    stat_acc: 0,
    growth_rate: 0,
    grade: 0,
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

  const { name, class: characterClass, stat_atk, stat_def, stat_acc, growth_rate, grade } = values

  const { error } = await supabase.from('members').insert({
    guild: guilds.value[0].id,
    name,
    class: characterClass,
    stat_atk,
    stat_def,
    stat_acc,
    growth_rate,
    grade,
  })

  if (error) {
    toast.error('Uh oh! Something went wrong.', {
      description: error.message,
    })

    isLoading.value = false
    return
  }

  toast.success('New Member Added', {
    description: 'New member has been added to the guild.',
  })

  isLoading.value = false
  resetForm()
  refetch()
})

</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="flex flex-col gap-8 p-10 rounded-none sm:max-w-md">
      <div class="flex flex-col">
        <h1 class="font-semibold text-xl">Member Info</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Member ign, stats, and growth rate
        </span>
      </div>

      <form class="gap-4 grid grid-cols-12 w-full" @submit.prevent="() => {
        console.log('BORET :: ', errors)
        onSubmit()
      }">
        <FormField v-slot="{ field }" name="name">
          <FormItem class="flex flex-col gap-1 col-span-12">
            <FormLabel class="form-label">Name</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" placeholder="pisot" required :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.name }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="class">
          <FormItem class="flex flex-col gap-1 col-span-8">
            <FormLabel class="form-label">Class</FormLabel>
            <FormControl>
              <Select v-bind="field" :disabled="isLoading">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="Character Advancement" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem v-for="(label, value) in CLASSES" :key="value" :value="value">
                    {{ label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage>{{ errors.class }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="grade">
          <FormItem class="flex flex-col gap-1 col-span-4">
            <FormLabel class="form-label">Grade</FormLabel>
            <FormControl>
              <Select v-bind="field" :disabled="isLoading">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="—" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem v-for="(grade, index) in 5" :key="index" :value="grade">
                    {{ grade }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormControl>

            <FormMessage>{{ errors.class }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="stat_atk">
          <FormItem class="flex flex-col gap-1 col-span-4">
            <FormLabel class="form-label">Damage</FormLabel>
            <FormControl>
              <Input type="number" v-bind="field" placeholder="—" :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.stat_atk }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="stat_def">
          <FormItem class="flex flex-col gap-1 col-span-4">
            <FormLabel class="form-label">Defense</FormLabel>
            <FormControl>
              <Input type="number" v-bind="field" placeholder="—" :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.stat_def }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="stat_acc">
          <FormItem class="flex flex-col gap-1 col-span-4">
            <FormLabel class="form-label">Accuracy</FormLabel>
            <FormControl>
              <Input type="number" v-bind="field" placeholder="—" :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.stat_acc }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="growth_rate">
          <FormItem class="flex flex-col gap-1 col-span-12">
            <FormLabel class="form-label">Growth Rate</FormLabel>
            <FormControl>
              <Input type="number" v-bind="field" placeholder="Character Growth Rate" :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.growth_rate }}</FormMessage>
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