<script setup lang="ts">
import { ref, computed } from 'vue'
import type { GameConfig, MercyScore, NertsPileDeduction, TargetScore } from '@/types/nertz'

const emit = defineEmits<{
  start: [playerNames: string[], config: GameConfig]
}>()

const playerNames = ref<string[]>(['', ''])
const targetScore = ref<TargetScore>(100)
const mercyScore = ref<MercyScore>(100)
const nertsPileDeduction = ref<NertsPileDeduction>(2)
const kingBonusEnabled = ref(false)
const kingBonusPoints = ref(10)
const pounceBonusEnabled = ref(false)
const pounceBonusPoints = ref(25)

const canAddPlayer = computed(() => playerNames.value.length < 8)
const canRemovePlayer = computed(() => playerNames.value.length > 2)

const trimmedNames = computed(() => playerNames.value.map((n) => n.trim()))
const canStart = computed(
  () => trimmedNames.value.every((n) => n.length > 0) && trimmedNames.value.length >= 2,
)

function addPlayer() {
  if (canAddPlayer.value) playerNames.value.push('')
}

function removePlayer(index: number) {
  if (canRemovePlayer.value) playerNames.value.splice(index, 1)
}

function handleSubmit() {
  if (!canStart.value) return

  const config: GameConfig = {
    targetScore: targetScore.value,
    mercyScore: mercyScore.value,
    nertsPileDeduction: nertsPileDeduction.value,
    kingBonusEnabled: kingBonusEnabled.value,
    kingBonusPoints: kingBonusPoints.value,
    pounceBonusEnabled: pounceBonusEnabled.value,
    pounceBonusPoints: pounceBonusPoints.value,
  }

  emit('start', trimmedNames.value, config)
}
</script>

<template>
  <form class="mx-auto max-w-xl space-y-8 p-6" @submit.prevent="handleSubmit">
    <div>
      <h1 class="text-3xl font-bold text-slate-900">New Nertz game</h1>
      <p class="mt-1 text-sm text-slate-500">Set up your players and scoring rules to begin.</p>
    </div>

    <section class="space-y-3">
      <h2 class="text-lg font-semibold text-slate-800">Players</h2>
      <div v-for="(name, index) in playerNames" :key="index" class="flex items-center gap-2">
        <input
          v-model="playerNames[index]"
          type="text"
          :placeholder="`Player ${index + 1} name`"
          class="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          class="shrink-0 rounded-md px-2 py-2 text-slate-400 hover:text-red-600 disabled:opacity-30"
          :disabled="!canRemovePlayer"
          @click="removePlayer(index)"
        >
          &times;
        </button>
      </div>
      <button
        type="button"
        class="rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-600 hover:border-primary hover:text-primary disabled:opacity-30"
        :disabled="!canAddPlayer"
        @click="addPlayer"
      >
        + Add player
      </button>
    </section>

    <section class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label class="block text-sm font-medium text-slate-700">Target score</label>
        <select
          v-model.number="targetScore"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none"
        >
          <option :value="50">50</option>
          <option :value="75">75</option>
          <option :value="100">100</option>
        </select>
        <p class="mt-1 text-xs text-slate-500">Game ends once a player reaches or passes this.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700">Mercy rule</label>
        <select
          v-model.number="mercyScore"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none"
        >
          <option :value="50">-50</option>
          <option :value="75">-75</option>
          <option :value="100">-100</option>
        </select>
        <p class="mt-1 text-xs text-slate-500">Game also ends if a player's score drops to this.</p>
      </div>

      <div>
        <label class="block text-sm font-medium text-slate-700">Nertz pile deduction</label>
        <select
          v-model.number="nertsPileDeduction"
          class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:border-primary focus:outline-none"
        >
          <option :value="2">-2 per card (standard)</option>
          <option :value="1">-1 per card (lighter)</option>
        </select>
      </div>
    </section>

    <section class="space-y-4">
      <h2 class="text-lg font-semibold text-slate-800">Custom scoring rules</h2>

      <div class="rounded-md border border-slate-200 p-4">
        <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input v-model="kingBonusEnabled" type="checkbox" class="h-4 w-4 rounded text-primary" />
          Bonus points for Kings played to the centre
        </label>
        <div v-if="kingBonusEnabled" class="mt-2 flex items-center gap-2">
          <input
            v-model.number="kingBonusPoints"
            type="number"
            min="0"
            class="w-24 rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 focus:border-primary focus:outline-none"
          />
          <span class="text-sm text-slate-500">points per King</span>
        </div>
      </div>

      <div class="rounded-md border border-slate-200 p-4">
        <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            v-model="pounceBonusEnabled"
            type="checkbox"
            class="h-4 w-4 rounded text-primary"
          />
          Bonus points for calling "Nerts!" first
        </label>
        <div v-if="pounceBonusEnabled" class="mt-2 flex items-center gap-2">
          <input
            v-model.number="pounceBonusPoints"
            type="number"
            min="0"
            class="w-24 rounded-md border border-slate-300 px-3 py-1.5 text-slate-900 focus:border-primary focus:outline-none"
          />
          <span class="text-sm text-slate-500">points for the caller</span>
        </div>
      </div>
    </section>

    <button
      type="submit"
      class="w-full rounded-md bg-primary px-4 py-3 font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-40"
      :disabled="!canStart"
    >
      Start game
    </button>
  </form>
</template>
