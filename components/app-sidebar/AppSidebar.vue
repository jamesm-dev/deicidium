<script setup lang="ts">
import { Calendar, Ellipsis, Home, Inbox, Settings2 } from "lucide-vue-next"
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

// Menu items.  
const managementItems = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Members",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Events",
    url: "#",
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
          ⚔️
        </div>

        <div class="flex flex-col">
          <span class="font-semibold text-lg leading-tight">Deicidium</span>
          <span class="text-neutral-500 text-sm">SEA104 Knight</span>
        </div>
      </div>
    </SidebarHeader>

    <SidebarContent>
      <SidebarGroup>
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
            <SidebarMenuItem v-for="item in otherItems" :key="item.title">
              <SidebarMenuButton asChild>
                <NuxtLink :href="item.url">
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NuxtLink href="#">
                  <Ellipsis />
                  <span>More</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  </Sidebar>
</template>