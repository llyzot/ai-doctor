import { defineStore } from 'pinia'

const SESSION_ARCHIVE_KEY = 'consultation_session_archive'
const MAX_ARCHIVED_SESSIONS = 50
const MAX_DISCUSSION_MESSAGES = 500

let persistTimer = null

function loadArchive() {
  try {
    const raw = localStorage.getItem(SESSION_ARCHIVE_KEY)
    if (!raw) return { sessions: [], settings: {} }
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return { sessions: parsed, settings: {} }
    }
    return {
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      settings: parsed.settings || {}
    }
  } catch (e) {
    console.error('Failed to load session archive:', e)
    return { sessions: [], settings: {} }
  }
}

function saveArchive(data) {
  try {
    const sessions = Array.isArray(data.sessions) ? data.sessions.slice(0, MAX_ARCHIVED_SESSIONS) : []
    const settings = data.settings || {}
    localStorage.setItem(SESSION_ARCHIVE_KEY, JSON.stringify({ sessions, settings }))
  } catch (e) {
    console.error('Failed to save session archive:', e)
  }
}

function createSessionSnapshot(store) {
  return {
    id: `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    consultationName: store.consultationName || '未命名会诊',
    patientCase: JSON.parse(JSON.stringify(store.patientCase)),
    doctors: JSON.parse(JSON.stringify(store.doctors)),
    linkedConsultations: JSON.parse(JSON.stringify(store.linkedConsultations || [])),
    discussionHistory: JSON.parse(JSON.stringify(store.discussionHistory || [])),
    workflow: JSON.parse(JSON.stringify(store.workflow)),
    finalSummary: JSON.parse(JSON.stringify(store.finalSummary)),
    lastRoundVotes: JSON.parse(JSON.stringify(store.lastRoundVotes || [])),
    metadata: {
      totalRounds: store.workflow?.currentRound || 0,
      totalMessages: (store.discussionHistory || []).length,
      activeDoctors: (store.doctors || []).filter(d => d.status === 'active').length,
      phase: store.workflow?.phase || 'unknown',
      hasFinished: store.workflow?.phase === 'finished'
    }
  }
}

function compressSession(session) {
  const compressed = { ...session }
  if (compressed.discussionHistory && compressed.discussionHistory.length > MAX_DISCUSSION_MESSAGES) {
    compressed.discussionHistory = [
      ...compressed.discussionHistory.slice(0, 50),
      {
        type: 'system',
        content: `[已压缩 ${compressed.discussionHistory.length - 100} 条中间消息]`
      },
      ...compressed.discussionHistory.slice(-50)
    ]
    compressed.metadata = compressed.metadata || {}
    compressed.metadata.compressed = true
    compressed.metadata.originalMessageCount = session.discussionHistory.length
  }
  return compressed
}

function validateSession(session) {
  if (!session || typeof session !== 'object') return false
  if (!session.id || !session.timestamp) return false
  if (!session.patientCase || typeof session.patientCase !== 'object') return false
  return true
}

function calculateSessionStats(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) {
    return {
      total: 0,
      finished: 0,
      inProgress: 0,
      totalMessages: 0,
      averageRounds: 0
    }
  }

  const finished = sessions.filter(s => s.metadata?.hasFinished).length
  const totalMessages = sessions.reduce((sum, s) => sum + (s.metadata?.totalMessages || 0), 0)
  const totalRounds = sessions.reduce((sum, s) => sum + (s.metadata?.totalRounds || 0), 0)

  return {
    total: sessions.length,
    finished,
    inProgress: sessions.length - finished,
    totalMessages,
    averageRounds: sessions.length > 0 ? (totalRounds / sessions.length).toFixed(1) : 0
  }
}

export const useSessionArchiveStore = defineStore('sessionArchive', {
  state: () => {
    const persisted = loadArchive()
    return {
      archivedSessions: persisted.sessions,
      autoArchiveEnabled: persisted.settings?.autoArchiveEnabled !== undefined ? persisted.settings.autoArchiveEnabled : true,
      compressionEnabled: persisted.settings?.compressionEnabled !== undefined ? persisted.settings.compressionEnabled : true
    }
  },

  getters: {
    sessionCount(state) {
      return state.archivedSessions.length
    },
    statistics(state) {
      return calculateSessionStats(state.archivedSessions)
    },
    sortedSessions(state) {
      return [...state.archivedSessions].sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    }
  },

  actions: {
    persist(immediate = false) {
      const save = () => {
        const payload = JSON.parse(JSON.stringify({
          sessions: this.archivedSessions,
          settings: {
            autoArchiveEnabled: this.autoArchiveEnabled,
            compressionEnabled: this.compressionEnabled
          }
        }))
        saveArchive(payload)
      }
      
      if (immediate) {
        if (persistTimer) {
          clearTimeout(persistTimer)
          persistTimer = null
        }
        save()
        return
      }

      if (persistTimer) {
        clearTimeout(persistTimer)
      }
      persistTimer = setTimeout(() => {
        persistTimer = null
        save()
      }, 300)
    },

    archiveCurrentSession(consultStore) {
      if (!consultStore) {
        throw new Error('必须提供会诊 store')
      }

      const snapshot = createSessionSnapshot(consultStore)
      
      if (!validateSession(snapshot)) {
        throw new Error('会话数据不完整，无法归档')
      }

      const processed = this.compressionEnabled ? compressSession(snapshot) : snapshot

      this.archivedSessions.unshift(processed)

      if (this.archivedSessions.length > MAX_ARCHIVED_SESSIONS) {
        this.archivedSessions = this.archivedSessions.slice(0, MAX_ARCHIVED_SESSIONS)
      }

      this.persist(true)
      return processed.id
    },

    restoreSession(sessionId, consultStore) {
      const session = this.archivedSessions.find(s => s.id === sessionId)
      if (!session) {
        throw new Error('未找到指定的会话')
      }

      if (!consultStore) {
        throw new Error('必须提供会诊 store')
      }

      consultStore.consultationName = session.consultationName || ''
      consultStore.setPatientCase(session.patientCase)
      consultStore.setDoctors(session.doctors)
      consultStore.setLinkedConsultations(session.linkedConsultations || [], { syncPatientInfo: false })
      consultStore.discussionHistory = [...(session.discussionHistory || [])]
      consultStore.workflow = { ...session.workflow }
      consultStore.finalSummary = { ...session.finalSummary }
      consultStore.lastRoundVotes = [...(session.lastRoundVotes || [])]

      return session
    },

    deleteSession(sessionId) {
      const index = this.archivedSessions.findIndex(s => s.id === sessionId)
      if (index === -1) {
        throw new Error('未找到指定的会话')
      }

      this.archivedSessions.splice(index, 1)
      this.persist(true)
    },

    clearAllSessions() {
      this.archivedSessions = []
      this.persist(true)
    },

    exportSession(sessionId, format = 'json') {
      const session = this.archivedSessions.find(s => s.id === sessionId)
      if (!session) {
        throw new Error('未找到指定的会话')
      }

      switch (format) {
        case 'json':
          return this.exportAsJSON(session)
        case 'markdown':
          return this.exportAsMarkdown(session)
        case 'html':
          return this.exportAsHTML(session)
        default:
          throw new Error(`不支持的格式: ${format}`)
      }
    },

    exportAsJSON(session) {
      return JSON.stringify(session, null, 2)
    },

    exportAsMarkdown(session) {
      const lines = []
      
      lines.push(`# ${session.consultationName}`)
      lines.push('')
      lines.push(`**归档时间**: ${new Date(session.timestamp).toLocaleString('zh-CN')}`)
      lines.push(`**会诊阶段**: ${session.metadata?.phase || '未知'}`)
      lines.push(`**讨论轮次**: ${session.metadata?.totalRounds || 0}`)
      lines.push('')
      
      lines.push('## 患者信息')
      lines.push('')
      const p = session.patientCase
      if (p.name) lines.push(`**姓名**: ${p.name}`)
      if (p.gender) {
        const genderMap = { male: '男', female: '女', other: '其他' }
        lines.push(`**性别**: ${genderMap[p.gender] || p.gender}`)
      }
      if (p.age) lines.push(`**年龄**: ${p.age}岁`)
      if (p.menstrualHistory) lines.push(`**月经史**: ${p.menstrualHistory}`)
      if (p.marriageHistory) lines.push(`**婚育史**: ${p.marriageHistory}`)
      if (p.pastHistory) lines.push(`**既往妇科病史**: ${p.pastHistory}`)
      if (p.currentProblem) lines.push(`**主诉**: ${p.currentProblem}`)
      if (p.imageRecognitionResult) lines.push(`**影像学检查**: ${p.imageRecognitionResult}`)
      lines.push('')
      
      lines.push('## 参与医生')
      lines.push('')
      session.doctors.forEach(d => {
        const status = d.status === 'active' ? '✅ 在席' : '❌ 离席'
        lines.push(`- **${d.name}** (${d.provider}) - ${status}`)
      })
      lines.push('')
      
      lines.push('## 讨论记录')
      lines.push('')
      session.discussionHistory.forEach((msg, idx) => {
        switch (msg.type) {
          case 'system':
            lines.push(`> **系统**: ${msg.content}`)
            break
          case 'doctor':
            lines.push(`### ${msg.doctorName}`)
            lines.push('')
            lines.push(msg.content)
            break
          case 'patient':
            lines.push(`### ${msg.author || '患者'}`)
            lines.push('')
            lines.push(msg.content)
            break
          case 'vote_result':
            lines.push(`> **投票结果**: ${msg.content}`)
            break
          case 'vote_detail':
            lines.push(`> ${msg.voterName} → ${msg.targetName}: ${msg.reason || ''}`)
            break
          case 'question':
            lines.push(`> ❓ **${msg.doctorName}问**: ${msg.content}`)
            break
        }
        lines.push('')
      })
      
      if (session.finalSummary && session.finalSummary.content) {
        lines.push('## 最终总结')
        lines.push('')
        lines.push(`**总结医生**: ${session.finalSummary.doctorName || '未知'}`)
        lines.push('')
        lines.push(session.finalSummary.content)
        lines.push('')
      }
      
      return lines.join('\n')
    },

    exportAsHTML(session) {
      const md = this.exportAsMarkdown(session)
      const html = md
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/\n\n/g, '</p><p>')

      return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${session.consultationName}</title>
  <style>
    body { font-family: 'Microsoft YaHei', sans-serif; max-width: 900px; margin: 40px auto; padding: 20px; line-height: 1.6; }
    h1 { color: #1890ff; border-bottom: 2px solid #1890ff; padding-bottom: 10px; }
    h2 { color: #52c41a; margin-top: 30px; }
    h3 { color: #fa8c16; margin-top: 20px; }
    blockquote { background: #f0f2f5; border-left: 4px solid #1890ff; padding: 10px 15px; margin: 10px 0; }
    li { margin: 5px 0; }
    strong { color: #262626; }
  </style>
</head>
<body>
  <p>${html}</p>
</body>
</html>`
    },

    downloadSession(sessionId, format = 'json') {
      const session = this.archivedSessions.find(s => s.id === sessionId)
      if (!session) {
        throw new Error('未找到指定的会话')
      }

      const content = this.exportSession(sessionId, format)

      if (typeof window === 'undefined' || typeof document === 'undefined' || typeof Blob === 'undefined') {
        console.warn('当前运行环境不支持直接触发下载，将返回导出内容。')
        return content
      }

      const blob = new Blob([content], { type: this.getMimeType(format) })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${session.consultationName}_${new Date(session.timestamp).toISOString().slice(0, 10)}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      return content
    },

    getMimeType(format) {
      const mimeTypes = {
        json: 'application/json',
        markdown: 'text/markdown',
        html: 'text/html'
      }
      return mimeTypes[format] || 'text/plain'
    },

    importSession(jsonString) {
      try {
        const session = JSON.parse(jsonString)
        
        if (!validateSession(session)) {
          throw new Error('导入的会话数据格式不正确')
        }

        if (!session.id) {
          session.id = `session-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        }

        const exists = this.archivedSessions.find(s => s.id === session.id)
        if (exists) {
          session.id = `${session.id}-imported-${Date.now()}`
        }

        this.archivedSessions.unshift(session)
        
        if (this.archivedSessions.length > MAX_ARCHIVED_SESSIONS) {
          this.archivedSessions = this.archivedSessions.slice(0, MAX_ARCHIVED_SESSIONS)
        }

        this.persist(true)
        return session.id
      } catch (e) {
        throw new Error(`导入失败: ${e.message}`)
      }
    },

    compareSessions(sessionId1, sessionId2) {
      const s1 = this.archivedSessions.find(s => s.id === sessionId1)
      const s2 = this.archivedSessions.find(s => s.id === sessionId2)

      if (!s1 || !s2) {
        throw new Error('未找到要对比的会话')
      }

      return {
        session1: {
          name: s1.consultationName,
          timestamp: s1.timestamp,
          metadata: s1.metadata
        },
        session2: {
          name: s2.consultationName,
          timestamp: s2.timestamp,
          metadata: s2.metadata
        },
        comparison: {
          roundsDiff: (s1.metadata?.totalRounds || 0) - (s2.metadata?.totalRounds || 0),
          messagesDiff: (s1.metadata?.totalMessages || 0) - (s2.metadata?.totalMessages || 0),
          samePatient: s1.patientCase?.name === s2.patientCase?.name,
          sameDoctorCount: s1.doctors?.length === s2.doctors?.length
        }
      }
    },

    setAutoArchive(enabled) {
      this.autoArchiveEnabled = enabled
      this.persist(true)
    },

    setCompression(enabled) {
      this.compressionEnabled = enabled
      this.persist(true)
    }
  }
})
