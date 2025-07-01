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
import { ChevronLeft, ChevronRight, ChevronsUpDown, EllipsisVertical, Pencil, Trash2, Users } from 'lucide-vue-next'

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
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DUNGEONS } from '@/types/enum'
import moment from 'moment'
import { useWinners } from '@/composables/useWinners'
import type { WinnerEvent } from '@/composables/useWinners'
import type { Participant } from '@/types'

interface WinnerData {
  id: string
  name: string
  participants: Array<Participant>
  tag: string
  tag_color: string
  created_at: string
  raw_winner: WinnerEvent
}

const props = defineProps<{
  onUpdate?: (data: WinnerEvent) => void
  onDelete?: (data: WinnerEvent) => void
}>()

const route = useRoute()
const eventId = route.params.eventId as string

const { winners, isLoading } = useWinners({ eventId })

const winnersFormatted = computed(() => winners.value.map((winner: WinnerEvent) => ({
  id: winner.id,
  name: winner.events.type,
  participants: winner.participants,
  tag: winner.tags.name,
  tag_color: winner.tags.color,
  created_at: winner.created_at,
  raw_winner: winner,
})))

const columnHelper = createColumnHelper<WinnerData>()

const columns = [
  columnHelper.accessor('name', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Dungeon', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => h('div', { class: 'min-w-[200px]' }, DUNGEONS[row.getValue('name') as keyof typeof DUNGEONS]),
    filterFn: (row, id, value) => {
      const dungeonKey = row.getValue(id) as keyof typeof DUNGEONS
      const dungeonName = DUNGEONS[dungeonKey]
      return dungeonName.toLowerCase().includes(value.toLowerCase())
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dungeonKeyA = rowA.getValue(columnId) as keyof typeof DUNGEONS
      const dungeonKeyB = rowB.getValue(columnId) as keyof typeof DUNGEONS
      const dungeonNameA = DUNGEONS[dungeonKeyA]
      const dungeonNameB = DUNGEONS[dungeonKeyB]
      return dungeonNameA.localeCompare(dungeonNameB)
    },
  }),
  columnHelper.accessor('participants', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Winners', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => {
      const participants = row.getValue('participants') as Array<Participant> ?? []
      const winners = participants.filter(participant => participant.enabled)
      const winnersCount = winners.length

      return h('div', { class: 'flex items-start' }, [
        h('div', {
          class: 'flex items-center gap-2.5 cursor-pointer', onClick: () => {
            console.log(participants)
          }
        }, [
          h(Users, { class: 'text-neutral-500 max-w-4 max-h-4' }),
          h('span', { class: '' }, winnersCount),
        ]),
      ])
    },
    sortingFn: (rowA, rowB, columnId) => {
      const participantsA = rowA.getValue(columnId) as Array<Participant> ?? []
      const participantsB = rowB.getValue(columnId) as Array<Participant> ?? []
      const enabledCountA = participantsA.filter(participant => participant.enabled).length
      const enabledCountB = participantsB.filter(participant => participant.enabled).length
      return enabledCountA - enabledCountB
    },
  }),
  columnHelper.accessor('tag', {
    header: () => h('div', { class: '!px-0 !bg-transparent !text-white' }, 'Tags'),
    cell: ({ row }) => h('div', { class: 'flex flex-wrap gap-2' }, h('div', { class: 'font-mono text-[10px] uppercase text-white px-2 py-1', style: { backgroundColor: row.original.tag_color } }, row.original.tag)),
  }),
  columnHelper.accessor('created_at', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Completed On', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => h('div', { class: '' }, moment(row.getValue('created_at')).format('MMM D, YYYY')),
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
              onClick: () => props.onUpdate?.(row.original.raw_winner),
            }, () => [
              h(Pencil, { class: 'mr-2 h-4 w-4' }),
              'Edit'
            ]),
            h(DropdownMenuItem, {
              class: 'text-red-600',
              onClick: () => props.onDelete?.(row.original.raw_winner),
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
  data: winnersFormatted,
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
      <Input class="bg-white border max-w-sm" placeholder="Search events..."
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