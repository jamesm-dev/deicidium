<script setup>
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'
import { Loader2, Mail } from 'lucide-vue-next'

const { auth } = useSupabaseClient()
const user = useSupabaseUser()

const isLoading = ref(false)
const isEmailLogin = ref(false)

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

const { handleSubmit, errors } = useForm({
  validationSchema: toTypedSchema(formSchema),
  initialValues: {
    email: '',
    password: '',
  },
})

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true

  const { error } = await auth.signInWithPassword({
    email: values.email,
    password: values.password,
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

  isLoading.value = false
  navigateTo('/auth/callback')
})

const handleGoogleLogin = async () => {
  // console.log(`${useRuntimeConfig().public.baseUrl}/auth/callback`)
  // return

  const { error } = await auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${useRuntimeConfig().public.baseUrl}/auth/callback`,
      // redirectTo: 'http://localhost:3000/auth/callback',
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
}

watchEffect(() => {
  if (user.value) {
    navigateTo('/auth/callback')
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

    <form class="flex flex-col gap-4 p-10 w-full" @submit.prevent="onSubmit">
      <FormField v-slot="{ field }" name="email">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="form-label">Email</FormLabel>
          <FormControl>
            <Input type="email" v-bind="field" placeholder="pisot@email.com" required :disabled="isLoading" />
          </FormControl>

          <FormMessage>{{ errors.email }}</FormMessage>
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="password">
        <FormItem class="flex flex-col gap-1">
          <FormLabel class="form-label">Password</FormLabel>
          <FormControl>
            <Input type="password" v-bind="field" placeholder="********" required :disabled="isLoading" />
          </FormControl>

          <FormMessage>{{ errors.password }}</FormMessage>

          <!-- <div :class="['flex items-center', errors.password ? 'mt-4' : 'mt-1']">
            <NuxtLink class="w-full text-primary/80 text-sm text-end" href="/auth/password/forgot">
              Forgot Password?
            </NuxtLink>
          </div> -->
        </FormItem>
      </FormField>

      <div class="flex flex-col gap-4 mt-6">
        <Button class="flex items-center gap-2.5 px-0 py-5 w-full text-base" type="submit" :disabled="isLoading">
          <span v-if="!isLoading">Login</span>
          <span v-else>
            <Loader2 class="min-w-6 max-w-6 min-h-6 max-h-6 animate-spin" />
          </span>
        </Button>

        <div class="flex justify-center items-center">
          <span class="text-sm text-center">
            Don't have an account?
          </span>

          <NuxtLink class="ms-1 text-primary/80 text-sm text-center" href="/auth/signup">
            Sign up
          </NuxtLink>
        </div>
      </div>
    </form>

    <div class="flex flex-col gap-2.5 px-10 w-full">
      <Button
        class="relative flex items-center gap-2.5 bg-primary hover:bg-primary/80 px-0 py-5 border-[1px] border-primary w-full overflow-hidden text-primary-foreground hover:text-white text-sm"
        type="submit" variant="outline" @click="isEmailLogin = true" :disabled="isLoading">
        <span class="flex-grow font-normal">Continue with Email</span>

        <div class="flex justify-center items-center bg-white w-[65px] h-[56px]">
          <Mail class="min-w-5 min-h-5 text-black" />
        </div>
      </Button>

      <Button
        class="relative flex items-center gap-2.5 bg-primary hover:bg-primary/80 px-0 py-5 border-[1px] border-primary w-full overflow-hidden text-primary-foreground hover:text-white text-sm"
        type="submit" variant="outline" @click="handleGoogleLogin" :disabled="isLoading">
        <span class="flex-grow font-normal">Continue with Google</span>

        <div class="flex justify-center items-center bg-white w-[65px] h-[56px]">
          <NuxtImg src="/assets/images/google-icon.svg" width="20px" />
        </div>
      </Button>
    </div>

    <DialogMagicLink :open="isEmailLogin" @toggle="isEmailLogin = false" />
  </div>
</template>

<style scoped></style>
