# Alpha Bible Reader Engine — Technical Blueprint

**Status:** Documentation only — no implementation, no rebuild, no UI/route/component changes in this deliverable.

**Constraints preserved:**

- Stack: Vite, React, TanStack Router, Tailwind v4 (as today).
- Alpha DNA and existing reader UI remain the source of truth; tablet behavior is **additive** and **opt-in** via layout breakpoints and feature flags, not a redesign of phone UI.
- Mobile-first, touch-first, safe-area aware; Android phones, iPhones, iPads, Android tablets, large tablets, future PWA.

**Scope:** Defines a **Reader Engine** as a conceptual boundary around data, matching, rendering, caching, instrumentation, and virtualization — implemented incrementally behind flags when engineering begins.

---

## 1. Architecture layers

| Layer | Responsibility | Notes |
|-------|----------------|--------|
| **Transport** | Supabase REST/RPC, auth as needed | Today: `bible_verses`, `alpha_dictionary`, `lookup_dictionary`, abbreviations tables. |
| **Data access** | Typed fetchers, pagination, batch APIs | Single place for verse/chapter/book queries; avoid N+1 at call sites. |
| **Cache & persistence** | React Query + optional persister | Session/tab vs durable (IndexedDB) separation; stale policies per resource type. |
| **Reader state** | Scroll position, active verse, typography, flags | Ephemeral vs persisted keys; throttle writes. |
| **Matching engines** | Dictionary + cross-ref resolution | Pure functions + async orchestrators; no React inside core matchers. |
| **Render orchestration** | Verse list, tokens, highlights, sheets | Thin containers; heavy logic in hooks/workers where justified. |
| **Presentation** | Existing components/sheets/routes | Unchanged DNA; engine only changes **how** data is prepared and **when** subtrees re-render. |

**Principle:** Upper layers depend downward; matching and cache layers do not import route-specific UI.

---

## 2. Data flow (end-to-end)

```text
User opens /$book/$chapter
    → Router resolves params (unchanged)
    → Reader Engine requests: chapters list (if needed), verses for (book, chapter)
    → React Query: memory cache → (optional) persisted cache → network
    → Normalized verse array → Chapter render pipeline
    → (Optional) Smart highlight job: verse text → normalized tokens → match keys → matchedSet
    → Token render: text + matchedSet → spans + HighlightedWord
    → User tap → Dictionary pipeline OR Cross-ref pipeline → sheets/dialogs (existing UI)
    → Scroll/session: throttled persist to localStorage / optional IDB
```

**Normalization:** Single canonical Arabic normalization for matching (align with existing `normalizeAr` semantics); document version bumps when rules change.

---

## 3. Render flow

### 3.1 Verse rendering lifecycle

1. **Mount:** Subscribe to chapter query; show skeleton until `verses` resolved.
2. **Hydrate:** Apply typography prefs from storage (existing pattern).
3. **Layout:** Commit verse list to DOM (flat list or virtual window — see §9).
4. **Enrich (async):** Smart highlights may update `matchedSet` after first paint; prefer **non-blocking** second paint over blocking first paint.
5. **Interact:** Tap verse card → active verse; tap word → dictionary pipeline; ref chip → cross-ref pipeline.
6. **Scroll:** Progress + active verse updates decoupled from full tree (see §10).
7. **Unmount / navigate:** Cancel in-flight highlight jobs; persist session snapshot.

### 3.2 Chapter rendering flow

- **Stable list keys:** `verseKey(book, chapter, verseNumber)` — never key by array index alone.
- **Phases:** (A) structural verses, (B) optional highlight overlay data, (C) optional cross-ref badges when data exists (flagged).
- **Error/empty:** Single error surface + retry; no partial silent failure for scripture text.

---

## 4. Caching flow

