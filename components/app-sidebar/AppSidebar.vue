<script setup lang="ts">
import { Calendar, Home, Settings2, LogOut, User } from "lucide-vue-next"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useGuilds } from '@/composables/useGuilds'

const { guilds } = useGuilds()

// Menu items.  
const managementItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Members",
    url: "/members",
    icon: User,
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
];

const otherItems = [
  {
    title: "Preferences",
    url: "#",
    icon: Settings2,
  },
];
</script>

<template>
  <Sidebar>
    <SidebarHeader>
      <div class="flex items-center gap-2">
        <div class="flex justify-center items-center bg-neutral-400/50 rounded size-14 aspect-square text-xl">
          {{ guilds?.[0]?.name ? '⚔️' : '💀' }}
        </div>

        <div class="flex flex-col">
          <span class="font-semibold text-lg leading-tight">{{ guilds?.[0]?.name ?? '—' }}</span>
          <span class="text-neutral-500 text-sm">{{ guilds?.[0]?.server ?? '—' }}</span>
        </div>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup v-if="Boolean(guilds?.[0]?.name)">
        <SidebarGroupLabel>Management</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem v-for="item in managementItems" :key="item.title">
              <SidebarMenuButton asChild>
                <NuxtLink :href="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarGroup>
        <SidebarGroupLabel>Settings</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <template v-if="Boolean(guilds?.[0]?.name)">
              <SidebarMenuItem v-for="item in otherItems" :key="item.title">
                <SidebarMenuButton asChild>
                  <NuxtLink :href="item.url">
                    <component :is="item.icon" />
                    <span>{{ item.title }}</span>
                  </NuxtLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </template>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NuxtLink href="/auth/logout">
                  <LogOut />
                  <span>Logout</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>