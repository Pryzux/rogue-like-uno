# 🎴 Rogue-Like UNO

> _“Every victory makes the next round harder.”_  
A chaotic, endurance-based twist on UNO built with **React**, **TypeScript**, and **Tailwind CSS**.  
Created by **Maddie**, **Aarti**, and **Jared (Pryzux)**.

---

## 🌀 Concept

Rogue-Like UNO transforms the classic UNO experience into a **progressive survival challenge**.

Each round, you must choose **one Buff** 🟩 and **one Debuff** 🟥.  
If you win, you keep those modifiers and pick **two more** for the next round.  
Lose — and your run ends.

How many rounds can you survive before the debuffs stack too high?

---

## 🎮 Gameplay Loop

1. **Start a Match**
   - Play standard UNO against AI opponents.
2. **Pick Modifiers**
   - Choose one 🟩 Buff and one 🟥 Debuff before each new round.
3. **Survive & Stack**
   - Winning adds both modifiers to your active set.
   - Each round increases in complexity.
4. **Lose a Round**
   - Your run ends and your total number of survived rounds is recorded.

---

## 🧩 Modifiers

### 🟩 Buffs — Helpful Effects

| Name | Description |
|------|--------------|
| **Dev Buff** | Does nothing. Used for development testing. |
| **Reverse Momentum** | When you play a Reverse, take another turn immediately. |
| **Wild Surge** | Playing a Wild automatically skips the next player’s turn. |
| **+5 Card** | All Draw 4s become Draw 5s. |
| **+3 Card** | All Draw 2s become Draw 3s. |
| **Good Aim** | Choose which player your +2 applies to. |
| **Double Skip** | Skip 2 players instead of 1. |

---

### 🟥 Debuffs — Curses & Handicaps

| Name | Description |
|------|--------------|
| **Dev Debuff** | Does nothing. Used for development testing. |
| **Color Focus** | AI prefers to play cards matching the current color. |
| **Wild Instinct** | AI always picks the best wild color for itself. |
| **Sluggish Hands** | Every 3 turns, you automatically draw 1 extra card. |
| **Color Blind** | You can’t play Wilds until you have 3 or fewer cards. |
| **Draw Fatigue** | Each Draw 2 played against you adds +1 extra card. |
| **Lazy Dealer** | Start each match with 3 extra cards. |

---

## 🧠 Strategy Tips

- Some Buffs can counter Debuffs — choose wisely.
- Watch how AI behavior changes with certain modifiers.
- Build runs around synergy — not raw power.
- The deeper you go, the more chaotic it gets.

---

## 🧱 Built With

- ⚛️ [React](https://react.dev/) — Game UI and flow  
- 💙 [TypeScript](https://www.typescriptlang.org/) — Type-safe core logic  
- 🎨 [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) — Stylish, responsive components  
- 🧠 Custom Game Logic Engine — Handles rounds, AI, and modifiers  

---

## 👩‍💻 Contributors

| Name | Role |
|------|------|
| **Maddie** | Gameplay Design & UI |
| **Arthi** | Systems Architecture & Logic |
| **Jared (Pryzux)** | Core Game Engine & Project Lead |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Bun** or **Node.js** (v18+) installed.

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/rogue-like-uno.git
cd rogue-like-uno

# Install dependencies
bun install
# or
npm install

# Run locally
bun dev
# or
npm run dev

# Build for production
bun run build
# or
npm run build

