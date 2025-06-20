<script setup lang="ts">
import {
  DateFormatter,
  type DateValue,
  getLocalTimeZone,
  today,
} from '@internationalized/date'
import { CalendarIcon } from 'lucide-vue-next'

import { ref, watch } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const props = defineProps<{
  initialValue?: DateValue
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', payload: DateValue): void
}>()

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

const value = ref<DateValue>(props.initialValue ?? today(getLocalTimeZone()))

watch(value, (newValue) => {
  emit('update', newValue as DateValue)
})
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="outline" :class="cn(
        'w-full justify-start text-left font-normal border-t-0 border-x-0 shadow-none hover:bg-transparent',
        !value && 'text-muted-foreground',
      )">
        <CalendarIcon class="mr-2 w-4 h-4" />
        {{ value ? df.format(value.toDate(getLocalTimeZone())) : "Pick a date" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="p-0 w-auto">
      <Calendar v-model="value as DateValue" initial-focus :disabled="disabled" />
    </PopoverContent>
  </Popover>
</template>