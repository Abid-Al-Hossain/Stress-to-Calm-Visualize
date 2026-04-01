# Stress-to-Calm Visualizer

Stress-to-Calm Visualizer is a Next.js web application that symbolically visualizes how stress can affect a child's mental state and then guides the user toward calmer states through breathing, sound, guided imagery, and grounding-based support.

The project is built as an educational and demonstrative front-end experience. It is not a diagnostic tool, not a clinical system, and not a production-ready mental-health platform.

## Purpose

The app is designed to communicate difficult emotional states without graphic imagery. Instead of depicting violence directly, it uses:

- facial expression changes
- color and lighting shifts
- stress-tier transitions
- motion, distortion, and ambient visual cues
- guided calming techniques

The core product idea is:

1. ask the user a structured stress questionnaire
2. calculate a stress score from weighted responses
3. map that score to a symbolic stress tier
4. update a visualizer to reflect that state
5. offer tier-specific calming guidance

## Current Product Scope

This repository currently contains:

- a static Next.js App Router application
- a landing page with educational framing
- a modal stress survey
- a score-driven animated visualizer
- a tier-based intervention guide
- a demo register/login flow stored in browser `localStorage`

This repository does not currently contain:

- a backend
- a database
- real authentication
- user persistence beyond the browser
- encrypted credentials
- clinician review workflows
- analytics
- API routes

## Main User Flow

1. The user opens the home page.
2. The landing page explains the educational purpose of the project.
3. The user can optionally register or log in.
4. The user opens the survey by clicking `Answer Questions`.
5. The app presents 10 questions in a modal.
6. The app scores the first 5 questions and ignores the last 5 for numeric scoring.
7. The final score is capped at `100`.
8. The home page visualizer updates to match the assessed stress level.
9. The user can open `Get Solution` to view a tier-specific intervention modal.
10. The intervention modal offers four methods:
    - breathing
    - sound
    - visual
    - advice

## Feature Breakdown

### 1. Landing Page

The home page introduces the project, explains its educational framing, and presents the main interaction points.

It includes:

- an animated hero section
- the main stress visualizer
- project objectives cards
- an educational disclaimer
- calls to action for assessment and registration

Primary implementation:

- `src/app/page.tsx`
- `src/app/globals.css`

### 2. Stress Survey

The survey is a modal experience with bilingual question content. It is organized into four conceptual sections:

- Emotional State
- Physical Response
- Stress Perception
- Recovery and Coping

The survey contains 10 questions total.

Only the first 5 questions are numerically scored. Questions 6 to 10 capture preferences and reflective context, but do not change the final score.

Recent UX changes:

- reduced animation overhead for smoother scrolling and selection
- explicit fix for non-scored question selection persistence
- footer and scroll behavior adjusted so content no longer bleeds under controls

Primary implementation:

- `src/components/StressSurvey.tsx`

### 3. Stress Visualizer

The visualizer is the most technically ambitious part of the project. It uses an animated SVG face and supporting motion effects to represent increasing levels of stress.

As the stress score rises, the visual state changes through:

- facial morphing
- eyebrow tension
- eye openness and pupil behavior
- mouth curvature
- wrinkles
- sweat and tears at higher tiers
- background glow and color changes
- an EEG-like waveform display

The visualizer can run in two modes:

- demo mode with a manual slider
- assessment mode driven by the computed survey score

Primary implementation:

- `src/components/StressToCalmPreview.tsx`
- `src/types/flubber.d.ts`

### 4. Intervention Guide

The intervention guide is a modal that opens after the user receives a score. It maps that score to a stress tier and then offers four kinds of support.

#### Breathing

Guided breathing patterns vary by stress level, including:

- `4-4`
- `4-5`
- `4-2-6`
- `4-7`
- `4-8`

The breathing method also shows:

- the current phase
- the live cycle count
- a suggested short practice target
- a longer practice target

#### Sound

The sound section uses lightweight synthesized audio through the browser Web Audio API and also presents recommendations for sound environments such as:

- forest ambience
- ocean waves
- low ambient tones
- brown noise
- heartbeat-based audio

#### Visual

The visual method now functions as a guided-imagery / guided-visualization path. It presents:

- tier-matched calming scenes
- a short spoken-style imagery script
- supporting practice notes

Examples include:

- blue sky and clouds
- shoreline / flowing water imagery
- a calm internal light or circle
- a minimal dim-light safe image for higher stress

#### Advice

The advice method keeps short tier-specific reassurance prompts, but now also includes structured sensory grounding guidance:

- `5-4-3-2-1` style grounding for lower to moderate stress
- shorter `3-3-3` style grounding for high stress
- simplified orientation grounding for severe stress

The intervention modal was also restyled to better match the landing page’s calmer blue/teal visual language.

Primary implementation:

- `src/components/InterventionGuide.tsx`

### 5. Demo Authentication

The app includes register and login pages, but authentication is entirely front-end only.

Users are stored in `localStorage` under app-specific keys, and the current user is also stored locally. This makes the flow suitable for demonstration only.

Important limitations:

- passwords are not encrypted
- there is no server validation
- there are no protected backend resources
- clearing browser storage removes the local account state

Primary implementation:

