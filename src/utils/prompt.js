export function buildFullPrompt(systemPrompt, caseInfo, discussionHistory, currentDoctorId, linkedConsultations = [], options = {}) {
  const { roundPhase, enableChallengeMode } = options
  const caseText = formatCase(caseInfo)
  const linkedText = formatLinkedConsultations(linkedConsultations)
  const historyText = discussionHistory
    .filter((m) => m.type === 'doctor' || m.type === 'patient')
    .map((m) => {
      if (m.type === 'doctor') {
        const isSelf = currentDoctorId && m.doctorId === currentDoctorId
        return isSelf ? `${m.doctorName}（你自己的发言）: ${m.content}` : `${m.doctorName}: ${m.content}`
      }
      const patientName = caseInfo?.name ? `患者（${caseInfo.name}）` : '患者'
      return `${patientName}: ${m.content}`
    })
    .join('\n')

  let user = `【患者病历】\n${caseText}`
  if (linkedText) {
    user += `\n\n【关联问诊（参考）】\n${linkedText}`
  }
  user += `\n\n【讨论与患者补充】\n${historyText || '（暂无）'}\n\n`

  // 根据讨论阶段调整指令
  if (roundPhase === 'initial') {
    user += `【当前阶段：初步诊断】\n请给出你的初步诊断思路和核心判断。重点说明：1）最可能的诊断及依据；2）需要进一步明确的关键信息；3）初步处置建议。`
  } else if (roundPhase === 'challenge' && enableChallengeMode) {
    user += `【当前阶段：质疑与辩论】\n请批判性地审视其他医生的观点：1）指出你认为存在疑问或不够准确的观点，并说明理由；2）提出你的不同见解及支持证据；3）如果其他医生提出了你未考虑的重要点，请补充你的分析。要敢于质疑，体现学术辩论精神。`
  } else if (roundPhase === 'consensus') {
    user += `【当前阶段：共识与优化】\n综合前面的讨论，请给出你的最终判断和完整的诊疗策略：1）明确诊断与鉴别诊断；2）分阶段诊疗方案（检查→治疗→随访）；3）风险管理与备选方案；4）个体化考虑因素。`
  } else {
    user += `请基于上述信息，聚焦本患者的关键问题，给出核心判断，并提供分步骤、可执行的诊疗策略与重点随访要点。`
  }

  return { system: systemPrompt, user }
}

export function buildVotePrompt(systemPrompt, caseInfo, discussionHistory, doctors, voter, linkedConsultations = []) {
  const caseText = formatCase(caseInfo)
  const linkedText = formatLinkedConsultations(linkedConsultations)
  const historyText = discussionHistory
    .filter((m) => m.type === 'doctor' || m.type === 'patient')
    .map((m) => {
      if (m.type === 'doctor') {
        const isSelf = voter?.id && m.doctorId === voter.id
        return isSelf ? `${m.doctorName}（你自己的发言）: ${m.content}` : `${m.doctorName}: ${m.content}`
      }
      const patientName = caseInfo?.name ? `患者（${caseInfo.name}）` : '患者'
      return `${patientName}: ${m.content}`
    })
    .join('\n')

  const doctorList = (doctors || [])
    .map((d) => `- ${d.name}（ID: ${d.id}）`)
    .join('\n')

  const voteInstruction =
    '你现在处于评估阶段，请根据上述讨论标注你认为本轮最不太准确的答案对应的医生（可选择自己）。请严格仅输出一个JSON对象，不要包含任何其它文字或标记。JSON格式如下：{"targetDoctorId":"<医生ID>","reason":"<简短理由>"}\n请确保 targetDoctorId 必须是下面医生列表中的ID之一。'

  let user = `【患者病历】\n${caseText}`
  if (linkedText) {
    user += `\n\n【关联问诊（参考）】\n${linkedText}`
  }
  user += `\n\n【讨论与患者补充】\n${historyText || '（暂无）'}\n\n【医生列表】\n${doctorList}\n\n你是 ${voter?.name || ''}（ID: ${voter?.id || ''}）。${voteInstruction}`
  const system = `${systemPrompt}\n\n重要：现在只需进行评估并输出结果。严格仅输出JSON对象，格式为 {"targetDoctorId":"<医生ID>","reason":"<简短理由>"}。不要输出解释、Markdown 或其他多余内容。`
  return { system, user }
}

