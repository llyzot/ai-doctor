import { defineStore } from 'pinia'
import { callAI } from '../api/callAI'
import { buildFullPrompt, buildVotePrompt, buildFinalSummaryPrompt, formatHistoryForProvider } from '../utils/prompt'

function delay(ms) {
  return new Promise((res) => setTimeout(res, ms))
}

function sanitizeImageRecognitions(list) {
  if (!Array.isArray(list)) return []
  const now = Date.now()
  return list.map((item, idx) => {
    const status = normalizeStatus(item)
    return {
      id: item?.id || `img-${now}-${idx}`,
      name: item?.name || '',
      dataUrl: item?.dataUrl || item?.imageUrl || '',
      result: item?.result || '',
      status,
      error: item?.error || '',
      createdAt: item?.createdAt || now,
      raw: status === 'queued' || status === 'recognizing' ? item?.raw || '' : ''
    }
  })
}

function normalizeStatus(item) {
  const status = item?.status
  if (status === 'queued' || status === 'recognizing') return 'queued'
  if (status === 'error') return 'error'
  if (status === 'success') return 'success'
  if (item?.error) return 'error'
  if (item?.result) return 'success'
  return 'queued'
}

function summarizeImageRecognitions(list) {
  if (!Array.isArray(list) || !list.length) return ''
  return list
    .map((entry, idx) => ({ entry, idx }))
    .filter(({ entry }) => entry.status === 'success' && entry.result)
    .map(({ entry, idx }) => {
      const namePart = entry.name ? `（${entry.name}）` : ''
      return `图片${idx + 1}${namePart}: ${entry.result}`
    })
    .join('\n')
}

function sanitizeLinkedConsultations(list) {
  if (!Array.isArray(list)) return []
  return list
    .map((item, idx) => {
      if (!item) return null
      const id = typeof item.id === 'string' && item.id ? item.id : item?.sourceId || `linked-${idx}`
      const patientAge = item?.patientAge
      return {
        id,
        sourceId: item?.sourceId || id,
        consultationName: item?.consultationName || item?.name || `关联问诊${idx + 1}`,
        patientName: item?.patientName || '',
        patientGender: item?.patientGender || '',
        patientAge: Number.isFinite(patientAge) ? patientAge : patientAge === null || patientAge === undefined ? null : Number(patientAge) || null,
        pastHistory: item?.pastHistory || '',
        currentProblem: item?.currentProblem || '',
        imageRecognitionResult: item?.imageRecognitionResult || '',
        finalSummary: item?.finalSummary || '',
        finishedAt: item?.finishedAt || item?.finishedAt || '',
        metadata: item?.metadata || null
      }
    })
    .filter(Boolean)
}

