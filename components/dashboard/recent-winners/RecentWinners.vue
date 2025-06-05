<script setup lang="ts">
import type {
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from '@tanstack/vue-table'
import {
  createColumnHelper,
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from '@tanstack/vue-table'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsUpDown } from 'lucide-vue-next'

import { h, ref } from 'vue'
import { cn, valueUpdater } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export interface Payment {
  id: string
  class: string
  name: string
  tags: string[]
}

const data: Payment[] = [
  {
    id: 'm5gr84i9',
    class: 'Grand General',
    name: 'jepaninja',
    tags: ['frozen tear', 'rare scroll', 'tier 2 rare item'],
  },
  {
    id: '3u1reuv4',
    class: 'Grand General',
    name: 'Trafalgar',
    tags: ['frozen tear', 'rare scroll', 'tier 2 rare item'],
  },
  {
    id: 'derv1ws0',
    class: 'Grand General',
    name: 'NitroZeus',
    tags: ['frozen tear', 'rare scroll', 'tier 2 rare item'],
  },
  {
    id: '5kma53ae',
    class: 'Grand General',
    name: '禍Calamity',
    tags: ['frozen tear', 'rare scroll', 'tier 2 rare item'],
  },
  {
    id: 'bhqecj4p',
    class: 'Grand General',
    name: 'Japayuki',
    tags: ['frozen tear', 'rare scroll', 'tier 2 rare item'],
  },
]

const columnHelper = createColumnHelper<Payment>()

const columns = [
  // columnHelper.display({
  //   id: 'select',
  //   header: ({ table }) => h(Checkbox, {
  //     'modelValue': table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate'),
  //     'onUpdate:modelValue': value => table.toggleAllPageRowsSelected(!!value),
  //     'ariaLabel': 'Select all',
  //   }),
  //   cell: ({ row }) => {
  //     return h(Checkbox, {
  //       'modelValue': row.getIsSelected(),
  //       'onUpdate:modelValue': value => row.toggleSelected(!!value),
  //       'ariaLabel': 'Select row',
  //     })
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // }),
  columnHelper.accessor('name', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Name', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => h('div', { class: 'min-w-[200px]' }, row.getValue('name')),
  }),
  columnHelper.accessor('class', {
    header: () => h('div', { class: '' }, 'Class'),
    cell: ({ row }) => h('div', { class: '' }, row.getValue('class')),
  }),
  columnHelper.accessor('tags', {
    header: 'Tags',
    cell: ({ row }) => h('div', { class: 'flex flex-wrap gap-2' }, (row.getValue('tags') as string[]).map((tag) => {
      const formattedTag = (param: string) => {
        if (param === 'frozen tear') return 'FT'
        if (param === 'rare scroll') return 'SCROLL'
        if (param === 'tier 2 rare item') return 'T2'
        return param
      }

      return h(Badge, { class: 'font-mono text-[10px] uppercase' }, formattedTag(tag))
    })),
  }),
]

const sorting = ref<SortingState>([])
const columnFilters = ref<ColumnFiltersState>([])
const columnVisibility = ref<VisibilityState>({})
const rowSelection = ref({})
const expanded = ref<ExpandedState>({})

const table = useVueTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getExpandedRowModel: getExpandedRowModel(),
  onSortingChange: updaterOrValue => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: updaterOrValue => valueUpdater(updaterOrValue, columnFilters),
  onColumnVisibilityChange: updaterOrValue => valueUpdater(updaterOrValue, columnVisibility),
  onRowSelectionChange: updaterOrValue => valueUpdater(updaterOrValue, rowSelection),
  onExpandedChange: updaterOrValue => valueUpdater(updaterOrValue, expanded),
  state: {
    get sorting() { return sorting.value },
    get columnFilters() { return columnFilters.value },
    get columnVisibility() { return columnVisibility.value },
    get rowSelection() { return rowSelection.value },
    get expanded() { return expanded.value },
  },
})
</script>

<template>
  <div class="w-full">
    <div class="flex items-center gap-2">
      <Input class="max-w-sm" placeholder="Search members..."
        :model-value="table.getColumn('name')?.getFilterValue() as string"
        @update:model-value=" table.getColumn('name')?.setFilterValue($event)" />

      <!-- <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" class="ml-auto">
            Columns
            <ChevronDown class="ml-2 w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem v-for="column in table.getAllColumns().filter((column) => column.getCanHide())"
            :key="column.id" class="capitalize" :model-value="column.getIsVisible()" @update:model-value="(value) => {
              column.toggleVisibility(!!value)
            }">
            {{ column.id }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu> -->
    </div>

    <div class="mt-2.5">
      <Table>
        <TableHeader>
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
          <template v-if="table.getRowModel().rows?.length">
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
      <!-- <div class="flex-1 text-muted-foreground text-sm">
        {{ table.getFilteredSelectedRowModel().rows.length }} of
        {{ table.getFilteredRowModel().rows.length }} row(s) selected.
      </div> -->

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