| Asset | Volatility | Suggested tier | Policy sketch |
|-------|------------|----------------|----------------|
| **Verse text** | Low | L1: React Query memory; L2: persisted (IDB) | Long `staleTime`; version key on content import. |
| **Chapter list per book** | Low | Same | Invalidate on book change only. |
| **Book list** | Low | Same | Rare refetch. |
| **Dictionary (`alpha_dictionary`)** | Medium | L1: memory; L2: session or IDB | TTL or ETag from server if available; else version in app config. |
| **lookup_dictionary RPC** | Medium | Short TTL in memory; dedupe by term | Debounce search; single-flight per term. |
| **Abbreviation maps** | Low | Long-lived in memory + persist | `staleTime: Infinity` OK if versioned. |
| **Resolved cross-ref snippet** | Low per ref | Keyed by `(book, chapter, verse)` | Dedupe batch fetch. |

**Offline-first reading (target):** Scripture text and stable metadata must be readable without network after first successful load of that chapter (and optionally prefetch neighbors). Dictionary remains “best effort” offline with cached entries only.

---

## 5. Smart highlight engine (blueprint)

**Goal:** Deterministic, explainable highlights — first occurrence per normalized key per chapter (or configurable policy), with tunable aggressiveness.

**Pipeline stages:**

1. **Tokenize** verse text → Arabic runs + punctuation spans (existing split strategy conceptually).
2. **Normalize** each candidate token.
3. **Filter** stopwords / blacklist / min length (existing concepts in `dictionary.ts` — align rules in one module).
4. **Match** against:
   - **Path A:** In-memory set built from `alpha_dictionary` normalized terms (bulk, no RPC per word).
   - **Path B (optional):** Server-side “strong hit” RPC for ambiguous cases — batched, not per scroll frame.
5. **Merge** results into `matchedSet` (Set of normalized strings).
6. **Render** wrap in `HighlightedWord` only when key ∈ `matchedSet` and policy allows (e.g. first occurrence in chapter).

**Concurrency:** One cancellable job per `(book, chapter)`; cancel on param change or unmount.

**Feature flags:** See §6 — `reader.smartHighlight.enabled`, `reader.smartHighlight.source` (`alpha_only` | `hybrid`).

---

## 6. Dictionary matching pipeline (blueprint)

**Surfaces:**

- **Inline tap:** `lookup_dictionary(term)` → 0/1/n rows → existing sheets (picker vs single).
- **Manual search:** Debounced RPC (existing dialog behavior conceptually).
- **Sheet enrichment:** Optional `alpha_dictionary_deep` fetch by normalized term for people tab (existing pattern).

**Rules:**

- Exact normalized match for inline disambiguation where possible.
- RPC parameter compatibility (`search_term` vs `term`) handled in one adapter.
- Never block scroll on dictionary work; network only from user intent or idle callback.

---

## 7. Cross-reference engine (blueprint)

**Inputs:** Raw strings from DB (`bible_references`, `reference`, etc.) — format documented per column.

**Stages:**

1. **Parse** → structured `{ book, chapter, verse?, verseEnd? }` using abbreviation maps (existing `parseScriptureRef`).
2. **Validate** → unknown book → show raw chip without navigation.
3. **Resolve text** → batch `fetchVerseText` for visible refs in a sheet (not one query per ref on open without batching).
4. **Navigate** → TanStack Router `Link` to `/$book/$chapter` (verse-level anchor optional future enhancement behind flag).

**Replace placeholder in-verse indicators** with real data only when `reader.crossRef.enabled` and backend provides per-verse or per-chapter ref list.

---

## 8. Offline-first reading architecture (blueprint)

**Levels of “offline”:**

| Level | User experience | Engineering |
|-------|-----------------|-------------|
| L0 (today) | Network required for scripture | Baseline. |
| L1 | Revisit read chapter offline | Persist verse payloads for opened chapters + neighbors. |
| L2 | Open app offline; read last position | Persist last N chapters + optional “download book”. |
| L3 | PWA install; background sync | Service worker + cache versioning + update prompts. |

**Components:**

- **Content cache store:** IndexedDB (or SQLite WASM if ever needed) keyed by schema version.
- **React Query persister:** Rehydrate before first paint where possible for last route.
- **Queue:** Failed writes (future notes/highlights) retried when online.

