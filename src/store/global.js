import { defineStore } from 'pinia'

const GLOBAL_DOCTORS_KEY = 'global_doctors_config'

function loadGlobalDoctors() {
  try {
    const raw = localStorage.getItem(GLOBAL_DOCTORS_KEY)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return arr
    }
  } catch (e) {}
  // 默认全局医生配置（不包含状态与票数）
  return [
    {
      id: 'doc-1',
      name: 'Dr. 高危产科智能顾问',
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: '',
      baseUrl: '',
      customPrompt: '你是一位专长于高危妊娠管理的妇产科专家，擅长评估妊娠期并发症、胎儿监护与急症识别。'
    },
    {
      id: 'doc-2',
      name: 'Dr. 妇科微创手术专家',
      provider: 'anthropic',
      model: 'claude-3-haiku-20240307',
      apiKey: '',
      baseUrl: '',
      customPrompt: '你擅长妇科肿瘤、子宫内膜异位症、子宫肌瘤等疾病的综合诊疗与手术策略制定。'
    },
    {
      id: 'doc-3',
      name: 'Dr. 生殖内分泌顾问',
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      apiKey: '',
      baseUrl: '',
      customPrompt: '你专注于月经失调、多囊卵巢综合征、辅助生殖等内分泌与生育问题的诊疗。'
    }
  ]
}

function saveGlobalDoctors(list) {
  localStorage.setItem(GLOBAL_DOCTORS_KEY, JSON.stringify(list || []))
}

const IMAGE_RECOGNITION_KEY = 'global_image_recognition_config'

function normalizeMaxConcurrent(value) {
  const num = Number(value)
  if (Number.isFinite(num) && num >= 1) {
    return Math.floor(num)
  }
  return 1
}

function loadImageRecognitionConfig() {
  const defaults = {
    enabled: false,
    provider: 'siliconflow',
    model: 'Pro/Qwen/Qwen2-VL-72B-Instruct',
    apiKey: '',
    baseUrl: '',
    prompt:
      '识别妇产科相关的影像资料。请仔细观察图片中的所有细节，用专业医学术语描述图片内容，包括：1）影像类型（B超、阴超、宫腔镜、病理切片等）；2）观察到的关键结构（子宫、卵巢、胎儿、胎盘等）；3）异常发现（包块、囊肿、肌瘤、息肉、出血、畸形等）的位置、大小、形态、回声特征；4）孕周评估（如适用）；5）其他重要临床信息。如果图片与妇产科诊断无关，请明确说明。请使用专业、严谨的语气进行描述。',
    maxConcurrent: 1
  }
  try {
    const raw = localStorage.getItem(IMAGE_RECOGNITION_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return {
        ...defaults,
        ...parsed,
        maxConcurrent: normalizeMaxConcurrent(parsed?.maxConcurrent ?? defaults.maxConcurrent)
      }
    }
  } catch (e) {}
  return defaults
}

function saveImageRecognitionConfig(config) {
  localStorage.setItem(IMAGE_RECOGNITION_KEY, JSON.stringify(config))
}

const PRESET_PROMPTS_KEY = 'global_preset_prompts'

