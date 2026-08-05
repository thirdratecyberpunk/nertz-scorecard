import { ref, computed } from 'vue'
import type { GameConfig, Player, Round, RoundEntry, PlayerStanding } from '@/types/nertz'

export type GamePhase = 'setup' | 'playing' | 'gameover'

function calculateRoundScore(entry: RoundEntry, config: GameConfig): number {
  let score = entry.cardsPlayedToCentre - entry.cardsRemaining * config.nertsPileDeduction

  if (config.kingBonusEnabled) {
    score += entry.kingsPlayed * config.kingBonusPoints
  }

  if (config.pounceBonusEnabled && entry.calledNerts) {
    score += config.pounceBonusPoints
  }

  return score
}

export function useGame() {
  const phase = ref<GamePhase>('setup')
  const players = ref<Player[]>([])
  const config = ref<GameConfig | null>(null)
  const rounds = ref<Round[]>([])

  const totals = computed<Record<string, number>>(() => {
    const result: Record<string, number> = {}
    for (const player of players.value) {
      result[player.id] = 0
    }
    if (!config.value) return result
    for (const round of rounds.value) {
      for (const entry of round.entries) {
        result[entry.playerId] = (result[entry.playerId] ?? 0) + calculateRoundScore(entry, config.value)
      }
    }
    return result
  })

  const standings = computed<PlayerStanding[]>(() => {
    const lastRound = rounds.value[rounds.value.length - 1]
    return [...players.value]
      .map((player) => {
        const lastEntry = lastRound?.entries.find((e) => e.playerId === player.id)
        const roundScore =
          lastEntry && config.value ? calculateRoundScore(lastEntry, config.value) : 0
        return {
          player,
          roundScore,
          total: totals.value[player.id] ?? 0,
        }
      })
      .sort((a, b) => b.total - a.total)
  })

  const winner = computed<PlayerStanding | null>(() => {
    if (phase.value !== 'gameover') return null
    return standings.value[0] ?? null
  })

  function startGame(playerNames: string[], gameConfig: GameConfig) {
    players.value = playerNames.map((name, index) => ({
      id: `player-${index}-${Date.now()}`,
      name,
    }))
    config.value = gameConfig
    rounds.value = []
    phase.value = 'playing'
  }

  function addRound(entries: RoundEntry[]) {
    if (!config.value) return

    rounds.value.push({
      roundNumber: rounds.value.length + 1,
      entries,
    })

    const currentTotals = totals.value
    const gameOver = Object.values(currentTotals).some(
      (total) => total >= config.value!.targetScore || total <= -config.value!.mercyScore,
    )

    if (gameOver) {
      phase.value = 'gameover'
    }
  }

  function resetGame() {
    phase.value = 'setup'
    players.value = []
    config.value = null
    rounds.value = []
  }

  return {
    phase,
    players,
    config,
    rounds,
    totals,
    standings,
    winner,
    startGame,
    addRound,
    resetGame,
  }
}