**Compatibility:** Same UI; offline is **data availability**, not a new shell.

---

## 9. Tablet / iPad adaptive reading strategy (blueprint)

**Rule:** Phone layout unchanged at `< md` (or project-chosen breakpoint). Tablet adds **optional** layout modes behind `reader.tablet.layout`.

| Mode | Behavior | DNA impact |
|------|----------|------------|
| **Stacked (default)** | Same as phone, wider `max-width` for readability | None — already adjustable via reading width. |
| **Split (flagged)** | Main column scripture; secondary narrow column for dictionary / refs / search (collapsible) | Additive chrome; bottom nav unchanged. |
| **Large tablet** | Split + larger typography presets | Still RTL, touch-first. |

**Safe-area:** All fixed overlays respect `env(safe-area-inset-*)`; split panes use inner padding, not second scroll on `body` where avoidable.

---

## 10. Performance instrumentation (blueprint)

**Metrics (web vitals + custom):**

- **INP / long tasks** around scroll and tap.
- **TTI** for chapter open (first verse visible).
- **Time to interactive highlight** (optional phase): first paint → matchedSet ready.
- **Render counts:** dev-only why-did-you-render style probes on `VerseCard` boundary.
- **Network:** Supabase request count per chapter open; batch efficiency.

**Transport:** Optional `console` in dev; staging/prod: minimal event batching to analytics endpoint or OTEL browser SDK (decision deferred).

**Budgets (example targets for engineering to validate on mid-tier Android):**

- Scroll handler: no full-tree React state updates per frame.
- Chapter open: ≤ 1 verse list query + 0 mandatory dictionary queries before first paint.

---

## 11. Virtualization strategy for large chapters (blueprint)

**When:** Chapters with verse count > threshold (configurable, e.g. 80+) **or** measured main-thread cost over budget.

**Approach:**

- **Windowed list** (e.g. `@tanstack/react-virtual` or equivalent) wrapping **verse rows only**, not sheets/nav.
- **Stable overscan** (e.g. 3–5 verses) to reduce flicker on fast flick scroll.
- **Active verse:** Prefer `IntersectionObserver` on visible indices instead of `querySelectorAll` over full chapter.
- **Highlight updates:** `matchedSet` updates should not change row keys; avoid remounting entire list.

**Fallback:** Threshold off → current full list behavior (safe default).

---

## 12. React rendering boundaries and memo strategy (blueprint)

**Problems to solve (when implementing):** scroll-driven state in parent causing full verse list rerenders; expensive tokenization repeated unnecessarily.

**Boundaries:**

| Component / boundary | Owns | Should NOT |
|---------------------|------|------------|
| `ReaderShell` | Route params, queries, feature flags | Per-token string work |
| `ReaderScrollChrome` | Progress bar, vertical rail (memoized props) | Verse data |
| `VerseList` | List virtualization window | Dictionary RPC |
| `VerseRow` | One verse’s layout, save button, ref chip slot | Global dictionary index |
| `VerseTokens` | Tokenization output for one verse | Scroll listeners |
| `DictionarySheetsHost` | Sheet open state | Verse rendering |

**Memo strategy:**

- `React.memo` on `VerseRow` with props compared by primitive/stable refs.
- `matchedSet`: stable reference updated only when set content changes (immer or structural sharing).
- Scroll handlers: **refs** for progress + **rAF** throttling; commit to React state ≤ 10–15 Hz or only when dock visibility toggles.
- **Avoid** inline new functions/objects in map if they defeat memo (use stable callbacks from `useCallback`).

---

## 13. Feature flags plan

Centralize in one module (conceptual): `reader.flags.*`

