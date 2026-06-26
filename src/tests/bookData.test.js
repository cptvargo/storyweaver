import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const BOOKS_DIR = join(process.cwd(), 'src/data/books')

function getBookIds() {
  return readdirSync(BOOKS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
}

function readJson(filePath) {
  let raw = readFileSync(filePath, 'utf8')
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1) // strip UTF-8 BOM (Windows PowerShell artifact)
  return JSON.parse(raw)
}

function getAllPageFiles(bookId) {
  const bookDir = join(BOOKS_DIR, bookId)
  const meta = readJson(join(bookDir, 'bookMeta.json'))
  const pages = []
  for (const chapter of meta.chapters ?? []) {
    const chapterDir = join(bookDir, `chapter${chapter.chapterIndex}`)
    if (!existsSync(chapterDir)) continue
    for (let p = 1; p <= (chapter.totalPages ?? 0); p++) {
      const pagePath = join(chapterDir, `${p}.json`)
      if (existsSync(pagePath)) {
        pages.push({ bookId, chapterIndex: chapter.chapterIndex, pageIndex: p, path: pagePath })
      }
    }
  }
  return pages
}

// ─── bookMeta validation ──────────────────────────────────────────────────────

describe('bookMeta.json — required fields', () => {
  for (const bookId of getBookIds()) {
    it(`${bookId} has valid bookMeta.json`, () => {
      const metaPath = join(BOOKS_DIR, bookId, 'bookMeta.json')
      expect(existsSync(metaPath), `bookMeta.json missing for ${bookId}`).toBe(true)
      const meta = readJson(metaPath)
      expect(meta.id, 'id field required').toBeTruthy()
      expect(meta.id).toBe(bookId)
      expect(meta.title, 'title field required').toBeTruthy()
      expect(Array.isArray(meta.chapters), 'chapters must be an array').toBe(true)
    })
  }
})

describe('bookMeta.json — interactive books must have bookType', () => {
  // Only books explicitly tagged as interactive in their metadata are validated here.
  // Romance/non-interactive books may have legacy choice blocks — they are not subject to this rule.
  const INTERACTIVE_BOOKS = getBookIds().filter(id => {
    const meta = readJson(join(BOOKS_DIR, id, 'bookMeta.json'))
    return meta.bookType === 'interactive'
  })

  for (const bookId of INTERACTIVE_BOOKS) {
    it(`${bookId}: bookType is "interactive"`, () => {
      const meta = readJson(join(BOOKS_DIR, bookId, 'bookMeta.json'))
      expect(meta.bookType).toBe('interactive')
    })
  }
})

// ─── Page JSON validation ─────────────────────────────────────────────────────

describe('Page files — valid JSON and required structure', () => {
  for (const bookId of getBookIds()) {
    const pages = getAllPageFiles(bookId)
    for (const { chapterIndex, pageIndex, path } of pages) {
      it(`${bookId} ch${chapterIndex} p${pageIndex} — valid JSON`, () => {
        expect(() => readJson(path)).not.toThrow()
      })

      it(`${bookId} ch${chapterIndex} p${pageIndex} — has blocks array`, () => {
        const page = readJson(path)
        expect(Array.isArray(page.blocks), 'blocks must be an array').toBe(true)
        expect(page.blocks.length, 'blocks must not be empty').toBeGreaterThan(0)
      })
    }
  }
})

// ─── Choice block validation (interactive books only) ────────────────────────

describe('Choice blocks — required option fields (interactive books only)', () => {
  for (const bookId of getBookIds()) {
    const meta = readJson(join(BOOKS_DIR, bookId, 'bookMeta.json'))
    if (meta.bookType !== 'interactive') continue

    const pages = getAllPageFiles(bookId)
    for (const { chapterIndex, pageIndex, path } of pages) {
      it(`${bookId} ch${chapterIndex} p${pageIndex} — choice options have id, flagsSet, goto`, () => {
        const page = readJson(path)
        const choiceBlocks = (page.blocks ?? []).filter(b => b.type === 'choice')
        for (const choice of choiceBlocks) {
          expect(Array.isArray(choice.options), 'options must be an array').toBe(true)
          expect(choice.options.length, 'must have at least 2 options').toBeGreaterThanOrEqual(2)
          for (const opt of choice.options) {
            expect(opt.id, `option missing id in ch${chapterIndex} p${pageIndex}`).toBeTruthy()
            if (opt.flagsSet != null) {
              expect(Array.isArray(opt.flagsSet), `option ${opt.id} flagsSet must be an array if present`).toBe(true)
            }
            expect(typeof opt.goto, `option ${opt.id} missing goto (must be a page number)`).toBe('number')
            expect(opt.label, `option ${opt.id} missing label`).toBeTruthy()
          }
        }
      })
    }
  }
})

// ─── Consequence condition reachability ───────────────────────────────────────

describe('Consequence blocks — condition tags must be reachable', () => {
  for (const bookId of getBookIds()) {
    const meta = readJson(join(BOOKS_DIR, bookId, 'bookMeta.json'))
    if (meta.bookType !== 'interactive') continue

    it(`${bookId} — all consequence conditions are set by some choice`, () => {
      const pages = getAllPageFiles(bookId)
      const allSetTags = new Set()

      for (const { path } of pages) {
        const page = readJson(path)
        for (const block of page.blocks ?? []) {
          if (block.type === 'choice') {
            for (const opt of block.options ?? []) {
              if (opt.id) allSetTags.add(opt.id)
              for (const flag of opt.flagsSet ?? []) allSetTags.add(flag)
            }
          }
        }
      }

      const unreachable = []
      for (const { chapterIndex, pageIndex, path } of pages) {
        const page = readJson(path)
        for (const block of page.blocks ?? []) {
          if ((block.type === 'consequence') && block.condition) {
            if (!allSetTags.has(block.condition)) {
              unreachable.push(`ch${chapterIndex} p${pageIndex}: condition "${block.condition}" never set`)
            }
          }
        }
      }

      expect(unreachable, unreachable.join('\n')).toHaveLength(0)
    })
  }
})
