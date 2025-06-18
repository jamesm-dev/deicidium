<script setup lang="ts">
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage: boolean;
}

const route = useRoute();

// Generate breadcrumb items based on the current route
const breadcrumbItems = computed(() => {
  const pathSegments = route.path.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [];

  // Always add home as the first item
  // items.push({
  //   label: 'Dashboard',
  //   href: '/',
  //   isCurrentPage: pathSegments.length === 0
  // });

  // Build up the path and add items for each segment
  let currentPath = '';
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    items.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: currentPath,
      isCurrentPage: index === pathSegments.length - 1
    });
  });

  return items;
});
</script>

<template>
  <SidebarProvider>
    <AppSidebar />

    <main class="flex flex-col gap-2 bg-contain bg-no-repeat bg-top px-4 py-2 w-full"
      style="background-image: url('/assets/images/contents.webp');">
      <div class="flex items-center gap-2">
        <SidebarTrigger />

        <div class="me-2 border-neutral-400/50 border-l h-4" />

        <Breadcrumb>
          <BreadcrumbList>
            <template v-for="(item, index) in breadcrumbItems" :key="item.href">
              <BreadcrumbItem>
                <template v-if="item.isCurrentPage">
                  <BreadcrumbPage class="font-mono text-white text-base">{{ item.label }}</BreadcrumbPage>
                </template>
                <template v-else>
                  <BreadcrumbLink :href="item.href">
                    {{ item.label }}
                  </BreadcrumbLink>
                </template>
              </BreadcrumbItem>
              <BreadcrumbSeparator v-if="index < breadcrumbItems.length - 1" />
            </template>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <slot />
    </main>
  </SidebarProvider>
</template>

<style scoped></style>