- `src/services/auth.ts`
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/components/Navbar.tsx`

## Stress Scoring Model

The implemented scoring model sums weighted responses from the first five survey questions:

- Q1 Emotion: max `20`
- Q2 Body Response: max `25`
- Q3 Stress Persistence: max `30`
- Q4 World Perception: max `15`
- Q5 Visual Effect: max `10`

Formula:

```text
Stress Score = E + B + P + W + V
```

The score is then capped at `100`.

Primary implementation:

- `src/components/StressSurvey.tsx`

## Stress Range Source Of Truth

The project uses `stress_intervention_guide.txt` as the source of truth for stress ranges:

- `0-39` Low Stress
- `40-59` Mild Stress
- `60-74` Moderate Stress
- `75-89` High Stress
- `90-100` Severe Stress

Those ranges are reflected in the runtime UI:

- `src/components/StressToCalmPreview.tsx`
- `src/components/InterventionGuide.tsx`

The file `score.txt` exists in the repository as local reference material, but it should not be treated as the authoritative source for tier interpretation.

## Project Structure

```text
stress-visualizer-web/
|- public/
|- src/
|  |- app/
|  |  |- login/
|  |  |- register/
|  |  |- favicon.ico
|  |  |- globals.css
|  |  |- layout.tsx
|  |  |- page.module.css
|  |  |- page.tsx
|  |  `- template.tsx
|  |- components/
|  |  |- BreathingButton.tsx
|  |  |- CalmBackground.tsx
|  |  |- CalmRipple.tsx
|  |  |- InterventionGuide.tsx
|  |  |- Navbar.tsx
|  |  |- StressSurvey.tsx
|  |  |- StressToCalmPreview.tsx
|  |  `- TiltCard.tsx
|  |- hooks/
|  |  `- useCalmSound.ts
|  |- services/
|  |  `- auth.ts
|  `- types/
|     `- flubber.d.ts
|- extended_stress_survey.txt
|- read_pdf.js
|- score.txt
|- stress_intervention_guide.txt
|- stress_scoring_system.pdf
|- next.config.ts
|- package.json
`- tsconfig.json
```

## Key Files

### Runtime files

- `src/app/page.tsx`: main page and feature orchestration
- `src/components/StressSurvey.tsx`: survey content and score calculation
- `src/components/StressToCalmPreview.tsx`: animated visualizer
- `src/components/InterventionGuide.tsx`: tier-based solution modal with breathing, synthesized sound, guided imagery, and grounding guidance
- `src/services/auth.ts`: client-only demo authentication
- `src/components/Navbar.tsx`: auth state display and animation pause toggle

### Supporting files

- `src/components/BreathingButton.tsx`: animated CTA button with ripple effect
- `src/components/TiltCard.tsx`: hover tilt for feature cards
- `src/app/globals.css`: primary global styling
- `src/app/layout.tsx`: app shell and metadata
- `src/app/template.tsx`: route transition animation wrapper

### Research and scratch files

- `score.txt`: scoring note and score interpretation note
- `stress_intervention_guide.txt`: intervention tier source note
- `extended_stress_survey.txt`: text version of the broader survey content
- `stress_scoring_system.pdf`: scoring reference document
- `read_pdf.js`: helper script used to extract PDF text locally

## Technology Stack

### Framework

- Next.js `16.1.4`
- React `19.2.3`
- TypeScript

### Animation and UI

- Framer Motion
- Flubber for SVG path interpolation

### Miscellaneous

- `pdf-parse` for local document extraction work
- browser Web Audio API for synthesized intervention audio
- `use-sound` installed, but not used by the main intervention flow

## Styling Approach

The project uses custom CSS rather than a formal component library.

The visual direction includes:

- pastel and teal-blue gradients
- glassmorphism panels
- soft shadows
- rounded surfaces
- slow motion transitions
- calming interaction affordances
- a calmer blue/teal solution modal palette aligned with the landing page

The app also includes a global `animation-paused` mode controlled from the navbar, which pauses CSS animations for users who want less motion.

## Development

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

### Build for production

```bash
npm run build
```

### Start the production server

```bash
npm run start
```

### Run lint checks

```bash
npm run lint
```

## Current Repository Status

At the current repository state:

- `npm run build` succeeds
- `npm run lint` does not pass cleanly

The lint issues are mostly related to:

- React purity and effect rules
- `any` usage
- unescaped entities in JSX
- unused code and leftover experimental pieces

## Known Limitations

### Product limitations

- The app is educational, not clinical.
- The survey is not validated as a medical instrument.
- The intervention content is presented as guidance, not treatment.

### Technical limitations

- Authentication is front-end only.
- Credentials are stored in browser `localStorage`.
- No backend or persistence layer exists.
- Intervention audio is synthesized in the browser rather than using authored audio assets.
- Some files in the repository are research or scratch artifacts rather than production code.
- The README previously lagged behind implementation and needs to stay synchronized with UI changes.

### Consistency limitations

- Some repository notes are scratch/reference material rather than active product specification.
- The repository contains leftover starter and experimental files such as `page.module.css` and `CalmBackground.tsx`.

## Notes On Unused Or Partial Pieces

- `src/components/CalmBackground.tsx` exists but is not currently used by the app.
- `src/hooks/useCalmSound.ts` currently returns no-op sound handlers.
- `src/app/page.module.css` appears to be starter residue and is not part of the current home page implementation.

## Intended Audience

This project appears most suitable for:

- academic demonstration
- concept validation
- front-end prototyping
- symbolic UX exploration for stress education

It is not yet suitable for:

- clinical deployment
- real account systems
- production therapy tooling
- secure user data handling

## Authors

The footer credits:

- Ahmed Talal Wazih
- Fahad Bin Aziz Nabil
- Abid Al Hossain

## Summary

Stress-to-Calm Visualizer is a polished front-end prototype that combines survey scoring, animated symbolic visualization, and tier-based calming guidance into a single interactive experience.

Its strongest qualities are:

- clear concept
- strong visual storytelling
- ambitious animation work
- coherent educational framing

Its biggest gaps are:

- demo-only authentication
- incomplete production cleanup
- missing backend and persistence infrastructure
