<script setup lang="ts">
import type { PlayerStanding } from '@/types/nertz'

defineProps<{
  standings: PlayerStanding[]
  roundsPlayed: number
  targetScore: number
  mercyScore: number
}>()
</script>

<template>
  <section class="mx-auto w-full max-w-2xl">
    <div class="mb-2 flex items-baseline justify-between">
      <h2 class="text-lg font-semibold text-slate-800">Standings</h2>
      <p class="text-xs text-slate-500">
        Round {{ roundsPlayed }} played &middot; target {{ targetScore }} &middot; mercy -{{
          mercyScore
        }}
      </p>
    </div>
    <table class="w-full overflow-hidden rounded-md border border-slate-200 text-left text-sm">
      <thead class="bg-slate-100 text-slate-600">
        <tr>
          <th class="px-3 py-2">#</th>
          <th class="px-3 py-2">Player</th>
          <th class="px-3 py-2 text-right">Last round</th>
          <th class="px-3 py-2 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(standing, index) in standings"
          :key="standing.player.id"
          class="border-t border-slate-200"
          :class="index === 0 && standing.total > 0 ? 'bg-primary/5' : ''"
        >
          <td class="px-3 py-2 text-slate-500">{{ index + 1 }}</td>
          <td class="px-3 py-2 font-medium text-slate-900">{{ standing.player.name }}</td>
          <td class="px-3 py-2 text-right text-slate-600">
            {{ standing.roundScore >= 0 ? '+' : '' }}{{ standing.roundScore }}
          </td>
          <td class="px-3 py-2 text-right font-semibold text-slate-900">{{ standing.total }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
