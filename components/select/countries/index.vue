<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
})

const countries = await useCountries()
const emit = defineEmits(['update:modelValue'])

const modelValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

</script>

<template>
  <Select v-model="modelValue" :disabled="disabled" :required="required">
    <SelectTrigger class="w-full">
      <SelectValue placeholder="Select a country" />
    </SelectTrigger>

    <SelectContent>
      <SelectItem v-for="country in countries" :key="country.code" :value="country.code">
        <img :src="country.flag" alt="" class="inline mr-2 w-5 h-4" />
        {{ country.name }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>

<style scoped></style>