function loadPresetPrompts() {
  try {
    const raw = localStorage.getItem(PRESET_PROMPTS_KEY)
    if (raw) {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return arr
    }
  } catch (e) {}
  // 妇产科专科预设提示词
  return [
    {
      id: 'preset-1',
      name: '高危妊娠专家',
      prompt: '你是一位资深的高危妊娠专家，擅长管理妊娠期高血压、妊娠期糖尿病、前置胎盘、胎盘早剥、多胎妊娠、胎儿宫内生长受限等高危情况。你特别关注孕妇的既往病史、产检结果、胎儿监护指标，并能及时识别需要终止妊娠的急症。你的诊疗决策基于母婴安全第一的原则。'
    },
    {
      id: 'preset-2',
      name: '围产医学专家',
      prompt: '你是一位经验丰富的围产医学专家，精通产前诊断、胎儿医学、分娩管理和产后护理。你擅长解读各类产前筛查与诊断结果（如唐筛、NIPT、羊水穿刺、超声异常），评估分娩方式选择，处理产程异常和产后出血等并发症。你注重个体化围产期管理。'
    },
    {
      id: 'preset-3',
      name: '妇科肿瘤专家',
      prompt: '你是一位资深的妇科肿瘤专家，精通子宫颈癌、子宫内膜癌、卵巢癌、滋养细胞肿瘤等妇科恶性肿瘤的诊断、分期、手术治疗和综合治疗。你关注肿瘤标志物、影像学检查和病理结果，能制定规范的手术方案和化疗方案，并评估预后。'
    },
    {
      id: 'preset-4',
      name: '妇科内分泌专家',
      prompt: '你是一位妇科内分泌专家，擅长诊疗月经失调、多囊卵巢综合征、功能失调性子宫出血、闭经、绝经综合征等内分泌疾病。你重视激素水平检测、超声监测卵泡发育，并能提供个体化的激素治疗方案。你还关注生育需求和避孕指导。'
    },
    {
      id: 'preset-5',
      name: '生殖医学专家',
      prompt: '你是一位生殖医学与不孕不育专家，精通辅助生殖技术（IVF/ICSI）、排卵障碍、输卵管因素、男性因素不育的诊疗。你擅长制定促排卵方案、评估卵巢储备功能、指导胚胎移植时机，并关注复发性流产的病因筛查与处理。'
    },
    {
      id: 'preset-6',
      name: '妇科微创手术专家',
      prompt: '你是一位妇科微创手术专家，精通腹腔镜、宫腔镜手术技术。你擅长诊疗子宫肌瘤、子宫内膜异位症、卵巢囊肿、异位妊娠、宫腔粘连等需要手术干预的疾病。你能评估手术指征、选择最佳手术方式、预防并发症，并提供术后康复指导。'
    },
    {
      id: 'preset-7',
      name: '盆底功能障碍专家',
      prompt: '你是一位盆底功能障碍与泌尿妇科专家，擅长诊疗盆腔器官脱垂、压力性尿失禁、急迫性尿失禁、性功能障碍等。你关注患者的盆底肌力评估、尿动力学检查结果，能提供保守治疗（盆底康复）或手术治疗方案。'
    },
    {
      id: 'preset-8',
      name: '妇科炎症与感染专家',
      prompt: '你是一位妇科感染性疾病专家，精通阴道炎、宫颈炎、盆腔炎、性传播疾病（STD）的诊疗。你重视病原学检查、药物敏感试验结果，能选择合适的抗感染药物，并关注慢性盆腔痛和不孕的关联。你还擅长妇科急腹症（如卵巢囊肿扭转、输卵管脓肿）的识别。'
    },
    {
      id: 'preset-9',
      name: '青春期与儿童妇科专家',
      prompt: '你是一位青春期及儿童妇科专家，擅长处理青春期月经异常、性早熟、幼女外阴炎、先天性生殖系统畸形等问题。你关注青少年的心理健康、性教育需求，并能提供适合年龄特点的诊疗方案。'
    },
    {
      id: 'preset-10',
      name: '产科急症专家',
      prompt: '你是一位产科急症处理专家，擅长识别和处理异位妊娠破裂、先兆子痫/子痫、胎盘早剥、羊水栓塞、产后大出血、子宫破裂等产科急危重症。你能快速做出诊断并启动抢救流程，强调时间就是生命的原则。'
    },
    {
      id: 'preset-11',
      name: '胎儿医学与产前诊断专家',
      prompt: '你是一位胎儿医学专家，精通胎儿超声诊断、染色体异常筛查、胎儿结构畸形诊断与遗传咨询。你能解读NT增厚、超声软指标异常、胎儿心脏畸形等复杂情况，并提供专业的产前诊断建议和遗传咨询。'
    },
    {
      id: 'preset-12',
      name: '妇产科超声影像专家',
      prompt: '你是一位妇产科超声影像专家，擅长解读经腹部及经阴道超声、三维/四维超声、多普勒超声结果。你能准确评估子宫肌层病变、卵巢肿物性质、胎儿生长发育、胎盘位置与成熟度、羊水量、脐血流等指标，并提供影像学诊断建议。'
    }
  ]
}

function savePresetPrompts(list) {
  localStorage.setItem(PRESET_PROMPTS_KEY, JSON.stringify(list || []))
}

export const useGlobalStore = defineStore('global', {
  state: () => ({
    doctors: loadGlobalDoctors(),
    imageRecognition: loadImageRecognitionConfig(),
    presetPrompts: loadPresetPrompts()
  }),
  actions: {
    setDoctors(list) {
      // 仅保存必要字段，避免混入 status/votes 等会诊内状态
      const sanitized = (list || []).map((d) => ({
        id: d.id,
        name: d.name,
        provider: d.provider,
        model: d.model,
        apiKey: d.apiKey,
        baseUrl: d.baseUrl,
        customPrompt: d.customPrompt
      }))
      this.doctors = sanitized
      saveGlobalDoctors(sanitized)
    },
    setImageRecognition(config) {
      const payload = {
        enabled: !!config?.enabled,
        provider: config?.provider || 'siliconflow',
        model: config?.model || 'Pro/Qwen/Qwen2-VL-72B-Instruct',
        apiKey: config?.apiKey || '',
        baseUrl: config?.baseUrl || '',
        prompt:
          config?.prompt ||
          '识别妇产科相关的影像资料。请仔细观察图片中的所有细节，用专业医学术语描述图片内容，包括：1）影像类型（B超、阴超、宫腔镜、病理切片等）；2）观察到的关键结构（子宫、卵巢、胎儿、胎盘等）；3）异常发现（包块、囊肿、肌瘤、息肉、出血、畸形等）的位置、大小、形态、回声特征；4）孕周评估（如适用）；5）其他重要临床信息。如果图片与妇产科诊断无关，请明确说明。请使用专业、严谨的语气进行描述。',
        maxConcurrent: normalizeMaxConcurrent(config?.maxConcurrent ?? 1)
      }
      this.imageRecognition = payload
      saveImageRecognitionConfig(payload)
    },
    setPresetPrompts(list) {
      const timestamp = Date.now()
      const sanitized = (list || []).map((p, index) => {
        const id = typeof p?.id === 'string' && p.id ? p.id : `preset-${timestamp}-${index}`
        const name = typeof p?.name === 'string' ? p.name : ''
        const prompt = typeof p?.prompt === 'string' ? p.prompt : ''
        return {
          id,
          name,
          prompt
        }
      })
      this.presetPrompts = sanitized
      savePresetPrompts(sanitized)
    }
  }
})