| Flag key | Purpose | Default |
|----------|---------|---------|
| `reader.smartHighlight.enabled` | Chapter-level smart highlights | `false` until validated |
| `reader.smartHighlight.source` | `alpha_only` / `hybrid` | `alpha_only` |
| `reader.virtualization.enabled` | Windowed verse list | `false` until threshold tested |
| `reader.virtualization.threshold` | Verse count to virtualize | Tuned per QA |
| `reader.offline.persistVerses` | IDB persistence for scripture | `false` → `true` phased |
| `reader.offline.prefetchNeighbors` | Prefetch prev/next chapter | `false` |
| `reader.tablet.splitLayout` | Split reading on wide screens | `false` |
| `reader.crossRef.enabled` | Real cross-ref data in reader | `false` until backend ready |
| `reader.instrumentation.enabled` | Custom metrics | `true` staging, `false` or sampled prod |

Flags can be env-driven, remote-config, or build-time constants per environment.

---

## 14. Rollout stages

| Phase | Scope | User-visible risk |
|-------|--------|-------------------|
| **P0** | Instrumentation + scroll/perf refactor (no DNA change) | Low if strictly internal |
| **P1** | Smart highlight engine on `alpha_only` path, flag off in prod | Low |
| **P2** | Virtualization behind threshold + flag | Medium — edge cases in scroll restore |
| **P3** | Offline scripture persistence (L1–L2) | Medium — storage quota, migration |
| **P4** | Cross-reference real data + batch fetch | Medium — data quality |
| **P5** | Tablet split layout (additive) | Medium — QA matrix on devices |
| **P6** | PWA / SW (optional) | Higher — cache invalidation |

---

## 15. Risk analysis

| Risk | Mitigation |
|------|------------|
| Scroll jank from state updates | Isolate scroll chrome; rAF; reduce React commits |
| Virtualization breaks scroll restore | Restore after `scrollTo` when list measured; integration tests |
| IDB quota exceeded | LRU by chapter; user-visible “manage downloads” later |
| Dictionary stale vs server | Version bump + invalidate query |
| Tablet split breaks thumb reach | Default stacked; split optional; collapse |
| Feature flag drift | Single module + docs + env table |

---

## 16. Safe migration path

1. **Document** this blueprint + align with product on flags (done here at doc level).
2. **Measure** baseline on target devices (P0).
3. **Extract** pure functions from route file into `reader-engine/` modules **without** behavior change (mechanical move).
4. **Introduce** flags defaulting to current behavior.
5. **Enable** per-phase in internal builds → staging → % rollout.
6. **Rollback** = flip flag + cache version bump if persistence shape changes.

No big-bang; each phase mergeable independently.

---

## 17. Acceptance criteria per phase

### P0 — Instrumentation & scroll decoupling

- [ ] No increase in average React commit rate during 5s continuous scroll (vs baseline) on reference Android device.
- [ ] Chapter open produces same visual output as before (pixel-diff optional).
- [ ] No change to public routes or navigation structure.

### P1 — Smart highlight (`alpha_only`)

- [ ] With flag on, `matchedSet` completes within agreed time budget for longest chapter in corpus.
- [ ] Tapping highlighted word still opens same dictionary flows as today.
- [ ] With flag off, behavior identical to pre-P1.

### P2 — Virtualization

- [ ] Chapters above threshold: FPS ≥ agreed minimum during scroll.
- [ ] Active verse detection accurate vs baseline on sample chapters.
- [ ] Scroll restore after navigation back matches within N pixels tolerance.

### P3 — Offline scripture

- [ ] Airplane mode: last-read chapter text still readable after prior online visit.
- [ ] Cache respects version; no mixed old/new text after content update.

### P4 — Cross-references

- [ ] No placeholder refs in production when flag on; all refs from backend or hidden.
- [ ] Opening sheet with K refs ≤ ceil(K / batchSize) network round-trips.

### P5 — Tablet split

- [ ] Phone breakpoints: UI indistinguishable from pre-split (screenshot tests).
- [ ] Tablet: optional second column; bottom nav untouched; safe-area correct.

### P6 — PWA (optional)

- [ ] Installable; offline shell; clear update strategy documented.

---

## 18. Document ownership

- **Owner:** Engineering + product (Alpha Bible).
- **Review cadence:** After each phase rollout; update flags and acceptance metrics.

---

*End of blueprint — implementation deliberately omitted.*
