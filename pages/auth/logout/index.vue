<script setup lang="ts">

const { auth } = useSupabaseClient()

watchEffect(async () => {
  await auth.signOut()
  navigateTo('/auth/login', { replace: true })
})

definePageMeta({
  layout: 'middleware',
})

</script>

<template>
  <div class="flex flex-col justify-center gap-10 p-4">
    <div class="flex justify-center items-center w-full">
      <NuxtImg src="/assets/images/bushido-labs-blk.png" width="100" height="100"
        class="w-[100px] h-[100px] object-cover animate-bounce" />
    </div>

    <p class="text-base text-center">Logging out...</p>
  </div>
</template>