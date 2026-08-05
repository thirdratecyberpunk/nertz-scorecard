<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { GameConfig, Player, RoundEntry } from '@/types/nertz'

const props = defineProps<{
  players: Player[]
  config: GameConfig
  roundNumber: number
}>()

const emit = defineEmits<{
  submit: [entries: RoundEntry[]]
}>()

interface DraftEntry {
  cardsRemaining: number
  cardsPlayedToCentre: number
  kingsPlayed: number
}

function freshDraft(): Record<string, DraftEntry> {
  const draft: Record<string, DraftEntry> = {}
  for (const player of props.players) {
    draft[player.id] = { cardsRemaining: 0, cardsPlayedToCentre: 0, kingsPlayed: 0 }
  }
  return draft
}

const draft = ref<Record<string, DraftEntry>>(freshDraft())
const nertsCallerId = ref<string>('')

function entryFor(playerId: string): DraftEntry {
  return draft.value[playerId]!
}

watch(
  () => props.roundNumber,
  () => {
    draft.value = freshDraft()
    nertsCallerId.value = ''
  },
)

const isValid = computed(() =>
  props.players.every((player) => {
    const entry = entryFor(player.id)
    return (
      entry.cardsRemaining >= 0 &&
      entry.cardsPlayedToCentre >= 0 &&
      entry.kingsPlayed >= 0 &&
      entry.kingsPlayed <= entry.cardsPlayedToCentre
    )
  }),
)

function handleSubmit() {
  if (!isValid.value) return

  const entries: RoundEntry[] = props.players.map((player) => {
    const entry = entryFor(player.id)
    return {
      playerId: player.id,
      cardsRemaining: entry.cardsRemaining,
      cardsPlayedToCentre: entry.cardsPlayedToCentre,
      kingsPlayed: entry.kingsPlayed,
      calledNerts: nertsCallerId.value === player.id,
    }
  })

  emit('submit', entries)
}
</script>

<template>
  <form class="mx-auto w-full max-w-2xl space-y-4" @submit.prevent="handleSubmit">
    <h2 class="text-lg font-semibold text-slate-800">Round {{ roundNumber }}</h2>

    <div
      v-for="player in players"
      :key="player.id"
      class="rounded-md border border-slate-200 p-4"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="font-medium text-slate-900">{{ player.name }}</h3>
        <label class="flex items-center gap-1.5 text-xs text-slate-600">
          <input
            v-model="nertsCallerId"
            type="radio"
            :value="player.id"
            name="nertsCaller"
            class="h-3.5 w-3.5 text-primary"
          />
          Called "Nerts!"
        </label>
      </div>
      <div class="grid grid-cols-3 gap-3">
        <div>
          <label class="block text-xs font-medium text-slate-500">Left in Nertz pile</label>
          <input
            v-model.number="entryFor(player.id).cardsRemaining"
            type="number"
            min="0"
            class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-slate-900 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500">Played to centre</label>
          <input
            v-model.number="entryFor(player.id).cardsPlayedToCentre"
            type="number"
            min="0"
            class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-slate-900 focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-500">Kings played</label>
          <input
            v-model.number="entryFor(player.id).kingsPlayed"
            type="number"
            min="0"
            class="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-slate-900 focus:border-primary focus:outline-none"
          />
        </div>
      </div>
    </div>

    <button
      type="submit"
      class="w-full rounded-md bg-primary px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="!isValid"
    >
      Submit round
    </button>
  </form>
</template>
