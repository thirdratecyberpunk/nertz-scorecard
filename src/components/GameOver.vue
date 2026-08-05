<script setup lang="ts">
import { onMounted } from 'vue'
import confetti from 'canvas-confetti'
import type { PlayerStanding } from '@/types/nertz'

defineProps<{
  standings: PlayerStanding[]
  winner: PlayerStanding
}>()

const emit = defineEmits<{
  newGame: []
}>()

function fireConfetti() {
  const duration = 2500
  const end = Date.now() + duration

  ;(function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 60, origin: { x: 0 } })
    confetti({ particleCount: 4, angle: 120, spread: 60, origin: { x: 1 } })
    if (Date.now() < end) requestAnimationFrame(frame)
  })()

  confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } })
}

onMounted(fireConfetti)
</script>

<template>
  <section class="mx-auto w-full max-w-xl space-y-6 p-6 text-center">
    <div>
      <p class="text-sm font-medium uppercase tracking-wide text-primary">Game over</p>
      <h1 class="mt-1 text-4xl font-bold text-slate-900">{{ winner.player.name }} wins!</h1>
      <p class="mt-1 text-slate-500">Final score: {{ winner.total }}</p>
    </div>

    <table class="w-full overflow-hidden rounded-md border border-slate-200 text-left text-sm">
      <thead class="bg-slate-100 text-slate-600">
        <tr>
          <th class="px-3 py-2">#</th>
          <th class="px-3 py-2">Player</th>
          <th class="px-3 py-2 text-right">Final score</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(standing, index) in standings"
          :key="standing.player.id"
          class="border-t border-slate-200"
          :class="index === 0 ? 'bg-primary/10 font-semibold' : ''"
        >
          <td class="px-3 py-2 text-slate-500">{{ index + 1 }}</td>
          <td class="px-3 py-2 text-slate-900">{{ standing.player.name }}</td>
          <td class="px-3 py-2 text-right text-slate-900">{{ standing.total }}</td>
        </tr>
      </tbody>
    </table>

    <button
      type="button"
      class="w-full rounded-md bg-primary px-4 py-3 font-semibold text-white transition"
      @click="emit('newGame')"
    >
      New game
    </button>
  </section>
</template>
