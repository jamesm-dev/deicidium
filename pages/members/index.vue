<script setup lang="ts">
import { MemberList } from '@/components/members/member-list';
import { UserPlus } from 'lucide-vue-next';

const state = ref({
  memberCreate: false,
  memberUpdate: false,
  member: null as Member | null,
})

const { refetch } = useMembers()

const handleMemberUpdate = () => {
  state.value.memberUpdate = false
  state.value.member = null
  refetch()
}

const computedMember = computed(() => state.value.member)

</script>

<template>
  <div class="flex flex-col gap-2 mx-auto pt-4 container">
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <h1 class="font-semibold text-xl">Guild Members</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Manage your guild members
        </span>
      </div>

      <Button class="border-black" @click="state.memberCreate = true">
        <UserPlus />
        <span>Add Member</span>
      </Button>
    </div>

    <div class="bg-neutral-400/10 mt-4 p-10">
      <MemberList :on-member-update="(member) => {
        state.memberUpdate = true
        state.member = member
      }" />
    </div>

    <DialogMemberCreate :open="state.memberCreate" @toggle="state.memberCreate = !state.memberCreate" />
    <DialogMemberUpdate :open="state.memberUpdate" :member="computedMember ?? undefined" @toggle="handleMemberUpdate" />
  </div>
</template>

<style scoped></style>