<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import type { Database } from '@/types/database'
import { CLASSES } from '@/types/enum'

const supabase = useSupabaseClient<Database>()

const props = defineProps({
  open: {
    type: Boolean,
    default: false
  },
  member: {
    type: Object as PropType<Member>,
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
  name: z.string().min(1, { message: 'Please enter a name' }),
  class: z.string().min(1, { message: 'Please select a class' }),
  stat_atk: z.number().optional(),
  stat_def: z.number().optional(),
  stat_acc: z.number().optional(),
  growth_rate: z.string().optional(),
  grade: z.number().optional(),
})

const { handleSubmit, errors, resetForm, setFieldValue } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    name: '',
    class: '',
    stat_atk: 0,
    stat_def: 0,
    stat_acc: 0,
    growth_rate: '',
    grade: 0,
  },
})

// Watch both the member prop and dialog open state
watch([() => props.member, () => props.open], ([newMember, isOpen]) => {
  if (newMember && isOpen) {
    setFieldValue('name', newMember.name)
    setFieldValue('class', newMember.class)
    setFieldValue('grade', newMember.grade)
    setFieldValue('stat_atk', Number(newMember.stat_atk))
    setFieldValue('stat_def', Number(newMember.stat_def))
    setFieldValue('stat_acc', Number(newMember.stat_acc))
    setFieldValue('growth_rate', newMember.growth_rate)
  }
}, { immediate: true })

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  const { name, class: characterClass, stat_atk, stat_def, stat_acc, growth_rate, grade } = values

  const { error } = await supabase.from('members').update({
    guild: props.member.guild,
    name,
    class: characterClass,
    stat_atk,
    stat_def,
    stat_acc,
    growth_rate,
    grade,
  }).eq('id', props.member.id)

  if (error) {
    toast.error('Uh oh! Something went wrong.', {
      description: error.message,
    })

    isLoading.value = false
    return
  }

  toast.success('Member Updated', {
    description: 'Member has been updated.',
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
        <h1 class="font-semibold text-xl">Member Update</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Update member information
        </span>
      </div>

      <form class="gap-4 grid grid-cols-12 w-full" @submit.prevent="onSubmit">
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
              <Select :model-value="field.value" @update:modelValue="field.onChange" :disabled="isLoading">
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
              <Select :model-value="field.value" @update:modelValue="field.onChange" :disabled="isLoading">
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

            <FormMessage>{{ errors.grade }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="stat_atk">
          <FormItem class="flex flex-col gap-1 col-span-4">
            <FormLabel class="form-label">Damage</FormLabel>
            <FormControl>
              <Input type="number" :model-value="field.value" @update:modelValue="field.onChange" placeholder="—"
                :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.stat_atk }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="stat_def">
          <FormItem class="flex flex-col gap-1 col-span-4">
            <FormLabel class="form-label">Defense</FormLabel>
            <FormControl>
              <Input type="number" :model-value="field.value" @update:modelValue="field.onChange" placeholder="—"
                :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.stat_def }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="stat_acc">
          <FormItem class="flex flex-col gap-1 col-span-4">
            <FormLabel class="form-label">Accuracy</FormLabel>
            <FormControl>
              <Input type="number" :model-value="field.value" @update:modelValue="field.onChange" placeholder="—"
                :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.stat_acc }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="growth_rate">
          <FormItem class="flex flex-col gap-1 col-span-12">
            <FormLabel class="form-label">Growth Rate</FormLabel>
            <FormControl>
              <Input type="text" :model-value="field.value" @update:modelValue="field.onChange"
                placeholder="Character Growth Rate" :disabled="isLoading" />
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