export function buildFinalSummaryPrompt(systemPrompt, caseInfo, discussionHistory, summarizerId, linkedConsultations = []) {
  const caseText = formatCase(caseInfo)
  const linkedText = formatLinkedConsultations(linkedConsultations)
  const historyText = discussionHistory
    .filter((m) => m.type === 'doctor' || m.type === 'patient')
    .map((m) => {
      if (m.type === 'doctor') {
        const isSelf = summarizerId && m.doctorId === summarizerId
        return isSelf ? `${m.doctorName}（你自己的发言）: ${m.content}` : `${m.doctorName}: ${m.content}`
      }
      const patientName = caseInfo?.name ? `患者（${caseInfo.name}）` : '患者'
      return `${patientName}: ${m.content}`
    })
    .join('\n')

  let user = `【患者病历】\n${caseText}`
  if (linkedText) {
    user += `\n\n【关联问诊（参考）】\n${linkedText}`
  }
  user += `\n\n【完整会诊纪要】\n${historyText || '（暂无）'}\n\n请用中文，以临床医生的口吻，给出最终总结。请确保内容体现高度的策略性和针对性，至少包含：\n1) 核心诊断与风险分层（如无法明确请给出最可能诊断及概率）；\n2) 关键依据（条目式，突出与本病例最相关的信息）；\n3) 鉴别诊断（按可能性排序，并说明后续验证或排除策略）；\n4) 分阶段诊疗策略：近期处置步骤、进一步检查计划（含目的与预期）、长期管理或生育规划；\n5) 个体化治疗与处置建议（药物剂量/手术方式及选择理由，提供备选方案及触发条件）；\n6) 随访策略与复诊时机（包含需要监测的指标及调整治疗的信号）；\n7) 风险管理与患者教育要点（潜在并发症预警、应急预案、生活方式指导）。`
  return { system: systemPrompt, user }
}

export function formatHistoryForProvider(discussionHistory, caseInfo, currentDoctorId) {
  const msgs = []
  for (const item of discussionHistory) {
    if (item.type === 'doctor') {
      const isSelf = currentDoctorId && item.doctorId === currentDoctorId
      const label = isSelf ? `${item.doctorName}（你自己的发言）` : item.doctorName
      msgs.push({ role: 'assistant', content: `${label}: ${item.content}` })
    } else if (item.type === 'patient') {
      const patientName = caseInfo?.name ? `患者（${caseInfo.name}）` : '患者'
      msgs.push({ role: 'user', content: `${patientName}: ${item.content}` })
    } else if (item.type === 'system') {
      // skip or convert if needed
    }
  }
  return msgs
}

function formatCase(info) {
  const parts = []
  if (info.name) parts.push(`姓名: ${info.name}`)
  if (info.gender) {
    const genderMap = { male: '男', female: '女', other: '其他' }
    parts.push(`性别: ${genderMap[info.gender] || info.gender}`)
  }
  if (info.age !== null && info.age !== undefined) parts.push(`年龄: ${info.age}`)
  if (info.menstrualHistory) parts.push(`月经史: ${info.menstrualHistory}`)
  if (info.marriageHistory) parts.push(`婚育史: ${info.marriageHistory}`)
  if (info.pastHistory) parts.push(`既往妇科病史: ${info.pastHistory}`)
  if (info.currentProblem) parts.push(`主诉: ${info.currentProblem}`)
  if (info.imageRecognitionResult) parts.push(`妇产科影像识别结果: ${info.imageRecognitionResult}`)
  return parts.join('\n')
}

function formatLinkedConsultations(list) {
  if (!Array.isArray(list) || !list.length) return ''
  const genderMap = { male: '男', female: '女', other: '其他' }
  return list
    .map((item, idx) => {
      const block = []
      const title = item?.consultationName || item?.name || `关联问诊${idx + 1}`
      block.push(`${idx + 1}. ${title}`)
      const infoParts = []
      if (item?.patientName) infoParts.push(`患者: ${item.patientName}`)
      if (item?.patientGender) infoParts.push(`性别: ${genderMap[item.patientGender] || item.patientGender}`)
      if (item?.patientAge !== null && item?.patientAge !== undefined) infoParts.push(`年龄: ${item.patientAge}`)
      if (infoParts.length) block.push(infoParts.join('，'))
      if (item?.pastHistory) block.push(`既往疾病: ${item.pastHistory}`)
      if (item?.currentProblem) block.push(`本次问题: ${item.currentProblem}`)
      if (item?.imageRecognitionResult) block.push(`图片识别结果: ${item.imageRecognitionResult}`)
      if (item?.finalSummary) {
        block.push('最终答案（参考）:')
        block.push(item.finalSummary)
      }
      block.push('※ 上述内容仅供参考，请结合当前问诊独立判断。')
      return block.join('\n')
    })
    .join('\n\n')
}
