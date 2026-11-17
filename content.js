// Chat Saver — content script.
// Runs on every page (see manifest.json), but only activates on recognised
// AI chat hosts. It reads the conversation visible on the page, offers a
// "Save this chat" button, and hands the extracted conversation to the
// background service worker for on-device storage. It never sends page
// content anywhere else.
//
// NOTE: chat-site layouts drift. Extraction is layered: role-marked nodes
// first (ChatGPT), then <article> turns, then the current ChatGPT exchange
// layout (Nov 2026), and it reports "no messages found" instead of guessing
// when nothing matches. Only the turns currently mounted in the DOM are
// captured: ChatGPT virtualises long threads, so off-screen turns are absent
// until scrolled into view.
'use strict'

const PLATFORMS = [
  { id: 'chatgpt', label: 'ChatGPT', hosts: ['chatgpt.com', 'chat.openai.com'] },
  { id: 'claude', label: 'Claude', hosts: ['claude.ai'] },
  { id: 'gemini', label: 'Gemini', hosts: ['gemini.google.com'] },
  { id: 'copilot', label: 'Copilot', hosts: ['copilot.microsoft.com'] },
  { id: 'perplexity', label: 'Perplexity', hosts: ['perplexity.ai'] },
  { id: 'grok', label: 'Grok', hosts: ['grok.com', 'x.com'] },
]

const FLOAT_BUTTON_ID = 'chatsaver-float-btn'
const TOAST_ID = 'chatsaver-toast'

function detectPlatform() {
  const host = window.location.hostname.replace(/^www\./, '')
  return PLATFORMS.find((platform) => platform.hosts.indexOf(host) !== -1) || null
}

function cleanText(node) {
  return (node.innerText || '').replace(/\s+\n/g, '\n').trim()
}

function pushTurn(turns, seen, role, element) {
  const text = cleanText(element)
  if (!text || seen.has(text)) return
  seen.add(text)
  turns.push({
    role,
    text,
    hasCode: element.querySelector('pre, code') !== null,
    hasTable: element.querySelector('table') !== null,
  })
}

// Layer 3 labels (current ChatGPT layout, Nov 2026). Each message starts
// with a screen-reader-only label span whose text is exactly one of these.
// Roles come from those labels, never guessed.
const CHATGPT_LABELS = { 'You said:': 'user', 'ChatGPT said:': 'assistant' }

// Block-level tags, used to restore the paragraph breaks innerText would
// have given when joining walked text nodes back into a transcript.
const BLOCK_TAGS = new Set([
  'P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'LI', 'UL', 'OL',
  'TABLE', 'TR', 'TD', 'TH', 'PRE', 'BLOCKQUOTE', 'SECTION', 'ARTICLE', 'FIGCAPTION', 'HR',
])

function nearestBlockAncestor(node, root) {
  let element = node.parentElement
  while (element && element !== root) {
    if (BLOCK_TAGS.has(element.tagName)) return element
    element = element.parentElement
  }
  return root
}

function pushSplitTurn(turns, seen, turn) {
  const text = turn.text.replace(/\s+\n/g, '\n').trim()
  if (!text || seen.has(text)) return
  seen.add(text)
  turns.push({
    role: turn.role,
    text,
    hasCode: turn.ancestors.has('PRE') || turn.ancestors.has('CODE'),
    hasTable: turn.ancestors.has('TABLE'),
  })
}

// Current ChatGPT layout (Nov 2026): each user+assistant exchange is an
// outermost `div.group.flex.flex-col` inside <main>. The exchange holds one
// "You said:" label span and one "ChatGPT said:" label span; the text after
// each label is that side's message. Buttons are stripped from a clone first
// so action labels (Copy, Read aloud, Edit message, …) never leak into the
// transcript. Exchanges with no labels are not turns and are skipped.
function extractCurrentChatGptTurns() {
  const turns = []
  const seen = new Set()
  const exchanges = [...document.querySelectorAll('main div.group.flex.flex-col')].filter(
    (element) => !element.parentElement?.closest('div.group.flex.flex-col'),
  )
  for (const exchange of exchanges) {
    const clone = exchange.cloneNode(true)
    clone.querySelectorAll('button').forEach((button) => button.remove())
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_TEXT)
    let current = null
    let lastBlock = null
    let node
    while ((node = walker.nextNode())) {
      const value = node.nodeValue || ''
      const labelRole = CHATGPT_LABELS[value.trim()]
      if (labelRole) {
        if (current) pushSplitTurn(turns, seen, current)
        current = { role: labelRole, text: '', ancestors: new Set() }
        lastBlock = null
        continue
      }
      if (!current) continue
      const block = nearestBlockAncestor(node, clone)
      if (current.text && block !== lastBlock && !/\s$/.test(current.text)) current.text += '\n'
      lastBlock = block
      current.text += value
      let ancestor = node.parentElement
      while (ancestor && ancestor !== clone) {
        current.ancestors.add(ancestor.tagName)
        ancestor = ancestor.parentElement
      }
    }
    if (current) pushSplitTurn(turns, seen, current)
  }
  return turns
}

