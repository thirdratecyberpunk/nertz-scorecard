# Nertz Rules

Summarised from the [Pagat rules for Nerts / Pounce / Racing Demon](https://www.pagat.com/patience/nerts.html)
(also known as Nertz, Pounce, Racing Demon, Peanuts, Squeal or Scrooge). See that page for the full
description — this is a condensed reference for scorekeeping purposes.

## Overview

Nertz is a competitive patience game for two or more players, each playing with their own 52-card deck
(each deck needs a different back design). Players play simultaneously, racing to empty their "Nertz pile"
by building cards onto shared foundation piles in the common area.

## Setup

Each player deals:

- A **Nertz pile** of 13 cards (12 face down, 1 face up on top).
- Four **work piles**, one card each, face up.
- The rest of their deck becomes their **stock**, turned over three at a time onto a **waste pile**.

## Play

- There are no turns — everyone plays at once, as fast as they like.
- Work piles are built down in rank, alternating colour (e.g. red 6 on black 7).
- The top card of the Nertz pile, the exposed card of each work pile, and the top card of the waste pile
  can all be played onto foundations in the common area.
- Foundations start at Ace and build up by suit to King. Any player may play on any foundation.
- A player may only touch their own tableau, and may only move cards into the shared common area — never
  take cards out of it or touch another player's tableau.
- When a player's Nertz pile empties, they may call **"Nerts!"** (or "Pounce!"), which ends the round
  immediately (cards already mid-move may finish). They don't have to call it right away — they can keep
  playing to improve their score further.
- If every player gets stuck with no legal moves, the round also ends and is scored as usual.

## Scoring (official)

At the end of a round:

- **+1 point** for every card a player got into the common area (their own cards on the foundations).
- **-2 points** for every card left in a player's Nertz pile — except the player who called Nerts, whose
  pile is empty by definition and so has nothing to deduct.
- If the round ended because everyone got stuck (no one called Nerts), every player deducts for their
  remaining Nertz pile as normal.

Further rounds are played until one or more players' cumulative scores reach or pass an agreed **target
score** (Pagat suggests 100 as typical). The player with the highest score at that point wins.

## Common scoring variations (Pagat)

These aren't part of the base rules but are widely used house rules:

- **Pounce/Nerts bonus** — award a flat 25 points to the player who called "Nerts!"/"Pounce!" that round.
- **Lighter pile penalty** — deduct only 1 point per remaining Nertz card instead of 2.
- **Per-hand scoring** — instead of accumulating, treat each round as a standalone event won by whoever
  scored highest that round.

## House rule used in this app: King bonus

Pagat's rules don't mention a King-specific bonus. This app supports an optional **house rule**: award a
configurable bonus for every King a player plays to a foundation during a round. Enable/disable and set
the bonus value when setting up a game.

## How this app implements scoring

Configured per game at setup:

- **Target score** — 50, 75 or 100. First round that takes a player's total to/past this ends the game.
- **Mercy score** — 50, 75 or 100. If any player's total drops to or below the negative of this value, the
  game also ends early (a "mercy rule" for a badly losing player).
- **Nertz pile deduction** — 1 or 2 points per card remaining, per the Pagat variation above.
- **Pounce/Nerts caller bonus** — optional flat bonus for the player who called Nerts that round (inferred
  from whichever player is recorded with 0 cards remaining, if any).
- **King bonus** (house rule) — optional flat bonus per King played to the centre that round.

Each round, for every player the scorecard records: cards remaining in their Nertz pile, cards they played
to the centre, and how many of those were Kings. The per-round score is:

```
round score = cardsPlayedToCentre
            - cardsRemaining × nertsPileDeductionPerCard
            + (kingBonusEnabled ? kingsPlayed × kingBonusPoints : 0)
            + (pounceBonusEnabled && calledNerts ? pounceBonusPoints : 0)
```

Once the target or mercy threshold is crossed, the game ends and final standings are shown in order, with
the highest cumulative score declared the winner.
