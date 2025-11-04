// 妇产科医学计算器

export const obgynCalculators = {
  // 预产期计算（Naegele法则）
  calculateEDD(lmpDate) {
    if (!lmpDate) return null
    
    const lmp = new Date(lmpDate)
    if (isNaN(lmp.getTime())) return null
    
    // 预产期 = 末次月经 + 280天（40周）
    const edd = new Date(lmp)
    edd.setDate(edd.getDate() + 280)
    
    const ga = this.calculateGestationalAge(lmpDate)
    const trimester = this.getTrimester(lmpDate)
    
    return {
      edd: edd.toISOString().split('T')[0],
      eddFormatted: this.formatDate(edd),
      gestationalAge: ga,
      trimester,
      lmp: lmp.toISOString().split('T')[0]
    }
  },
  
  // 孕周计算
  calculateGestationalAge(lmpDate) {
    if (!lmpDate) return null
    
    const lmp = new Date(lmpDate)
    if (isNaN(lmp.getTime())) return null
    
    const now = new Date()
    const diffTime = now - lmp
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 0) {
      return { weeks: 0, days: 0, totalDays: 0, display: '未到孕期', valid: false }
    }
    
    const weeks = Math.floor(diffDays / 7)
    const days = diffDays % 7
    
    return {
      weeks,
      days,
      totalDays: diffDays,
      display: `${weeks}周+${days}天`,
      valid: true
    }
  },
  
  // 判断孕期阶段
  getTrimester(lmpDate) {
    const ga = this.calculateGestationalAge(lmpDate)
    if (!ga || !ga.valid) return '非孕期'
    
    if (ga.weeks < 14) return '孕早期（<14周）'
    if (ga.weeks < 28) return '孕中期（14-27周）'
    return '孕晚期（≥28周）'
  },
  
  // BMI计算
  calculateBMI(weight, height) {
    if (!weight || !height || weight <= 0 || height <= 0) return null
    
    // height单位：cm，weight单位：kg
    const heightInMeters = height / 100
    const bmi = weight / (heightInMeters * heightInMeters)
    
    let category = ''
    if (bmi < 18.5) category = '偏瘦'
    else if (bmi < 24) category = '正常'
    else if (bmi < 28) category = '超重'
    else category = '肥胖'
    
    return {
      bmi: bmi.toFixed(1),
      category,
      healthy: bmi >= 18.5 && bmi < 24
    }
  },
  
  // 妊娠期体重增长建议（基于孕前BMI）
  calculateWeightGain(prePregnancyBMI) {
    const bmi = parseFloat(prePregnancyBMI)
    if (isNaN(bmi) || bmi <= 0) return null
    
    if (bmi < 18.5) {
      return { 
        min: 12.5, 
        max: 18, 
        category: '偏瘦',
        recommendation: '建议孕期增重12.5-18kg'
      }
    } else if (bmi < 25) {
      return { 
        min: 11.5, 
        max: 16, 
        category: '正常',
        recommendation: '建议孕期增重11.5-16kg'
      }
    } else if (bmi < 30) {
      return { 
        min: 7, 
        max: 11.5, 
        category: '超重',
        recommendation: '建议孕期增重7-11.5kg'
      }
    } else {
      return { 
        min: 5, 
        max: 9, 
        category: '肥胖',
        recommendation: '建议孕期增重5-9kg'
      }
    }
  },
  
  // Bishop评分（宫颈成熟度评分）
  bishopScore(params) {
    const {
      cervixDilation = 0,    // 宫颈扩张（cm）：0=闭、1-2=1分、3-4=2分、≥5=3分
      cervixEffacement = 0,  // 宫颈消退（%）：0-30%=0分、40-50%=1分、60-70%=2分、≥80%=3分
      cervixStation = 0,     // 先露位置：-3=0分、-2=1分、-1/0=2分、+1/+2=3分
      cervixConsistency = 0, // 宫颈硬度：硬=0分、中等=1分、软=2分
      cervixPosition = 0     // 宫颈位置：后=0分、中=1分、前=2分
    } = params
    
    const scores = {
      dilation: cervixDilation,
      effacement: cervixEffacement,
      station: cervixStation,
      consistency: cervixConsistency,
      position: cervixPosition
    }
    
    const total = Object.values(scores).reduce((sum, val) => sum + (parseInt(val) || 0), 0)
    
    let interpretation = ''
    let recommendation = ''
    
    if (total >= 9) {
      interpretation = '宫颈高度成熟'
      recommendation = '可以引产，预期分娩顺利'
    } else if (total >= 6) {
      interpretation = '宫颈成熟'
      recommendation = '可以考虑引产'
    } else if (total >= 3) {
      interpretation = '宫颈欠成熟'
      recommendation = '建议先促宫颈成熟（前列腺素、Foley导管）'
    } else {
      interpretation = '宫颈不成熟'
      recommendation = '不宜引产，需充分促宫颈成熟或继续观察'
    }
    
    return {
      total,
      scores,
      interpretation,
      recommendation
    }
  },
  
  // 卵巢癌风险指数 RMI（Risk of Malignancy Index）
  calculateRMI(ca125, ultrasoundScore, menopausalStatus) {
    // ca125: 数值（U/ml）
    // ultrasoundScore: 0, 1, 3（根据超声特征：0=无异常，1=1个特征，3=2-5个特征）
    // 超声特征：多房、实性、双侧、腹水、转移
    // menopausalStatus: 'premenopausal' | 'postmenopausal'
    
    const M = menopausalStatus === 'postmenopausal' ? 3 : 1
    const U = parseInt(ultrasoundScore) || 0
    const CA = parseFloat(ca125) || 0
    
    const rmi = CA * U * M
    
    let risk = ''
    let recommendation = ''
    
    if (rmi < 25) {
      risk = '低风险'
      recommendation = '良性可能性大，建议随访观察'
    } else if (rmi < 250) {
      risk = '中等风险'
      recommendation = '建议妇科肿瘤专科会诊，进一步检查（MRI、肿瘤标志物）'
    } else {
      risk = '高风险'
      recommendation = '恶性可能性大，建议转诊妇科肿瘤专科，完善分期检查，准备手术'
    }
    
    return {
      rmi: rmi.toFixed(1),
      risk,
      recommendation,
      details: {
        ca125: CA,
        ultrasoundScore: U,
        menopausalFactor: M
      }
    }
  },
  
  // PCOS诊断（鹿特丹标准）
  diagnosePCOS(irregularMenstruation, hyperandrogenism, polycysticOvaries) {
    // 满足3项中的2项即可诊断
    const criteria = [
      { met: irregularMenstruation, name: '稀发排卵或无排卵' },
      { met: hyperandrogenism, name: '高雄激素的临床表现和/或高雄激素血症' },
      { met: polycysticOvaries, name: '卵巢多囊性改变（超声）' }
    ]
    
    const metCriteria = criteria.filter(c => c.met)
    const count = metCriteria.length
    
    const meetsDiagnostic = count >= 2
    
    return {
      meetsCriteria: meetsDiagnostic,
      criteriaCount: count,
      metCriteria: metCriteria.map(c => c.name),
      diagnosis: meetsDiagnostic ? 'PCOS诊断成立（鹿特丹标准）' : 'PCOS诊断不成立',
      nextSteps: meetsDiagnostic 
        ? '需排除其他高雄激素病因：CAH（17-OHP）、库欣综合征、高泌乳素血症、甲状腺疾病、卵巢或肾上腺肿瘤'
        : '建议进一步完善检查：激素六项、超声、胰岛素抵抗评估'
    }
  },
  
  // 辅助函数：格式化日期
  formatDate(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}年${month}月${day}日`
  }
}

// 妊娠期用药安全分级（FDA）
export const pregnancyDrugCategories = {
  A: { 
    level: '安全', 
    description: '对照研究未发现对胎儿有风险', 
    color: '#52c41a',
    example: '叶酸、维生素B6'
  },
  B: { 
    level: '较安全', 
    description: '动物研究未见风险，缺乏人类充分研究', 
    color: '#1890ff',
    example: '青霉素、头孢、甲硝唑（孕中晚期）、布洛芬（孕早中期）'
  },
  C: { 
    level: '谨慎使用', 
    description: '动物研究有不良反应，需权衡利弊', 
    color: '#faad14',
    example: '阿司匹林、地塞米松、氟康唑'
  },
  D: { 
    level: '有风险', 
    description: '有人类风险证据，但可能获益大于风险', 
    color: '#ff4d4f',
    example: '苯妥英钠、丙戊酸钠'
  },
  X: { 
    level: '禁用', 
    description: '明确致畸，禁用于妊娠期', 
    color: '#8c0000',
    example: '米索前列醇、甲氨蝶呤、异维A酸、华法林'
  }
}

// 常用妇产科药物数据库
export const commonObGynDrugs = [
  { 
    name: '叶酸', 
    category: 'A', 
    indication: '预防神经管缺陷', 
    dose: '0.4-0.8mg/日',
    timing: '孕前3个月至孕早期',
    note: '高风险人群（既往NTD、糖尿病、抗癫痫药）增至4mg/日'
  },
  { 
    name: '青霉素', 
    category: 'B', 
    indication: 'GBS感染、梅毒', 
    dose: '根据感染类型',
    note: '过敏者禁用'
  },
  { 
    name: '头孢类抗生素', 
    category: 'B', 
    indication: '各类感染', 
    dose: '根据具体药物',
    note: '孕期相对安全的抗生素'
  },
  { 
    name: '甲硝唑', 
    category: 'B', 
    indication: '细菌性阴道病、滴虫性阴道炎', 
    dose: '500mg bid×7天或2g单次',
    timing: '孕中晚期',
    warning: '孕早期避免使用'
  },
  { 
    name: '黄体酮', 
    category: 'B', 
    indication: '先兆流产、黄体功能不足', 
    dose: '口服100-200mg/日或阴道给药',
    note: '天然黄体酮较安全'
  },
  { 
    name: '缩宫素', 
    category: 'X', 
    indication: '引产、产后止血', 
    dose: '静滴或肌注',
    warning: '孕期禁用（引产除外），可致强直性宫缩、胎儿窘迫'
  },
  { 
    name: '米索前列醇', 
    category: 'X', 
    indication: '药物流产、引产、产后出血', 
    dose: '根据适应症',
    warning: '妊娠期禁用（除终止妊娠），可致子宫收缩和流产'
  },
  { 
    name: '甲氨蝶呤（MTX）', 
    category: 'X', 
    indication: '异位妊娠（药物治疗）、滋养细胞肿瘤', 
    dose: '50mg/m² IM 单次或多次',
    warning: '明确致畸，妊娠期禁用（除终止妊娠）'
  },
  { 
    name: '克罗米芬', 
    category: 'X', 
    indication: '促排卵', 
    dose: '50-150mg/日×5天',
    timing: '月经第5天开始',
    warning: '确诊妊娠后立即停药'
  }
]

// 产检时间表
export const antenatalSchedule = [
  { 
    weeks: '6-8周', 
    items: ['确认宫内妊娠', '超声看胎心', '建档'],
    note: '第一次产检，排除异位妊娠'
  },
  { 
    weeks: '11-13+6周', 
    items: ['NT检查（胎儿颈项透明层）', '早期唐氏筛查', '基础检查（血常规、血型、肝肾功能、TORCH、HIV、梅毒、乙肝）'],
    note: 'NT正常值<2.5mm，增厚需进一步检查'
  },
  { 
    weeks: '15-20周', 
    items: ['中期唐氏筛查或无创DNA（NIPT）', '超声排查异常'],
    note: '唐筛高风险需羊水穿刺确诊'
  },
  { 
    weeks: '20-24周', 
    items: ['系统超声（大排畸，四维彩超）'],
    note: '检查胎儿结构，排除严重畸形'
  },
  { 
    weeks: '24-28周', 
    items: ['糖耐量试验（OGTT）', '血常规（筛查贫血）'],
    note: 'OGTT：空腹≥5.1、1h≥10.0、2h≥8.5 mmol/L任一项异常即诊断GDM'
  },
  { 
    weeks: '28周后', 
    items: ['每2周产检一次', '胎动计数', '胎心监护（NST）', '监测血压、体重、宫高腹围'],
    note: '胎动：每小时3-5次，<3次需就诊'
  },
  { 
    weeks: '32-34周', 
    items: ['超声评估胎儿生长、羊水、胎盘'],
    note: '监测胎儿宫内生长受限（FGR）'
  },
  { 
    weeks: '36周后', 
    items: ['每周产检', 'NST', 'B超评估胎儿大小和羊水', 'GBS筛查（阴道+直肠拭子）'],
    note: 'GBS阳性产时需预防性抗生素'
  },
  { 
    weeks: '37-41周', 
    items: ['评估胎儿成熟度、羊水、胎盘功能', 'NST', 'Bishop评分（≥37周）'],
    note: '≥41周未临产需评估引产指征'
  },
  { 
    weeks: '≥41周', 
    items: ['评估引产指征', 'Bishop评分', '胎儿监护'],
    note: '≥42周为过期妊娠，需终止妊娠'
  }
]