function extractTurns() {
  const turns = []
  const seen = new Set()

  // Layer 3: current ChatGPT layout (see extractCurrentChatGptTurns). Tried
  // first on ChatGPT because the older layers match nothing there anymore.
  if (detectPlatform()?.id === 'chatgpt') {
    const currentTurns = extractCurrentChatGptTurns()
    if (currentTurns.length > 0) return currentTurns
  }

  // Layer 1: role-marked message nodes (ChatGPT and sites using the same
  // convention). Role comes from the page, never guessed.
  document.querySelectorAll('[data-message-author-role]').forEach((element) => {
    const roleAttr = element.getAttribute('data-message-author-role')
    const role = roleAttr === 'user' ? 'user' : roleAttr === 'assistant' ? 'assistant' : 'unknown'
    pushTurn(turns, seen, role, element)
  })
  if (turns.length > 0) return turns

  // Layer 2: <article> turns (used by several chat UIs). Roles are not
  // marked here, so they stay 'unknown' rather than being invented.
  document.querySelectorAll('main article, [data-testid="conversation"] article').forEach((element) => {
    pushTurn(turns, seen, 'unknown', element)
  })
  return turns
}

function extractConversation() {
  const platform = detectPlatform()
  const turns = extractTurns().slice(0, 500)
  const firstUser = turns.find((turn) => turn.role === 'user')
  const titleFromPage = document.title
    .replace(/\s*[|–—-]\s*(ChatGPT|Claude|Gemini|Copilot|Perplexity|Grok).*$/i, '')
    .trim()
  const title = titleFromPage || (firstUser ? firstUser.text.slice(0, 80) : 'Untitled conversation')
  return {
    title,
    platform: platform ? platform.label : 'Unknown',
    model: platform ? platform.label : 'Unknown',
    url: window.location.href,
    capturedAt: new Date().toISOString(),
    messages: turns,
    metrics: {
      messages: turns.length,
      codeBlocks: turns.filter((turn) => turn.hasCode).length,
      tables: turns.filter((turn) => turn.hasTable).length,
      recency: 'just now',
    },
  }
}

function showToast(text) {
  let toast = document.getElementById(TOAST_ID)
  if (!toast) {
    toast = document.createElement('div')
    toast.id = TOAST_ID
    document.body.appendChild(toast)
  }
  toast.textContent = text
  toast.classList.add('chatsaver-toast-visible')
  window.clearTimeout(showToast.timer)
  showToast.timer = window.setTimeout(() => {
    toast.classList.remove('chatsaver-toast-visible')
  }, 3500)
}

function saveCurrentChat() {
  const conversation = extractConversation()
  if (conversation.messages.length === 0) {
    showToast('Chat Saver: no conversation found on this page.')
    return
  }
  chrome.runtime.sendMessage(
    { type: 'CHATSAVER_SAVE_CONVERSATION', conversation },
    (response) => {
      if (chrome.runtime.lastError || !response || !response.ok) {
        showToast('Chat Saver: could not save — try reloading the page.')
        return
      }
      showToast(`Chat Saver: saved "${conversation.title}" (${conversation.metrics.messages} messages).`)
    },
  )
}

function injectSaveButton() {
  if (!detectPlatform()) return // inert on non-chat pages
  if (document.getElementById(FLOAT_BUTTON_ID)) return
  const button = document.createElement('button')
  button.id = FLOAT_BUTTON_ID
  button.type = 'button'
  button.textContent = 'Save this chat'
  button.addEventListener('click', saveCurrentChat)
  document.body.appendChild(button)
}

// Answers the popup / background when they ask the active tab directly.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== 'string') return false
  if (message.type === 'CHATSAVER_PING') {
    const platform = detectPlatform()
    sendResponse({ ok: true, platform: platform ? platform.label : null })
    return false
  }
  if (message.type === 'CHATSAVER_EXTRACT') {
    sendResponse({ ok: true, conversation: extractConversation() })
    return false
  }
  return false
})

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectSaveButton)
} else {
  injectSaveButton()
}
