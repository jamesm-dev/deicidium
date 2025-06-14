<script setup>
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { Loader2 } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

const { auth } = useSupabaseClient()
const user = useSupabaseUser()

const isLoading = ref(false)

// Add new refs for IP detection
const isDetectingLocation = ref(true)

// Add function to detect location
const detectLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()

    if (data.country_code) {
      setFieldValue('country', data.country_code)

      // If US, try to get zipcode
      if (data.country_code === 'US' && data.postal) {
        setFieldValue('zipcode', data.postal)
      }
    }
  } catch (error) {
    console.error('Error detecting location:', error)
  } finally {
    isDetectingLocation.value = false
  }
}

// Call detectLocation when component mounts
onMounted(() => {
  detectLocation()
})

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: z.string().min(3).max(20),
  country: z.string().min(1).max(2),
  zipcode: z.string().optional(),
})

const { values, handleSubmit, errors, setFieldValue, resetForm } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    email: '',
    password: '',
    username: '',
    country: '',
    zipcode: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  const { email, password, username, country, zipcode } = values

  const { data, error } = await auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        country,
        zipcode,
      },
      emailRedirectTo: `${useRuntimeConfig().public.baseUrl}/auth/login`,
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

  if (!data.user?.identities?.length) {
    toast({
      title: 'Uh oh! Something went wrong.',
      description: 'User is logged in',
      variant: 'destructive',
    })

    isLoading.value = false
    return
  }

  toast({
    title: 'Email verification sent',
    description: 'Please check your email for verification link',
    variant: 'success',
  })

  isLoading.value = false
  resetForm()

  navigateTo('/auth/login')
})

watchEffect(() => {
  if (user.value) {
    navigateTo('/auth/callback')
  }
})

watchEffect(() => {
  if (values.country !== 'US') {
    setFieldValue('zipcode', '')
  }
})

definePageMeta({
  layout: 'public',
})
</script>

<template>
  <div class="flex flex-col w-4/5 min-h-[660px] max-h-[660px]">
    <div class="flex justify-center items-center w-full">
      <NuxtImg src="/assets/images/bushido-labs-blk.png" width="100" height="100"
        class="w-[100px] h-[100px] object-cover" />
    </div>

    <form class="flex flex-col gap-4 p-10" @submit.prevent="onSubmit">
      <div class="gap-4 grid grid-cols-12">
        <FormField v-slot="{ field }" name="email">
          <FormItem class="flex flex-col gap-1 col-span-12">
            <FormLabel class="form-label">Email</FormLabel>
            <FormControl>
              <Input type="email" v-bind="field" placeholder="pisot@email.com" required :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.email }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="password">
          <FormItem class="flex flex-col gap-1 col-span-12">
            <FormLabel class="form-label">Password</FormLabel>
            <FormControl>
              <Input type="password" v-bind="field" placeholder="********" required :disabled="isLoading" />
            </FormControl>

            <FormMessage>{{ errors.password }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="username">
          <FormItem class="flex flex-col gap-1 col-span-12">
            <FormLabel class="form-label">Username</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" placeholder="username" required :disabled="isLoading" maxlength="20" />
            </FormControl>

            <FormMessage>{{ errors.username }}</FormMessage>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="country">
          <FormItem class="flex flex-col gap-1 col-span-8">
            <FormLabel class="form-label">Country</FormLabel>
            <FormControl>
              <SelectCountries :model-value="field.value" @update:modelValue="field.onChange" required
                :disabled="isLoading || isDetectingLocation" />
            </FormControl>
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="zipcode">
          <FormItem class="flex flex-col gap-1 col-span-4">
            <FormLabel class="form-label">Zipcode</FormLabel>
            <FormControl>
              <Input type="text" v-bind="field" placeholder="12345" required
                :disabled="isLoading || isDetectingLocation" maxlength="6" />
            </FormControl>
          </FormItem>
        </FormField>
      </div>

      <div class="flex flex-col gap-10 mt-6">
        <p class="text-sm">
          By submitting this form, I agree to Deicidium's <NuxtLink class="text-primary/80 text-sm" href="#">terms,
            privacy policy and cookie policy.</NuxtLink>
        </p>

        <div class="flex flex-col gap-4">
          <Button class="flex items-center gap-2.5 px-0 py-5 w-full text-base" type="submit" :disabled="isLoading">
            <span v-if="!isLoading">Create Account</span>
            <span v-else>
              <Loader2 class="min-w-6 max-w-6 min-h-6 max-h-6 animate-spin" />
            </span>
          </Button>

          <div class="flex justify-center items-center w-full">
            <span class="text-sm text-center">
              Already have an account?
            </span>

            <NuxtLink class="ms-1 text-primary/80 text-sm text-center" href="/auth/login">
              Login
            </NuxtLink>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
