# ICC Men's Cricket World Cup 2027 — Tournament & Matchup Predictor

A modern, high-performance web application predicting team championship odds and head-to-head match outcomes for the **ICC Men's Cricket World Cup 2027** (ODI format, co-hosted by South Africa, Zimbabwe, and Namibia).

---

## Zero Cold Start Architecture

This app is built with a **pre-computed, fully static architecture** to eliminate backend cold-starts and server latency completely:

```
[ Cricsheet.org Match Data + ICC Rankings ]
                   │
                   ▼ (Node.js ETL Pipeline)
         [ Node 24 native node:sqlite ]
                   │
                   ▼ (Dynamic Elo Engine)
    [ 50,000 Monte Carlo Tournament Runs ]
                   │
                   ▼ (Bake to JSON)
            /client/public/data/*.json
                   │
                   ▼
      [ React (Vite + Tailwind CSS + Recharts) ]
                   │
                   ▼
          Deployed to Vercel (Edge CDN)
```

- **0 ms cold start**: No sleeping backend or server spin-up delays.
- **0 ms prediction latency**: Head-to-head probabilities and tournament simulations are pre-baked into static JSON.
- **$0 hosting cost**: Free on Vercel or Cloudflare Pages.

---

## Key Features

1. **Championship Odds Board**:
   - 50,000 Monte Carlo tournament simulations.
   - Win probabilities, semifinal qualifications, and group advancement rates.
   - Interactive bar chart distribution for top contenders.

2. **Interactive Matchup Predictor**:
   - Head-to-head matchup selector between any two competing nations.
   - Animated win probability split bar with Elo difference breakdown.
   - Historical head-to-head ODI record analysis.
   - Quick presets for major blockbuster fixtures (e.g. India vs Australia, India vs Pakistan, India vs New Zealand).

3. **In-Browser "What-If" Scenario Simulator**:
   - Live client-side Monte Carlo engine running 5,000 to 25,000 iterations directly on the user's CPU in under 100 ms.
   - Custom sliders for team Elo strength modifiers (-100 to +100 points) to test injuries, form slumps, or home advantage.
   - Presets for Host Nation Surge, Subcontinent Spin Dominance, and Favorite Injury scenarios.

4. **Official 4-Stage Tournament Bracket & Pick'em**:
   - **Stage 1 (Super Series)**: Opening mini-qualifier in Namibia.
   - **Stage 2 (Group Stage)**: 14 teams in two groups of 7 with projected standings.
   - **Stage 3 (Super 7 Phase)**: Single combined table with top cross-group qualifiers.
   - **Stage 4 (Knockouts & Final)**: Semifinals in Cape Town & Centurion, Grand Final at Wanderers Stadium, Johannesburg.
   - **Zero-DB Sharing**: Users can pick their own winners and copy a shareable URL that restores their custom bracket without a database.

5. **Tactical Host Venue Intelligence**:
   - Deep tactical profiles across the major tournament stadiums in South Africa, Zimbabwe, and Namibia.
   - Altitude impact, pitch characteristics, average first-innings scores, and toss trends.

6. **Detailed Team Profiles & Player Squads**:
   - Historical Elo trajectory line chart over past ODI encounters.
   - Chronological match form tracker with margin details.
   - Full player rosters, batting/bowling averages, and strike rates.

---

## Getting Started

### Prerequisites
- Node.js v22.5+ or v24+ (uses built-in `node:sqlite`, no C++ build tools or external databases required)

### Run the Web App Locally
```bash
# 1. Navigate to the project directory
cd icc-wc-predictor

# 2. Start the development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Re-running the Data Pipeline

To re-download historical match data from Cricsheet, recompute Elo ratings, and re-run the 50,000 tournament simulations:

```bash
# Run pipeline from project root
npm run pipeline

# Or re-seed and rebuild client in one go
npm run setup
```

---

## Deployment (Vercel)

1. Connect your repository to **Vercel**.
2. Set the build configuration:
   - **Framework Preset**: `Vite`
   - **Root directory**: `client`
   - **Build command**: `npm run build`
   - **Output directory**: `dist`
3. Click **Deploy**. Your site is globally deployed with instant edge response times, 0 cold starts, and zero chances of server crashing.
