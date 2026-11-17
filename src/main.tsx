import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import type { ConversationInfo } from './pages/popup/Popup'
import type { ExportConversation } from './lib/export'
import { isExportConversation } from './lib/export'

// Screen components
import Popup from './pages/popup/Popup'
import Library from './pages/library/Library'
import ExportConfig from './pages/export-config/ExportConfig'
import MessageSelection from './pages/message-selection/MessageSelection'

// Icon component
function App() {
  const [currentScreen, setCurrentScreen] = useState<'popup' | 'library' | 'export-config' | 'message-selection'>('popup')
  const [selectedConversation, setSelectedConversation] = useState<ConversationInfo | undefined>(undefined)
  const [capturedConversation, setCapturedConversation] = useState<ExportConversation | undefined>(undefined)

  // Inside the extension, show the most recently captured real
  // conversation instead of the demo one. Outside the extension
  // (dev server / preview) chrome.storage is absent, so the demo
  // conversation stays — nothing is faked either way.
  useEffect(() => {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return
    chrome.storage.local.get('chatsaver.latest', (result) => {
      const latest: unknown = result['chatsaver.latest']
      if (!isExportConversation(latest)) return
      setCapturedConversation(latest)
      setSelectedConversation({
        title: latest.title,
        platform: latest.platform,
        model: latest.model,
        metrics: latest.metrics,
      })
    })
  }, [])

  // Navigation function
  const navigateTo = (screen: string, conversation?: ConversationInfo) => {
    const knownScreens = ['popup', 'library', 'export-config', 'message-selection'] as const
    const target = (knownScreens as readonly string[]).includes(screen)
      ? (screen as (typeof knownScreens)[number])
      : 'popup'
    setSelectedConversation(conversation)
    setCurrentScreen(target)
  }

  return (
    <div className="min-h-screen bg-background text-primary-text">
      {currentScreen === 'popup' && <Popup navigateTo={navigateTo} conversation={selectedConversation} capturedConversation={capturedConversation} />}
      {currentScreen === 'library' && <Library navigateTo={navigateTo} selectedConversation={selectedConversation} />}
      {currentScreen === 'export-config' && <ExportConfig navigateTo={navigateTo} selectedConversation={selectedConversation} />}
      {currentScreen === 'message-selection' && <MessageSelection navigateTo={navigateTo} />}
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

export default App