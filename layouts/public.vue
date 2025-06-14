<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'

interface NuxtImgInstance {
  $el?: HTMLImageElement
}

const crowRef = ref<NuxtImgInstance | null>(null)
const clemensRef = ref<NuxtImgInstance | null>(null)
let isInitialized = false

const handleMouseMove = (e: MouseEvent) => {
  if (!isInitialized) return

  const crow = crowRef.value?.$el
  const clemens = clemensRef.value?.$el

  if (!crow || !clemens) {
    console.warn('Image refs not found', { crow, clemens })
    return
  }

  try {
    const { clientX, clientY } = e
    const { innerWidth, innerHeight } = window

    // Calculate mouse position relative to center of screen (-1 to 1)
    const x = (clientX / innerWidth) * 2 - 1
    const y = (clientY / innerHeight) * 2 - 1

    // Apply different movement ranges for each image
    crow.style.transform = `translate(${x * 20}px, ${y * 20}px)`
    clemens.style.transform = `translate(${x * -30}px, ${y * -30}px)`
  } catch (error) {
    console.error('Error in handleMouseMove:', error, { crow, clemens })
  }
}

const initializeParallax = async () => {
  await nextTick()

  // Wait a bit more to ensure NuxtImg is fully mounted
  await new Promise(resolve => setTimeout(resolve, 100))

  const crow = crowRef.value?.$el
  const clemens = clemensRef.value?.$el

  if (crow && clemens) {
    console.log('Parallax initialized successfully')
    isInitialized = true
    window.addEventListener('mousemove', handleMouseMove)
  } else {
    console.warn('Image refs not available after mount', { crow, clemens })
  }
}

onMounted(() => {
  initializeParallax()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<template>
  <main class="flex gap-2 w-full">
    <div class="relative bg-neutral-100 w-2/3 h-full min-h-screen max-h-screen overflow-hidden">
      <NuxtImg src="/assets/images/gameworld-background.webp" width="1920" height="1080"
        class="top-0 left-0 absolute w-full h-full object-cover" />

      <NuxtImg ref="crowRef" src="/assets/images/gameworld-crow.webp" width="900" height="1200"
        class="-bottom-10 left-10 absolute w-[455px] h-[600px] object-cover" />

      <NuxtImg ref="clemensRef" src="/assets/images/gameworld-clemens.webp" width="1400" height="1800"
        class="-right-10 -bottom-10 z-[3] absolute w-[635px] h-[830px] object-cover" />

      <div
        class="top-1/2 left-1/2 z-[2] absolute rounded-full w-[526px] h-[526px] overflow-hidden transform-gpu -translate-x-1/2 -translate-y-1/2">
        <div class="bottom-0 left-0 absolute bg-black/50 w-full h-full">
          <video src="/assets/gameworld-pc.mp4" class="w-full h-full object-cover" autoplay muted loop />
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center w-1/3 h-full min-h-screen">
      <slot />
    </div>
  </main>
</template>

<style scoped></style>