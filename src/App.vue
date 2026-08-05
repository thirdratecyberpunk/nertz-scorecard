<script setup lang="ts">
import { useGame } from '@/composables/useGame'
import GameSetup from '@/components/GameSetup.vue'
import GameScoreboard from '@/components/GameScoreboard.vue'
import RoundEntry from '@/components/RoundEntry.vue'
import GameOver from '@/components/GameOver.vue'

const { phase, players, config, rounds, standings, winner, startGame, addRound, resetGame } =
  useGame()
</script>

<template>
  <main class="min-h-screen bg-slate-50 py-10">
    <header class="mx-auto mb-8 max-w-2xl px-6 text-center">
      <h1 class="text-2xl font-bold text-slate-900">Nertz Scorecard</h1>
    </header>

    <GameSetup v-if="phase === 'setup'" @start="startGame" />

    <div v-else-if="phase === 'playing' && config" class="space-y-10 px-6">
      <GameScoreboard
        :standings="standings"
        :rounds-played="rounds.length"
        :target-score="config.targetScore"
        :mercy-score="config.mercyScore"
      />
      <RoundEntry
        :players="players"
        :config="config"
        :round-number="rounds.length + 1"
        @submit="addRound"
      />
    </div>

    <GameOver
      v-else-if="phase === 'gameover' && winner"
      :standings="standings"
      :winner="winner"
      @new-game="resetGame"
    />
  </main>
</template>
