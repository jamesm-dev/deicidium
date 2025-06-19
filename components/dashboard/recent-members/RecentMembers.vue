<script setup lang="ts">
import type { ColumnFiltersState, PaginationState, SortingState } from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-vue-next'

import { h, ref } from 'vue'
import { cn, valueUpdater } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CLASSES } from '@/types/enum'

const { members, isLoading } = useMembers({ sort: 'desc' })

const columnHelper = createColumnHelper<Member>()

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => h('div', { class: 'min-w-[200px]' }, row.getValue('name')),
  }),
  columnHelper.accessor('class', {
    header: () => h('div', { class: '!px-0 !bg-transparent !text-white' }, 'Class'),
    cell: ({ row }) => h('div', { class: '' }, CLASSES[row.getValue('class') as keyof typeof CLASSES]),
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Added On', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => h('div', { class: '' }, new Date(row.getValue('created_at')).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const pagination = ref<PaginationState>({
  pageIndex: 0,
  pageSize: 6, // Set to 5 rows per page
})

const table = useVueTable({
  data: members,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onPaginationChange: updaterOrValue => valueUpdater(updaterOrValue, pagination),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get pagination() { return pagination.value },
  },
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2">
      <Input class="bg-white border max-w-sm" placeholder="Search members..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value=" table.getColumn('name')?.setFilterValue($event)" />
    </div>

    <div class="mt-4">
      <Table>
        <TableHeader class="bg-primary text-white">
          <TableRow v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <TableHead v-for="header in headerGroup.headers" :key="header.id" :data-pinned="header.column.getIsPinned()"
              :class="cn(
                { 'sticky bg-background/95': header.column.getIsPinned() },
                header.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
              )">
              <FlexRender v-if="!header.isPlaceholder" :render="header.column.columnDef.header"
                :props="header.getContext()" />
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <template v-if="isLoading">
            <TableRow v-for="i in 5" :key="i">
              <TableCell v-for="j in columns.length" :key="j">
                <Skeleton class="w-[250px] h-4" />
              </TableCell>
            </TableRow>
          </template>

          <template v-else-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id" :data-pinned="cell.column.getIsPinned()"
                  :class="cn(
                    { 'sticky bg-background/95': cell.column.getIsPinned() },
                    cell.column.getIsPinned() === 'left' ? 'left-0' : 'right-0',
                  )">
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </TableCell>
              </TableRow>
              <TableRow v-if="row.getIsExpanded()">
                <TableCell :colspan="row.getAllCells().length">
                  {{ JSON.stringify(row.original) }}
                </TableCell>
              </TableRow>
            </template>
          </template>

          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex justify-end items-center space-x-2 py-4">
      <div class="space-x-2">
        <Button variant="outline" size="sm" :disabled="!table.getCanPreviousPage()" @click="table.previousPage()">
          <ChevronLeft />
        </Button>

        <Button variant="outline" size="sm" :disabled="!table.getCanNextPage()" @click="table.nextPage()">
          <ChevronRight />
        </Button>
      </div>
    </div>
  </div>
</template>