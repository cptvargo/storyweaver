# StoryWeaver — Project Context

## App Overview
React 19 + Vite 8 PWA deployed to GitHub Pages via GitHub Actions.
Repo: https://github.com/cptvargo/storyweaver

Books live in `src/data/books/<bookId>/`. Each book has:
- `bookMeta.json` — chapter list, cover, metadata
- `chapter1/1.json` through `chapterN/30.json` — page files

Each page file has a `blocks` array with types: `narration`, `dialogue`, `internalThought`, `message`, `callStart`, `callEnd`, `embed`.

### Block writing conventions
- **Phone calls**: always wrap with `callStart`/`callEnd`:
  ```json
  { "type": "callStart", "caller": "Ray Davenport", "direction": "incoming" }
  { "type": "callEnd" }
  ```
- **Text messages**: use `message` blocks with `sender`/`recipient` fields. POV character appears on right (blue), others on left (gray). Set `"pov": "CharacterName"` in bookMeta for book-wide POV.
- **Images in messages**: add `"image": "/filename.png"` field to a message block to render a photo bubble.
- **Dialogue-heavy**: aim for 60%+ dialogue, minimal narration. Undertow especially.
- **Internal thoughts** (`internalThought`): render as frosted purple 💭 cards. Use for first-person character thoughts only — not narration.

`src/utils/storyEngine.js` — imports all bookMeta files and must be updated when adding a new book.

Cover images go in `/public/` as `.png` files.

### Pushing to GitHub
Use PowerShell with PAT in the remote URL:
```
$pat = "TOKEN_HERE"
git remote set-url origin "https://$pat@github.com/cptvargo/storyweaver.git"
git push origin main
git remote set-url origin "https://github.com/cptvargo/storyweaver.git"
```

### JSON Rules
- Never use unescaped double quotes inside a content string
- Split narration beats between dialogue into separate blocks
- Validate before pushing: `Get-ChildItem -Recurse -Filter "*.json" | ForEach-Object { ConvertFrom-Json (Get-Content $_.FullName -Raw) }`

---

## Books

### 1. Where We First Met (complete)
Contemporary romance. Ethan and Cassandra. 4 chapters.
- Chapter 4 fix: removed text exchange between Ethan/Cassandra (continuity — Ch5 she asks for his number)

### 2. Fireflies Between Us (complete)
12 chapters. Kit Jenkins and Daisy Monroe.
- Chapter 12 "The Field" is the final chapter — wedding, LA, miscarriage, Kit's film "Millhaven", Ruth passing, Daisy pregnant in the field, fireflies, Kit films it on his phone.

### 3. Undertow (in progress — Episode 1 of 5 complete)
Murder mystery. Psychological thriller. Locked room mystery.
Inspired by Detective Conan / Shinichi Kudo.

---

## Undertow — Full Detail

### Premise
Six old friends rent a beach house on the Carolina coast for a weekend in mid-June. By Saturday night one of them is dead — door locked from the inside, an argument heard through the ceiling at 9:17pm. Julian Crane, a behavioral analyst staying in the rental next door, walked past their bonfire Friday night and noticed something he can't let go.

### Characters

**Julian Crane** — Protagonist. Behavioral analyst, consults on fraud/corporate cases. Staying next door on vacation. Notices patterns in how people behave. Sharp, precise, confident — speaks with clinical accuracy not apology. His mind never stops. Think Shinichi Kudo. Early 30s. Owns every room he walks into — moves his chair before sitting, times his silences, never hedges. Signature: "Every detail except me."

**Mara Voss** — Julian's colleague and closest person. Dry humor, no-nonsense. She pushed him to take this vacation. **She is Julian's "Ran"** — mutual feelings neither has named, both true to their work. Glimpses only: she says "be careful" and means more than the words. He holds the phone a beat longer than necessary after she hangs up. Never explicit. Her line: *"So much for a vacation."* Julian: *"Fun can come after. There's a case that needs attention."*

**Inspector Ray Davenport** — Carteret County. Mid-50s, heavyset, salt-and-pepper, wears a hat. Experienced, by-the-book, competent but not brilliant. The Meguire to Julian's Shinichi. Skeptical of Julian at first, comes to rely on him. Good man.

**Nadia Reyes** — THE KILLER. Composed, controlled, patient. Has been carrying something for 8 years. Chose the beach house specifically for its geometry. Most visible person during the afternoon — her cover. Slips away during the evening window (9:43–10:30pm).

**Marcus Calloway** — THE VICTIM. Warmest person in any room. Held the group together. Had no idea what he was carrying. Seemed "off" this weekend — zoning out on the beach.

