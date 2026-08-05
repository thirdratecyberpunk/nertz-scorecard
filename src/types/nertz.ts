export type TargetScore = 50 | 75 | 100
export type MercyScore = 50 | 75 | 100
export type NertsPileDeduction = 1 | 2

export interface Player {
  id: string
  name: string
}

export interface GameConfig {
  targetScore: TargetScore
  mercyScore: MercyScore
  nertsPileDeduction: NertsPileDeduction
  kingBonusEnabled: boolean
  kingBonusPoints: number
  pounceBonusEnabled: boolean
  pounceBonusPoints: number
}

export interface RoundEntry {
  playerId: string
  cardsRemaining: number
  cardsPlayedToCentre: number
  kingsPlayed: number
  calledNerts: boolean
}

export interface Round {
  roundNumber: number
  entries: RoundEntry[]
}

export interface PlayerStanding {
  player: Player
  roundScore: number
  total: number
}
