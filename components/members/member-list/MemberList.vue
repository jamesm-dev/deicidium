<script setup lang="ts">
import type { ColumnFiltersState, SortingState } from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronLeft, ChevronRight, ChevronsUpDown, Crosshair, EllipsisVertical, Pencil, ShieldHalf, Swords, Trash2, Trophy } from 'lucide-vue-next'

import { h, ref } from 'vue'
import { cn, valueUpdater } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useMembers } from '@/composables/useMembers'
import { Skeleton } from '@/components/ui/skeleton'
import { CLASSES } from '@/types/enum'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const props = defineProps<{
  onMemberUpdate?: (member: Member) => void
}>()

const { members, isLoading, refetch } = useMembers()

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
  columnHelper.accessor('stat_atk', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Damage', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => {
      const value = row.getValue('stat_atk')
      return value !== 0 ? h('div', { class: 'flex items-center gap-2' }, [
        h(Swords, { class: 'text-red-500 max-w-4 max-h-4' }),
        h('span', { class: '' }, String(value)),
      ]) : null
    },
  }),
  columnHelper.accessor('stat_def', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Defense', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => {
      const value = row.getValue('stat_def')
      return value !== 0 ? h('div', { class: 'flex items-center gap-2' }, [
        h(ShieldHalf, { class: 'text-blue-500 max-w-4 max-h-4' }),
        h('span', { class: '' }, String(value)),
      ]) : null
    },
  }),
  columnHelper.accessor('stat_acc', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Accuracy', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => {
      const value = row.getValue('stat_acc')
      return value !== 0 ? h('div', { class: 'flex items-center gap-2' }, [
        h(Crosshair, { class: 'text-neutral-500 max-w-4 max-h-4' }),
        h('span', { class: '' }, String(value)),
      ]) : null
    },
  }),
  columnHelper.accessor('growth_rate', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Growth Rate', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => {
      const value = row.getValue('growth_rate')
      return value && value != 0 ? h('div', { class: 'flex items-center gap-2' }, [
        h(Trophy, { class: 'text-yellow-500 max-w-4 max-h-4' }),
        h('span', { class: '' }, Number(value).toLocaleString('en-US')),
      ]) : null
    },
  }),
  columnHelper.accessor('grade', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Grade', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => h(Badge, { class: cn('font-mono uppercase text-white font-semibold', Number(row.getValue('grade')) >= 5 ? 'bg-green-500' : 'bg-yellow-500') }, row.getValue('grade')),
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
  columnHelper.display({
    id: 'actions',
    header: () => h('div', { class: 'text-center text-white' }, ''),
    cell: ({ row }) => h('div', { class: 'w-full flex items-center justify-center' }, [
      h(DropdownMenu, {}, {
        default: () => [
          h(DropdownMenuTrigger, {}, () =>
            h(Button, {
              variant: 'ghost',
              size: 'icon',
            }, () => h(EllipsisVertical, { class: 'w-4 h-4' }))
          ),
          h(DropdownMenuContent, {}, () => [
            h(DropdownMenuItem, {
              onClick: () => {
                props.onMemberUpdate?.(row.original)
              },
            }, () => [
              h(Pencil, { class: 'mr-2 h-4 w-4' }),
              'Edit'
            ]),
            h(DropdownMenuItem, {
              class: 'text-red-600',
              onClick: () => {
                // TODO: Implement delete functionality
                console.log('Delete member:', row.original)
                refetch()
              },
            }, () => [
              h(Trash2, { class: 'mr-2 h-4 w-4' }),
              'Delete'
            ]),
          ]),
        ],
      }),
    ]),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])

const table = useVueTable({
  data: members,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
  },
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2">
      <Input class="bg-white border max-w-sm" placeholder="Search members..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value="table.getColumn('name')?.setFilterValue($event)" />
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