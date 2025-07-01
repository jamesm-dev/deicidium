<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'

const { auth } = useSupabaseClient()

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
  email: z.string().email(),
  captchaToken: z.string().min(1, { message: 'Please verify that you are human by completing the captcha.' }),
})

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    email: '',
    captchaToken: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  const { email, captchaToken } = values

  const { error } = await auth.signInWithOtp({
    email,
    options: {
      captchaToken,
    },
  })

  if (error) {
    toast({
      title: 'Uh oh! Something went wrong.',
      description: error.message,
      variant: 'destructive',
    })

    isLoading.value = false
    return
  }

  toast({
    title: 'Email sent',
    description: 'Please check your email for a magic link to sign in.',
    variant: 'success',
  })

  isLoading.value = false
  emit('toggle')
})

</script>

<template>
  <Dialog v-model:open="dialogOpen">
    <DialogContent class="flex flex-col gap-8 rounded-none sm:max-w-md">
      <form class="flex flex-col gap-4 w-full" @submit.prevent="onSubmit">
        <FormField v-slot="{ field }" name="email">
          <FormItem class="flex flex-col gap-1">
            <FormLabel class="form-label">Email</FormLabel>
            <FormControl>
              <Input type="email" v-bind="field" placeholder="pisot@email.com" required :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.email }}</FormMessage>
          </FormItem>
        </FormField>

        <div class="flex flex-col gap-4">
          <Button class="flex items-center gap-2.5 px-0 py-5 w-full text-base" type="submit" :disabled="isLoading">
            <span v-if="!isLoading">Send Magic Link</span>
            <span v-else>
              <Loader2 class="min-w-6 max-w-6 min-h-6 max-h-6 animate-spin" />
            </span>
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>