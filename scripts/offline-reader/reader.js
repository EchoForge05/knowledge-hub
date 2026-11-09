'use strict'

const entry = 'topics.html'
const articles = [...document.querySelectorAll('#reading > article')]
const search = document.querySelector('#search')
const results = document.querySelector('#results')
const status = document.querySelector('#search-status')
const outline = document.querySelector('#outline')
const outlineItems = outline.querySelector('ul')
const headings = 'h2[id], h3[id]'
let active

const words = text => new Set(tokenize(text.toLowerCase()))
const normalized = text => text.toLowerCase().replace(/\s+/g, ' ').trim()
const headingText = heading => heading?.textContent.replaceAll('\u200b', '').trim() ?? ''

// Index the rendered text, including collapsed notes and code, without indexing HTML attributes.
const index = articles.flatMap(article => {
  const title = headingText(article.querySelector('h1'))
  const titleWords = words(title)
  const sections = [{ id: article.id, name: title, text: '' }]
  const walker = document.createTreeWalker(article, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT)
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.nodeType === Node.TEXT_NODE) {
      sections.at(-1).text += node.textContent
    } else if (node.matches(headings)) {
      sections.push({ id: node.id, name: headingText(node), text: '' })
    } else if (node.matches('br, p, li, pre, tr, td, th, div')) {
      sections.at(-1).text += ' '
    }
  }
  return sections.map(({ id, name, text }) => ({
    id, name, title, titleWords, headingWords: words(name), bodyWords: words(text),
    titleText: normalized(title), headingText: normalized(name), bodyText: normalized(text)
  }))
})

function linkTo(id, text) {
  const link = document.createElement('a')
  link.href = '#' + encodeURIComponent(id)
  link.textContent = text
  return link
}

function currentTarget() {
  try {
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (target?.closest('#reading > article')) return target
  } catch {
    // A malformed fragment falls back to the directory.
  }
  return document.getElementById(entry)
}

function navigate(focus) {
  const target = currentTarget()
  const article = target.closest('article')
  if (active !== article) {
    if (active) active.hidden = true
    article.hidden = false
    active = article
    const items = [...article.querySelectorAll(headings)].map(heading => {
      const item = document.createElement('li')
      if (heading.tagName === 'H3') item.className = 'subheading'
      item.append(linkTo(heading.id, headingText(heading)))
      return item
    })
    outlineItems.replaceChildren(...items)
    outline.hidden = !items.length
    document.title = headingText(article.querySelector('h1')) + ' · Knowledge Hub 离线阅读'
  }
  for (let detail = target.closest('details'); detail; detail = detail.parentElement.closest('details')) {
    detail.open = true
  }
  if (focus) {
    const destination = target === article ? article.querySelector('h1') ?? article : target
    destination.tabIndex = -1
    destination.focus({ preventScroll: true })
    destination.scrollIntoView()
  }
}

function updateSearch() {
  const query = normalized(search.value)
  const terms = [...words(query)]
  const matches = []
  for (const section of terms.length ? index : []) {
    let score = 0
    for (const term of terms) {
      if (section.headingWords.has(term)) score += 5
      else if (section.titleWords.has(term)) score += 3
      else if (section.bodyWords.has(term)) score += 1
      else { score = 0; break }
    }
    if (!score) continue
    if (section.headingText.includes(query)) score += 6 * terms.length
    else if (section.titleText.includes(query)) score += 5 * terms.length
    else if (section.bodyText.includes(query)) score += 4 * terms.length
    matches.push({ section, score })
  }
  matches.sort((a, b) => b.score - a.score)
  const items = matches.slice(0, 15).map(({ section }) => {
    const item = document.createElement('li')
    const label = section.name === section.title ? section.title : section.title + ' · ' + section.name
    item.append(linkTo(section.id, label))
    return item
  })
  results.replaceChildren(...items)
  results.hidden = !items.length
  status.hidden = !terms.length
  status.textContent = matches.length
    ? `找到 ${matches.length} 条结果，显示前 ${items.length} 条`
    : '没有找到相关知识'
}

search.addEventListener('input', updateSearch)
search.addEventListener('keydown', event => {
  if (event.key === 'Enter') results.querySelector('a')?.click()
})
results.addEventListener('click', event => {
  if (!event.target.closest('a') || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return
  search.value = ''
  updateSearch()
})
document.addEventListener('keydown', event => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault()
    search.focus()
    search.select()
  }
})
window.addEventListener('hashchange', () => navigate(true))
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]')
  if (link?.hash === location.hash && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
    event.preventDefault()
    navigate(true)
  }
})
navigate(Boolean(location.hash))
