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

### 3. Undertow (in progress — 3 of 10 chapters written)
Murder mystery. Psychological thriller. Locked room mystery.
Inspired by Detective Conan / Shinichi Kudo.

---

## Undertow — Full Detail

### Premise
Six old friends rent a beach house on the Carolina coast for a weekend. By Saturday night one of them is dead — door locked from the inside, window open to a 47-degree night, an argument heard through the ceiling at 9:17pm. Julian Crane, a behavioral analyst staying in the rental next door, walked past their bonfire Friday night and noticed something he can't let go.

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
Marcus booked the house. Nadia steered him toward it — casually mentioned the area, sent a link, suggested the coast. Marcus thought it was his idea. Julian discovers this in the booking trail — the suggestion originated with Nadia even though the reservation didn't. Nadia viewed the exterior photo gallery to study the window route. This is revealed in Chapter 7.

### The Murder Method
1. Nadia puts sleeping pills in Marcus's bedside water glass (placed before he went upstairs)
2. Marcus drinks it, falls into deep unconscious sleep within the hour
3. During the evening window (9:43–10:30pm) Nadia slips away from the group
4. She goes OUTSIDE and climbs up to Marcus's window (20ft drop — HOW she got up is unsolved in Ch3, revealed Ch8/9)
5. She enters through the open window (Marcus opened it because the drugs made him feel overheated)
6. She suffocates him with a pillow
7. She exits through the DOOR (unlocks the privacy latch from inside, steps into the hallway)
8. Uses pre-cut piano wire looped around the thumb turn, threaded under the door gap, to relock from outside
9. Pulls the wire free. Door appears locked from inside. She returns to the group.

**The locked room has TWO impossibilities:**
- Door locked from inside → piano wire trick (revealed Ch9)
- Window is a 20ft drop → HOW Nadia got up there is unsolved in Ch3, revealed Ch8/9

**Physical evidence:**
- Bent drainpipe bracket with scraped paint and synthetic fibers (Ch3 — proves window was used, HOW unknown)
- Water glass — sleeping pills (tox screen Ch5)
- Petechial hemorrhaging / suffocation signs on re-examination (Ch7)
- Piano wire score marks on the thumb turn of the latch (Ch9 deduction room)

### The Motive — 8 Years
Nadia wrote a letter to Dean confessing her feelings. She gave it to Marcus to deliver. Marcus kept it — never gave it to Dean. Nadia spent 8 years believing Dean had rejected her, watching him from across dinner tables, watching him end up with Sophie. Finding the letter in Marcus's bag ON THIS TRIP (first night) is what triggered her to act. She had planned a version of this for a while — but finding the letter made it NOW.

**Chapter 9 deduction room:** After Julian exposes her, Nadia breaks. Tears. She looks at Dean. She reads the letter aloud — her own words, in her own voice, 8 years late. Dean hears it for the first time. The room goes into shock. Not just because of the murder — because of what Marcus kept, and what none of them knew.

### Planted clues (already written)
- **Ch1 Page 2 (prologue):** *"I found it on the first night. In the front pocket of his bag, folded in quarters. My handwriting. Eight years old and still there."* — cryptic, no names
- **Ch1 Page 16 (dinner):** Dean says something private to Sophie, she smiles, he refills her glass. *"Small things. The kind that accumulate."* — Nadia registers it, narration unattributed
- **Ch1 Page 18:** Julian walks past bonfire, notices one person watching another with deliberate, patient attention — doesn't identify who
- **Ch1 Page 29:** Marcus zones out on beach, internal thought blocks, Cade notices: *"You don't look so well"*
- **Ch2 Page 17:** Davenport interviews all five — each has an interesting but non-damning note. Nadia's answers are "exactly right" — replaced with balanced observation across all five
- **Ch3 Page 8:** *"Nadia's the only one with a real alibi for the afternoon"* — Cade says it as relief. Her cover, working.
- **Ch3 Page 27:** Julian finds the exterior wall, porch roof, bent bracket below Marcus's window

### Chapter Roadmap

| Chapter | Title | Owns | Status |
|---------|-------|------|--------|
| 1 | Arrival | Setup, group dynamics, prologue, Julian's bonfire walk | ✅ Written |
| 2 | The Room | Discovery, Davenport arrives, Julian meets Davenport, suspicious death filed | ✅ Written |
| 3 | No Alibi | Sunday morning, locked room argument, alibi conversation, Cade's realization, window route found, officially homicide | ✅ Written |
| 4 | The Call | Phone call identity revealed — who Marcus was arguing with Saturday night | ⬜ Next |
| 5 | — | Tox results: sleeping pills confirmed. Now officially homicide but HOW — pills alone don't kill a healthy man | ⬜ |
| 6 | — | Red herring peaks — one person looks very guilty, isn't (likely Cade) | ⬜ |
| 7 | — | Backstory surfaces — the letter found in Marcus's belongings during investigation. 8 years revealed. | ⬜ |
| 8 | — | Wren's moment — she tells Julian what she saw during the evening window | ⬜ |
| 9 | — | The deduction room — Julian assembles everyone, walks through all evidence, piano wire demonstration, Nadia's breakdown, letter read aloud | ⬜ |
| 10 | — | Aftermath, consequence, resolution | ⬜ |

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
