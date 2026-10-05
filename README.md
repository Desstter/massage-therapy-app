# Massage Therapy App

An interactive reference and study tool for massage therapy practitioners and students. Built with React, TypeScript, and Tailwind CSS.

## Overview

The app provides a structured learning environment covering anatomy, techniques, clinical references, and study tools — all in one interface. It is organized around the major knowledge domains a massage therapist needs to master.

## Features

### Panels

| Panel | Description |
|-------|-------------|
| **Anatomy Explorer** | Visual exploration of muscles, nerve paths, and fascial lines |
| **Body Regions** | Region-by-region breakdown of anatomical structures |
| **Technique Library** | Searchable catalog of massage techniques with descriptions |
| **Clinical Reference** | Contraindications, special populations, and safety guidelines |
| **Learning Roadmap** | Structured progression path for study |
| **Study Tools** | Flashcards and review exercises |

### Data Coverage

- Muscle origins, insertions, and actions
- Nerve pathways
- Fascial lines (Anatomy Trains-inspired)
- Contraindications and precautions
- Special populations (pregnancy, elderly, athletes, etc.)
- Technique descriptions and indications

## Tech Stack

- **React 19** with TypeScript
- **Vite** — build tool and dev server
- **Tailwind CSS** — styling
- **Framer Motion** — animations
- **Lucide React** — icons
- **Vitest** — unit testing
- **Three.js / WebGL** — interactive scientific 3D anatomy rendering

## 3D anatomy data

The anatomy explorer uses web-optimized derivatives of **BodyParts3D** from
the Database Center for Life Science (DBCLS). The viewer renders the complete
muscular context and exposes 146 named structures as 41 clinically useful,
selectable muscle groups.

The model assets are licensed separately under **CC BY-SA 2.1 Japan**. See
[`public/anatomy/ATTRIBUTION.md`](public/anatomy/ATTRIBUTION.md) for the full
attribution and scientific reference.

## Getting Started

```bash
# Clone the repo
git clone https://github.com/Desstter/massage-therapy-app.git
cd massage-therapy-app

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run lint` | Lint source files |

## Project Structure

```
src/
├── components/
│   ├── layout/         # App shell and navigation
│   ├── panels/         # Feature panels (anatomy, techniques, etc.)
│   └── shared/         # Reusable UI components
├── data/               # Static data (muscles, techniques, flashcards...)
├── hooks/              # Custom React hooks
├── store/              # State management
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## Code license

Application code: MIT. Anatomical model assets: CC BY-SA 2.1 Japan.
