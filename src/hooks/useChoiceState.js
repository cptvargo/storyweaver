import { useState } from 'react'

export function useChoiceState(bookId) {
  const key = `sw_choices_${bookId}`

  const [state, setState] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : { choices: {}, tags: [] }
    } catch {
      return { choices: {}, tags: [] }
    }
  })

  const makeChoice = (chapterIndex, pageIndex, option) => {
    const choiceKey = `${chapterIndex}_${pageIndex}`
    const next = {
      choices: { ...state.choices, [choiceKey]: { id: option.id, goto: option.goto } },
      tags: option.id && !state.tags.includes(option.id)
        ? [...state.tags, option.id]
        : state.tags,
    }
    setState(next)
    try { window.localStorage.setItem(key, JSON.stringify(next)) } catch {}
    return next
  }

  const getChoice = (chapterIndex, pageIndex) => state.choices[`${chapterIndex}_${pageIndex}`] ?? null

  const hasTag = (tag) => state.tags.includes(tag)

  const addTag = (tag) => {
    if (!tag || state.tags.includes(tag)) return
    const next = { ...state, tags: [...state.tags, tag] }
    setState(next)
    try { window.localStorage.setItem(key, JSON.stringify(next)) } catch {}
  }

  const reset = () => {
    setState({ choices: {}, tags: [] })
    try { window.localStorage.removeItem(key) } catch {}
  }

  return { makeChoice, getChoice, hasTag, addTag, reset }
}