**Dean Ashby** — Steady, practical, takes charge in crisis. In a relationship with Sophie. Nadia has been in love with him for years without him knowing.

**Sophie Laurent** — Dean's girlfriend. Emotional, warm. Went upstairs alone to shower for ~40 minutes Saturday afternoon.

**Cade Mercer** — Marcus's best friend, 23 years. Owes $31,000 to a man named Gideon Price (gambling debt). Marcus knew and was helping him. Cade is the early red herring. The one who realizes nobody has a solid alibi in Chapter 3.

**Wren Cole** — The quiet observer. Short answers, precise ones. Described Marcus as looking like "someone hearing bad news in an empty room." She is the one who gives Julian the case-breaking detail in Chapter 8.

**Dr. Audra Mills** — County medical examiner. Called in Chapter 2. Bags the water glass. Initially reads as possible cardiac event pending tox.

### Character Appearances (for image generation)
- **Julian Crane** — early 30s, lean, sharp features, observant eyes
- **Mara Voss** — early 30s, professional, composed, quick smile
- **Dean Ashby** — early 30s, Black, tall, clean cut even on no sleep
- **Cade Mercer** — early 30s, white, sandy brown hair, naturally charming
- **Nadia Reyes** — early 30s, Latina, dark hair, striking, holds herself very still
- **Sophie Laurent** — early 30s, French-Algerian, warm features, expressive
- **Wren Cole** — late 20s, East Asian, small frame, watchful eyes
- **Inspector Davenport** — mid-50s, heavyset, salt-and-pepper, always has his hat

### The House Booking (Option C — confirmed)
Marcus booked the house. Nadia steered him toward it — casually mentioned the area, sent a link, suggested the coast. Marcus thought it was his idea. Julian discovers this in the booking trail — the suggestion originated with Nadia even though the reservation didn't. Nadia viewed the floor plan repeatedly to study the layout and the bedroom door geometry. This is revealed in Chapter 7.

### The Murder Method
1. Nadia puts sleeping pills in Marcus's bedside water glass (placed with a coaster before he went upstairs)
2. Marcus drinks it, falls into deep unconscious sleep within the hour
3. During the evening window (9:43–10:30pm) Nadia slips away from the group
4. She enters Marcus's room through the DOOR (unlocked — Marcus did not engage the latch before falling asleep)
5. She suffocates him with a pillow
6. She exits through the DOOR into the hallway
7. Uses pre-cut piano wire looped around the thumb turn, threaded under the door gap, to relock from outside
8. Pulls the wire free. Door appears locked from inside. She returns to the group.

**The locked room has ONE impossibility:**
- Door locked from inside — Nadia exited through the door and relocked it using the piano wire trick (revealed Ch9)
- The window is never used. There is no window entry/exit.

**Physical evidence (in order of discovery):**
- Water glass with coaster — placed deliberately before Marcus drank (Ch1, Julian observes; tox screen Ch5 confirms sleeping pills)
- Faint groove on the inner face of the thumb turn — something narrow was drawn across it under tension (Ch3 p30, Julian discovers; piano wire identified Ch9)
- Petechial hemorrhaging / suffocation signs on re-examination (Ch7)
- Booking trail — Nadia viewed the floor plan 17 times, studying the layout and door geometry (Ch3 p33, Ch7 full reveal)
- Piano wire score marks confirmed and method demonstrated in deduction room (Ch9)

### The Motive — 8 Years
Nadia wrote a letter to Dean confessing her feelings. She gave it to Marcus to deliver. Marcus got sidetracked — a genuine accident — and the letter fell to the bottom of his bag pocket and stayed there. He forgot it was there. He never read it. He never intentionally withheld it. He just forgot.

Nadia spent 8 years believing Dean had rejected her, watching him from across dinner tables, watching him end up with Sophie. Finding the letter in Marcus's bag ON THIS TRIP (first night) is what triggered her to act. She had planned a version of this for a while — but finding the letter made it NOW.

**The letter content is NEVER shown to the reader until the Episode 5 deduction room.** The prologue (Ep1 p1) is cryptic — no names, just the emotional weight of finding it. Nadia reads it aloud in the deduction room, in her own voice, for the first time. That is when Dean hears it. That is when everyone hears it.

**Julian's hypothesis (middle episodes):** Julian cannot conclude from evidence alone why Marcus kept the letter. But he can form a behavioral hypothesis — everything he observed about Marcus is inconsistent with deliberate cruelty or malice. Julian frames it precisely: *"I can't tell you why he kept it. What I can tell you is that everything I observed about Marcus Calloway is inconsistent with someone who acts out of deliberate cruelty."* Hypothesis, not fact.

