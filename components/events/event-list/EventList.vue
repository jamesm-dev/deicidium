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
import type { DungeonEvent } from '@/composables/useEvents'
import { DUNGEONS } from '@/types/enum'
import { Badge } from '@/components/ui/badge'
import moment from 'moment'

interface EventWithTags extends DungeonEvent {
  tags: string[]
}

const props = defineProps<{
  onEventUpdate?: (event: DungeonEvent) => void
  onEventDelete?: (event: DungeonEvent) => void
}>()

const { events, isLoading } = useEvents()

const eventsWithTags = computed(() => events.value.map((event: DungeonEvent) => ({ ...event, tags: ['frozen tear', 'rare scroll', 'tier 2 rare item'] })))

const columnHelper = createColumnHelper<EventWithTags>()

const columns = [
  columnHelper.accessor('type', {
    header: ({ column }) => {
      return h(Button, {
        class: '!px-0 !bg-transparent !text-white',
        variant: 'ghost',
        onClick: () => column.toggleSorting(column.getIsSorted() === 'asc'),
      }, () => ['Dungeon', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => h('div', { class: 'min-w-[200px]' }, DUNGEONS[row.getValue('type') as keyof typeof DUNGEONS]),
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
      }, () => ['Participants', h(ChevronsUpDown, { class: 'ml-2 max-w-[10px] max-h-[10px]', })])
    },
    cell: ({ row }) => {
      const participants = row.getValue('participants') as Array<Participant> ?? []
      const enabledCount = participants.filter(participant => participant.enabled).length
      const totalCount = participants.length
      const percentage = totalCount > 0 ? (enabledCount / totalCount) * 100 : 0

      let iconColor = 'text-green-500'

      if (percentage < 40) {
        iconColor = 'text-red-500'
      } else if (percentage < 60) {
        iconColor = 'text-yellow-500'
      }

      return h('div', { class: 'flex items-center gap-4' }, [
        h(Users, { class: `${iconColor} max-w-4 max-h-4` }),
        h('span', { class: '' }, `${enabledCount} / ${totalCount}`),
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
  columnHelper.accessor('tags', {
    header: () => h('div', { class: '!px-0 !bg-transparent !text-white' }, 'Tags'),
    cell: ({ row }) => h('div', { class: 'flex flex-wrap gap-2' }, (row.getValue('tags') as string[] ?? []).map((tag) => {
      const formattedTag = (param: string) => {
        if (param === 'frozen tear') return 'FT'
        if (param === 'rare scroll') return 'SCROLL'
        if (param === 'tier 2 rare item') return 'T2'
        return param
      }

      return h(Badge, { class: 'font-mono text-[10px] uppercase' }, formattedTag(tag))
    })),
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
              onClick: () => props.onEventUpdate?.(row.original),
            }, () => [
              h(Pencil, { class: 'mr-2 h-4 w-4' }),
              'Edit'
            ]),
            h(DropdownMenuItem, {
              class: 'text-red-600',
              onClick: () => props.onEventDelete?.(row.original),
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
  data: eventsWithTags,
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
        :model-value="table.getColumn('type')?.getFilterValue() as string"
        @update:model-value="table.getColumn('type')?.setFilterValue($event)" />
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