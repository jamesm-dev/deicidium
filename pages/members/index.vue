<script setup lang="ts">
import { MemberList } from '@/components/members/member-list';
import { UserPlus } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const supabase = useSupabaseClient()

const state = ref({
  memberCreate: false,
  memberUpdate: false,
  memberDelete: false,
  member: null as Member | null,
})

const { refetch } = useMembers()

const handleCloseUpdateDialog = () => {
  state.value.memberUpdate = false
  state.value.member = null
  refetch()
}

const handleLoadMember = (member: Member) => {
  state.value.memberUpdate = true
  state.value.member = member
}

const handleDeleteMember = async (member: Member) => {
  // state.value.memberDelete = true
  // state.value.member = member

  const { error } = await supabase.from('members').delete().eq('id', member.id)

  if (error) {
    toast.error('Error deleting member', {
      description: error.message,
    })
  } else {
    toast.success('Member deleted', {
      description: 'Member has been deleted.',
    })
    refetch()
  }
}

const computedMember = computed(() => state.value.member ?? undefined)

</script>

<template>
  <div class="flex flex-col gap-2 mx-auto pt-4 container">
    <div class="flex justify-between items-center">
      <div class="flex flex-col">
        <h1 class="font-semibold text-white text-3xl">Guild Members</h1>
        <span class="font-mono font-semibold text-neutral-500 text-sm">
          Manage your guild members
        </span>
      </div>

      <Button class="border-black" @click="state.memberCreate = true">
        <UserPlus />
        <span>Add Member</span>
      </Button>
    </div>

    <div class="mt-10">
      <MemberList :on-member-update="handleLoadMember" :on-member-delete="handleDeleteMember" />
    </div>

    <DialogMemberCreate :open="state.memberCreate" @toggle="state.memberCreate = !state.memberCreate" />
    <DialogMemberUpdate :open="state.memberUpdate" :member="computedMember" @toggle="handleCloseUpdateDialog" />
  </div>
</template>

<style scoped></style>