**Dean's testimony in the Episode 5 deduction room** is what elevates hypothesis to truth: Dean says — almost as a throwaway memory — that Marcus once told him he had something for him. When Dean followed up, Marcus went completely blank. Couldn't place what it was. Dean thought nothing of it at the time. In the deduction room he realizes what Marcus couldn't remember.

**Episode 5 deduction room — the breakdown:**
After Julian walks through all evidence and exposes Nadia, Dean's testimony lands. The room understands: Marcus forgot. A genuine accident. Eight years of Nadia's grief, and her decision in the dark, all tracing back to Marcus getting distracted one day and never reaching into his bag.

Nadia realizes what she has done. She breaks completely.
- *"What have I done!?!"*
- *"Marcus... Please... come back......"*
- She is heavily remorseful, devastated, tears — this is not performance, this is a person collapsing under the weight of what they cannot undo
- She looks at Dean. She reads the letter aloud — her own words, 8 years late. Dean hears it for the first time.
- Wren and Sophie cannot compose themselves.
- Julian feels the heaviness. He has solved it — and the solving of it doesn't feel like a victory.
- Inspector Davenport puts Nadia in handcuffs. The room does not recover.

**Episode 5 — court proceedings (closing act):**
After the arrest, Episode 5 continues into the courtroom. Defense and prosecution both get their moment. The judge hears the full case — the evidence, the method, the motive, and the accident at the center of it. The judge's sentence closes the episode and the story. The reader sees the consequence all the way through.

### Planted clues (already written)
- **Ch1 Page 2 (prologue):** *"I found it on the first night. In the front pocket of his bag, folded in quarters. My handwriting. Eight years old and still there."* — cryptic, no names
- **Ch1 Page 16 (dinner):** Dean says something private to Sophie, she smiles, he refills her glass. *"Small things. The kind that accumulate."* — Nadia registers it, narration unattributed
- **Ch1 Page 18:** Julian walks past bonfire, notices one person watching another with deliberate, patient attention — doesn't identify who
- **Ch1 Page 29:** Marcus zones out on beach, internal thought blocks, Cade notices: *"You don't look so well"*
- **Ch2 Page 17:** Davenport interviews all five — each has an interesting but non-damning note. Nadia's answers are "exactly right" — replaced with balanced observation across all five
- **Ch3 Page 8:** *"Nadia's the only one with a real alibi for the afternoon"* — Cade says it as relief. Her cover, working.
- **Ch3 Page 30:** Julian examines the bedroom door latch from the hallway — finds a faint groove on the inner face of the thumb turn. Something narrow was threaded under the door to lock it from outside. The HOW is not yet named. (Piano wire identified Ch9.)

### Episode Roadmap (5-episode interactive structure)

| Episode | Title | Owns | Status |
|---------|-------|------|--------|
| 1 | The Weekend | Friday arrival → Saturday night → Sunday discovery → Davenport arrives → investigation opens. 50 pages. | ✅ Complete |
| 2 | — | The call identity revealed. Tox confirmed — sleeping pills. Now officially homicide. Cade red herring peaks. | ⬜ Next |
| 3 | — | Red herring collapses. Backstory surfaces — letter found in Marcus's belongings, 8 years revealed to Julian. Julian's hypothesis forms. | ⬜ |
| 4 | — | Wren tells Julian what she saw during the evening window. Julian's latch-mark theory hardens into piano wire. The case closes in. | ⬜ |
| 5 | — | The deduction room — Julian assembles everyone, full evidence walkthrough, piano wire demonstration, Dean's testimony (Marcus couldn't remember), Nadia's breakdown, letter read aloud, handcuffs. Court proceedings: defense, prosecution, judge's sentence. | ⬜ |

### Key Rules for Writing Undertow
- **Heavy dialogue, lighter narration** — majority of pages should be dialogue-driven
- **Don't single out Nadia** — every character has something that could look suspicious
- **Julian speaks with precision, not apology** — he knows exactly what he observed and exactly what conditions wouldn't support. Those are different things.
- **Davenport withholds** — he shares selectively with Julian. Julian reads what Davenport doesn't say as much as what he does.
- **Wren is the quiet observer** — one strong moment per chapter keeps her relevant. Chapter 8 is her chapter.
- **Mara appears periodically** — she grounds Julian, provides dry humor, her amazement in Chapter 9 anchors the reader

### Chapter Images (public/)
- `undertow.png` — book cover
- `undertow_chapter1_arrival.png` — Chapter 1 cover
- `undertow_chapter2_theroom.png` — Chapter 2 cover
- Chapter 3 cover image not yet added — using Ch2 image as placeholder
