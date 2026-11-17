// Chat Saver — background service worker (Manifest V3).
// Owns the on-device store of captured conversations. Nothing here leaves
// the browser: captures are written to chrome.storage.local only.
'use strict'

const STORE_KEY = 'chatsaver.conversations'
const LATEST_KEY = 'chatsaver.latest'
const MAX_STORED = 50

function isMetrics(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.messages === 'number' &&
    typeof value.codeBlocks === 'number' &&
    typeof value.tables === 'number' &&
    typeof value.recency === 'string'
  )
}

function isConversation(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    typeof value.title === 'string' &&
    typeof value.platform === 'string' &&
    typeof value.model === 'string' &&
    typeof value.url === 'string' &&
    isMetrics(value.metrics) &&
    Array.isArray(value.messages)
  )
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get([STORE_KEY], (result) => {
    if (!Array.isArray(result[STORE_KEY])) {
      chrome.storage.local.set({ [STORE_KEY]: [] })
    }
  })
})

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message.type !== 'string') return false

  if (message.type === 'CHATSAVER_SAVE_CONVERSATION') {
    const conversation = message.conversation
    if (!isConversation(conversation)) {
      sendResponse({ ok: false, error: 'Invalid conversation payload.' })
      return false
    }
    chrome.storage.local.get([STORE_KEY], (result) => {
      const list = Array.isArray(result[STORE_KEY]) ? result[STORE_KEY] : []
      const next = [
        conversation,
        ...list.filter((item) => !isConversation(item) || item.url !== conversation.url),
      ].slice(0, MAX_STORED)
      chrome.storage.local.set({ [STORE_KEY]: next, [LATEST_KEY]: conversation }, () => {
        sendResponse({ ok: true, stored: next.length })
      })
    })
    return true // async sendResponse
  }

  if (message.type === 'CHATSAVER_GET_LATEST') {
    chrome.storage.local.get([LATEST_KEY], (result) => {
      const latest = result[LATEST_KEY]
      sendResponse({ ok: true, conversation: isConversation(latest) ? latest : null })
    })
    return true
  }

  if (message.type === 'CHATSAVER_GET_ALL') {
    chrome.storage.local.get([STORE_KEY], (result) => {
      const list = Array.isArray(result[STORE_KEY])
        ? result[STORE_KEY].filter(isConversation)
        : []
      sendResponse({ ok: true, conversations: list })
    })
    return true
  }

  return false
})