export const useConsultStore = defineStore('consult', {
  state: () => ({
    consultationName: '',
    settings: {
      globalSystemPrompt:
        '你是一位资深的妇产科专家医生，拥有丰富的妇产科疾病诊断和治疗经验。你的任务是基于提供的患者病历进行专业分析和诊断。\n\n你正在参与一个妇产科多专家会诊。你会看到其他妇产科医生的诊断意见。请综合考虑他们的分析，这可能会启发你，但你必须保持自己独立的专业判断。\n\n你的发言必须遵循以下原则：\n1. 专业严谨: 你的分析必须基于妇产科医学知识、循证医学证据和病历信息，特别关注月经史、婚育史、妇科检查和超声结果。\n2. 独立思考: 不要为了迎合他人而轻易改变自己的核心观点。如果其他医生的观点是正确的，你可以表示赞同并加以补充；如果观点有误或你持有不同看法，必须明确、有理有据地指出。\n3. 安全第一: 特别关注妊娠期患者的用药安全、手术指征和急症识别（如异位妊娠、卵巢扭转、胎盘早剥等）。\n4. 目标导向: 会诊的唯一目标是为患者找到最适合的妇产科诊疗方案。\n5. 简洁清晰: 直接陈述你的核心诊断、分析和建议。\n\n【策略性要求】\n你必须展现战略性临床思维：\n- 制定分步骤的诊疗策略：先做什么检查确诊，再考虑哪些治疗方案，如何评估疗效\n- 提供备选方案：如果一线方案不适用或失败，次选方案是什么\n- 风险管理策略：识别潜在并发症，制定预防和应急预案\n- 长期管理计划：不仅关注当前问题，还要考虑随访、复发预防、生育力保护等\n\n【针对性要求】\n你的分析必须高度个体化，针对本患者的具体情况：\n- 深入分析患者的特殊性：年龄特点（如青春期、育龄期、围绝经期）、既往病史的影响、当前症状的独特之处\n- 关注关键细节：从病历中提取最有诊断价值的信息，解释其临床意义\n- 结合患者需求：考虑生育需求、手术耐受性、经济因素、依从性等个体化因素\n- 避免泛泛而谈：每一条建议都要说明"为什么适合这个患者"，而不是教科书式的通用建议\n\n现在，请根据下面的病历和已有的讨论，发表你的看法。',
      summaryPrompt: '请根据完整会诊内容，以妇产科专家口吻输出最终总结。你的总结必须体现高度的策略性和针对性：\n\n【策略性要求】\n1. 诊断策略：核心诊断及其诊断依据，鉴别诊断及排除依据（按可能性排序）\n2. 检查策略：必要的进一步检查及其目的、优先级、预期结果\n3. 治疗策略：分阶段治疗方案（急性期处理→过渡期治疗→长期管理），包含一线方案和备选方案\n4. 风险管理策略：潜在并发症识别、预防措施、应急预案（特别关注急症风险）\n5. 随访策略：随访时间点、观察指标、调整治疗的触发条件\n\n【针对性要求】\n- 针对本患者的年龄、病史、症状特点，解释为什么选择这些方案\n- 特别指出本病例的关键点和需要警惕的问题\n- 考虑患者的生育需求、手术耐受性等个体化因素\n- 提供具体的、可执行的建议（包括药物具体剂量、手术方式选择理由）\n\n请确保总结内容充实、逻辑清晰、切实可行。',
      turnOrder: 'random',
      maxRoundsWithoutElimination: 3
    },
    doctors: [],
    patientCase: {
      name: '',
      gender: '',
      age: null,
      menstrualHistory: '',
      marriageHistory: '',
      pastHistory: '',
      currentProblem: '',
      imageRecognitionResult: '',
      imageRecognitions: []
    },
    linkedConsultations: [],
    workflow: {
      phase: 'setup',
      currentRound: 0,
      roundsWithoutElimination: 0,
      activeTurn: null,
      turnQueue: [],
      paused: false
    },
    discussionHistory: [],
    lastRoundVotes: [],
    finalSummary: { status: 'idle', doctorId: null, doctorName: '', content: '', usedPrompt: '' }
  }),
  getters: {
    activeDoctors(state) {
      return state.doctors.filter((d) => d.status === 'active')
    },
    anyApiKeys(state) {
      return state.doctors.some((d) => d.apiKey)
    }
  },
  actions: {
    setConsultationName(name) {
      const value = typeof name === 'string' ? name.trim() : ''
      this.consultationName = value
    },
    setSettings(newSettings) {
      this.settings = { ...this.settings, ...newSettings }
    },
    setDoctors(newDoctors) {
      this.doctors = newDoctors
    },
    setPatientCase(caseInfo) {
      const payload = { ...this.patientCase, ...caseInfo }
      if (caseInfo?.imageRecognitions !== undefined) {
        payload.imageRecognitions = sanitizeImageRecognitions(caseInfo.imageRecognitions)
        const summary = summarizeImageRecognitions(payload.imageRecognitions)
        if (summary) {
          payload.imageRecognitionResult = summary
        } else if (!payload.imageRecognitionResult) {
          payload.imageRecognitionResult = ''
        }
      }
      if (!Array.isArray(payload.imageRecognitions)) {
        payload.imageRecognitions = []
      }
      this.patientCase = payload
    },
    setLinkedConsultations(list, options = {}) {
      const { syncPatientInfo = true } = options
      const sanitized = sanitizeLinkedConsultations(list)
      this.linkedConsultations = sanitized
      if (syncPatientInfo && sanitized.length > 0) {
        const first = sanitized[0]
        const update = {}
        if (first.patientName !== undefined && first.patientName !== null) {
          update.name = String(first.patientName).trim()
        }
        if (first.patientGender !== undefined && first.patientGender !== null) {
          update.gender = String(first.patientGender).trim()
        }
        if (first.patientAge !== undefined) {
          if (first.patientAge === null || first.patientAge === undefined || first.patientAge === '') {
            update.age = null
          } else {
            const ageNumber = Number(first.patientAge)
            update.age = Number.isFinite(ageNumber) ? ageNumber : null
          }
        }
        if (Object.keys(update).length > 0) {
          this.setPatientCase(update)
        }
      }
    },
    addPatientMessage(text) {
      const content = String(text || '').trim()
      if (!content) return
      const name = this.patientCase?.name ? `患者（${this.patientCase.name}）` : '患者'
      this.discussionHistory.push({ type: 'patient', author: name, content })
    },
    resetVotes() {
      this.doctors = this.doctors.map((d) => ({ ...d, votes: 0 }))
    },
    startConsultation() {
      if (!this.patientCase.name || !this.patientCase.currentProblem) {
        throw new Error('请填写患者姓名和主诉')
      }
      if (!this.doctors || this.doctors.length === 0) {
        throw new Error('请添加至少一位医生后再开始会诊（可在设置中添加）')
      }
      // 新的问诊开始时，所有医生恢复为在席状态，清空票数，并取消暂停
      this.doctors = this.doctors.map((d) => ({ ...d, status: 'active', votes: 0 }))
      this.workflow.phase = 'discussion'
      this.workflow.currentRound = 1
      this.workflow.roundsWithoutElimination = 0
      this.workflow.paused = false
      this.finalSummary = { status: 'idle', doctorId: null, doctorName: '', content: '', usedPrompt: '' }
      this.discussionHistory.push({ type: 'system', content: `第 ${this.workflow.currentRound} 轮会诊开始` })
      this.generateTurnQueue()
      this.runDiscussionRound()
    },
    generateTurnQueue() {
      const actives = this.doctors.filter((d) => d.status === 'active').map((d) => d.id)
      if (this.settings.turnOrder === 'random') {
        this.workflow.turnQueue = actives
          .map((id) => ({ id, r: Math.random() }))
          .sort((a, b) => a.r - b.r)
          .map((x) => x.id)
      } else {
        this.workflow.turnQueue = this.doctors.filter((d) => d.status === 'active').map((d) => d.id)
      }
    },
    async runDiscussionRound() {
      for (const doctorId of this.workflow.turnQueue) {
        const doctor = this.doctors.find((d) => d.id === doctorId)
        if (!doctor || doctor.status !== 'active') continue

        // 如被暂停，等待恢复
        await this.waitWhilePaused()

        this.workflow.activeTurn = doctorId
        // 提示“正在输入...”，随后在得到回复后移除
        const typingIndex = this.discussionHistory.push({ type: 'system', content: `${doctor.name} 正在输入...` }) - 1
        const systemPrompt = doctor.customPrompt || this.settings.globalSystemPrompt
        const fullPrompt = buildFullPrompt(systemPrompt, this.patientCase, this.discussionHistory, doctor.id, this.linkedConsultations)
        try {
          const providerHistory = formatHistoryForProvider(this.discussionHistory, this.patientCase, doctor.id)
          const response = await callAI(doctor, fullPrompt, providerHistory)

          // 移除“正在输入...”提示
          this.discussionHistory.splice(typingIndex, 1)

          // 先插入空内容的医生气泡，然后打字机式填充
          const msg = { type: 'doctor', doctorId: doctor.id, doctorName: doctor.name, content: '' }
          this.discussionHistory.push(msg)
          const messageIndex = this.discussionHistory.length - 1

          for (let i = 0; i < response.length; i++) {
            await this.waitWhilePaused()
            this.discussionHistory[messageIndex].content += response[i]
            await delay(15)
          }

          this.workflow.activeTurn = null
        } catch (e) {
          this.workflow.activeTurn = null
          // 确保提示被移除
          try { this.discussionHistory.splice(typingIndex, 1) } catch (err) {}
          this.discussionHistory.push({
            type: 'doctor',
            doctorId: doctor.id,
            doctorName: doctor.name,
            content: `调用 ${doctor.name} 失败: ${e.message || e}`
          })
        }
      }
      this.workflow.phase = 'voting'
      this.discussionHistory.push({ type: 'system', content: '本轮发言结束，医生团队正在评估答案...' })
      await this.autoVoteAndProceed()
    },
    // 控制暂停/恢复
    pause() { this.workflow.paused = true },
    resume() { this.workflow.paused = false },
    togglePause() { this.workflow.paused = !this.workflow.paused },

    async waitWhilePaused() {
      while (this.workflow.paused) {
        await delay(100)
      }
    },

    async autoVoteAndProceed() {
      // 使用模型驱动的自动投票（允许投自己）
      this.resetVotes()
      this.lastRoundVotes = []

      function parseVoteJSON(text) {
        if (!text || typeof text !== 'string') return null
        // 尝试截取第一个 { 到最后一个 }
        const start = text.indexOf('{')
        const end = text.lastIndexOf('}')
        if (start !== -1 && end !== -1 && end > start) {
          const candidate = text.slice(start, end + 1)
          try {
            return JSON.parse(candidate)
          } catch (e) {
            // 尝试简单修复：将单引号替换为双引号
            try {
              const fixed = candidate.replace(/'/g, '"')
              return JSON.parse(fixed)
            } catch (e2) {
              return null
            }
          }
        }
        return null
      }

      const activeDocs = this.doctors.filter((d) => d.status === 'active')
      const activeIds = activeDocs.map((d) => d.id)

      for (const voterDoc of activeDocs) {
        await this.waitWhilePaused()
        let targetId = null
        let reason = ''

        try {
          // 如果无 API Key，则使用确定性的回退策略：自投
          if (!voterDoc.apiKey) {
            targetId = voterDoc.id
            reason = '模拟模式：自评其答案需进一步论证，标注自己。'
          } else {
            const systemPrompt = voterDoc.customPrompt || this.settings.globalSystemPrompt
            const fullPrompt = buildVotePrompt(systemPrompt, this.patientCase, this.discussionHistory, activeDocs, voterDoc, this.linkedConsultations)
            const providerHistory = formatHistoryForProvider(this.discussionHistory, this.patientCase, voterDoc.id)
            const response = await callAI(voterDoc, fullPrompt, providerHistory)
            const parsed = parseVoteJSON(response)
            if (parsed && typeof parsed.targetDoctorId === 'string') {
              targetId = parsed.targetDoctorId
              reason = String(parsed.reason || '').trim() || '综合讨论后做出的判断。'
            }
          }
        } catch (e) {
          // 忽略错误，使用回退
        }

        if (!targetId || !activeIds.includes(targetId)) {
          // 若解析失败或模型选择了不在列表中的ID，回退为自标
          targetId = voterDoc.id
          if (!reason) reason = '解析失败：默认标注自己。'
        }

        const targetDoc = this.doctors.find((d) => d.id === targetId)

        this.lastRoundVotes.push({
          round: this.workflow.currentRound,
          voterId: voterDoc?.id,
          voterName: voterDoc?.name,
          targetId: targetDoc?.id,
          targetName: targetDoc?.name,
          reason
        })

        this.discussionHistory.push({
          type: 'vote_detail',
          voterId: voterDoc?.id,
          voterName: voterDoc?.name,
          targetId: targetDoc?.id,
          targetName: targetDoc?.name,
          reason
        })

        this.voteForDoctor(targetId)
        await delay(50)
      }
      await delay(200)
      await this.confirmVote()
    },

    voteForDoctor(doctorId) {
      this.doctors = this.doctors.map((d) => (d.id === doctorId ? { ...d, votes: d.votes + 1 } : d))
    },
    async confirmVote() {
      const result = this.tallyVotes()
      this.discussionHistory.push({ type: 'vote_result', content: result.message })
      const ended = this.checkEndConditions(result.eliminated)
      if (!ended) {
        this.resetVotes()
        this.workflow.currentRound += 1
        this.discussionHistory.push({ type: 'system', content: `第 ${this.workflow.currentRound} 轮会诊开始` })
        this.workflow.phase = 'discussion'
        this.generateTurnQueue()
        await this.runDiscussionRound()
      }
    },
    async generateFinalSummary(preferredDoctorId) {
      try {
        const activeDocs = this.doctors.filter((d) => d.status === 'active')
        const summarizer = preferredDoctorId ? this.doctors.find((d) => d.id === preferredDoctorId) : (activeDocs[0] || this.doctors[0] || null)
        if (!summarizer) return
        const usedPrompt = this.settings.summaryPrompt || '请根据完整会诊内容，以临床医生口吻输出最终总结：包含核心诊断、依据、鉴别诊断、检查建议、治疗建议、随访计划和风险提示。'
        this.finalSummary = { status: 'pending', doctorId: summarizer.id, doctorName: summarizer.name, content: '', usedPrompt }
        const fullPrompt = buildFinalSummaryPrompt(usedPrompt, this.patientCase, this.discussionHistory, summarizer.id, this.linkedConsultations)
        const providerHistory = formatHistoryForProvider(this.discussionHistory, this.patientCase, summarizer.id)
        const response = await callAI(summarizer, fullPrompt, providerHistory)
        this.finalSummary = { status: 'ready', doctorId: summarizer.id, doctorName: summarizer.name, content: response, usedPrompt }
      } catch (e) {
        this.finalSummary = { ...(this.finalSummary || {}), status: 'error', content: `生成总结失败：${e?.message || e}` }
      }
    },
    tallyVotes() {
      const activeOrElim = this.doctors.filter((d) => d.status === 'active')
      const maxVotes = Math.max(0, ...activeOrElim.map((d) => d.votes))
      const top = activeOrElim.filter((d) => d.votes === maxVotes)
      if (top.length !== 1 || maxVotes === 0) {
        this.workflow.roundsWithoutElimination += 1
        return { eliminated: null, message: '评估结束：因意见不一或未明确，本轮未标注不太准确。' }
      }
      const target = top[0]
      this.doctors = this.doctors.map((d) => (d.id === target.id ? { ...d, status: 'eliminated' } : d))
      this.workflow.roundsWithoutElimination = 0
      return { eliminated: target, message: `评估结束：${target.name} 已被标注为不太准确，并暂停参与后续讨论。` }
    },
    checkEndConditions(eliminated) {
      const activeCount = this.doctors.filter((d) => d.status === 'active').length
      if (this.workflow.roundsWithoutElimination >= this.settings.maxRoundsWithoutElimination) {
        this.workflow.phase = 'finished'
        this.discussionHistory.push({ type: 'system', content: '达到未标注不太准确轮数上限，会诊结束。' })
        // 无单一推荐者时也需要输出最终答案，默认由首位在席医生生成
        this.generateFinalSummary()
        return true
      }
      if (activeCount <= 1) {
        this.workflow.phase = 'finished'
        if (activeCount === 1) {
          const winner = this.doctors.find((d) => d.status === 'active')
          this.discussionHistory.push({ type: 'system', content: `会诊结束：采用 ${winner?.name || ''} 的答案。` })
          this.generateFinalSummary(winner?.id)
        } else {
          this.discussionHistory.push({ type: 'system', content: '会诊结束：无在席医生。' })
          this.generateFinalSummary()
        }
        return true
      }
      this.workflow.phase = 'voting'
      return false
    }
  }
})
