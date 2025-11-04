# 妇产科医学软件扩展建议
## AI 多专家会诊系统 - 妇产科专业化深度扩展方案

---

## 📋 目录
- [当前系统分析](#当前系统分析)
- [扩展方案总览](#扩展方案总览)
- [核心功能扩展](#核心功能扩展)
- [技术实施路径](#技术实施路径)
- [数据结构设计](#数据结构设计)
- [界面设计方案](#界面设计方案)
- [AI Prompt 优化](#ai-prompt-优化)
- [临床价值分析](#临床价值分析)
- [商业化建议](#商业化建议)

---

## 当前系统分析

### 现有优势
✅ **技术架构成熟**
- Vue 3 + Pinia 组合式架构，易于扩展
- 纯前端设计，数据安全可靠
- 多 LLM 供应商集成，灵活性强
- 完善的会话管理和持久化机制

✅ **核心机制完善**
- 多轮讨论和投票淘汰机制
- 支持图像识别（SiliconFlow）
- 病例学术价值分析系统
- 会话导入/导出功能

✅ **专业定位清晰**
- 已针对妇产科深度定制
- 包含月经史、婚育史等专业字段
- 妇产科专家级 Prompt 设计

### 可改进空间
⚠️ **临床场景覆盖不足**
- 缺少常见妇产科亚专科分类
- 未涵盖产科全周期管理
- 急诊场景支持不足

⚠️ **辅助功能不足**
- 缺少医学计算器（预产期、孕周等）
- 无标准化评分量表
- 未集成临床路径和指南

⚠️ **数据利用不足**
- 缺少病例库和知识库
- 无统计分析功能
- 未实现跨病例对比

---

## 扩展方案总览

### 方案一：垂直深化 - 妇产科全科智能诊疗系统 ⭐⭐⭐⭐⭐

**定位**: 从通用会诊工具升级为妇产科全科智能诊疗助手

#### 核心扩展维度

```
1. 亚专科精细化
   ├── 产科：孕前、孕期、产时、产后全周期管理
   ├── 妇科：肿瘤、内分泌、生殖、炎症、盆底
   ├── 计划生育：避孕、人工流产、高危妊娠咨询
   ├── 生殖医学：不孕不育、辅助生殖技术
   └── 妇科急诊：异位妊娠、卵巢扭转、产后出血等

2. 临床工具集成
   ├── 医学计算器：预产期、孕周、BMI、Bishop评分等
   ├── 评分量表：Edinburgh产后抑郁量表、APGAR评分等
   ├── 用药参考：妊娠期用药分级、哺乳期用药安全
   ├── 检验参考值：孕周特异性参考范围
   └── 影像解读助手：超声、MRI典型征象库

3. 智能化增强
   ├── 症状导航：通过症状快速定位可能疾病
   ├── 风险预测：妊娠并发症风险评估
   ├── 随访提醒：产检、术后复查时间点
   ├── 用药警示：禁忌药物、相互作用提醒
   └── 急症识别：自动标记危急值和急诊指征

4. 知识库建设
   ├── 常见病标准化诊疗路径
   ├── 罕见病病例库
   ├── 最新临床指南集成
   ├── 手术技术视频库（外链）
   └── 学术文献快速检索
```

---

## 核心功能扩展

### 功能模块 1：专科化医生配置系统

#### 设计理念
将通用"妇产科医生"细分为亚专科专家，每个专家有独特的专业视角和知识重点。

#### 预设专家角色

```javascript
export const obgynSpecialties = [
  {
    id: 'obs-general',
    name: '产科专家',
    icon: '🤰',
    specialty: '产科',
    subSpecialties: ['孕期管理', '高危妊娠', '产时管理', '产后康复'],
    focusAreas: ['胎儿监测', '妊娠并发症', '产科急症', '围产期管理'],
    keywords: ['孕期', '胎儿', '分娩', '产后', 'HCG', '胎心', '宫缩'],
    promptEnhancement: `
你特别擅长：
- 孕周的精确计算和评估
- 产检时间点的规范化建议
- 妊娠期并发症的早期识别（妊娠期高血压、妊娠期糖尿病、前置胎盘等）
- 胎儿生长发育评估
- 分娩方式的选择和指征把握
- 产后出血等急症的处理
`
  },
  {
    id: 'gyn-oncology',
    name: '妇科肿瘤专家',
    icon: '🎗️',
    specialty: '妇科肿瘤',
    subSpecialties: ['宫颈癌', '卵巢癌', '子宫内膜癌', '滋养细胞疾病'],
    focusAreas: ['肿瘤筛查', '分期诊断', '手术方案', '化疗方案', '保育治疗'],
    keywords: ['肿瘤', '癌', 'CA125', 'HPV', 'TCT', '活检', '转移'],
    promptEnhancement: `
你特别擅长：
- 妇科恶性肿瘤的诊断和分期（FIGO分期）
- 肿瘤标志物的解读（CA125、HE4、AFP、CEA等）
- 手术方式的选择（保留生育功能 vs 根治性手术）
- 化疗/放疗方案的制定
- 早期筛查和高危人群管理（如BRCA基因突变）
- 肿瘤复发的监测
`
  },
  {
    id: 'gyn-endocrine',
    name: '生殖内分泌专家',
    icon: '🧬',
    specialty: '生殖内分泌',
    subSpecialties: ['月经失调', 'PCOS', '卵巢早衰', '更年期管理'],
    focusAreas: ['激素调节', '排卵障碍', '不孕症', '内分泌治疗'],
    keywords: ['月经', '闭经', '多囊', '激素', 'FSH', 'LH', 'AMH', '卵巢功能'],
    promptEnhancement: `
你特别擅长：
- 月经失调的病因分析和分型（WHO分型）
- 性激素六项的精准解读（按月经周期时相）
- 多囊卵巢综合征（PCOS）的诊断标准（鹿特丹标准）和管理
- 卵巢储备功能评估（AMH、AFC、FSH）
- 促排卵方案的制定
- 围绝经期综合征的激素替代治疗（HRT）
- 生育力保护策略
`
  },
  {
    id: 'reproductive-medicine',
    name: '生殖医学专家',
    icon: '👶',
    specialty: '辅助生殖',
    subSpecialties: ['不孕症', 'IVF/ICSI', '反复流产', '男性因素'],
    focusAreas: ['辅助生殖技术', '胚胎评估', '着床窗口', '免疫因素'],
    keywords: ['不孕', '试管', 'IVF', '胚胎', '着床', '流产', '精液分析'],
    promptEnhancement: `
你特别擅长：
- 不孕症的系统性评估（输卵管、排卵、子宫、男方因素）
- 辅助生殖技术适应症的判断（IUI、IVF、ICSI）
- 控制性超促排卵方案（长方案、短方案、拮抗剂方案等）
- 胚胎质量评估和移植策略
- 反复种植失败的原因分析
- 复发性流产的免疫学治疗
- 男性因素不育的处理
`
  },
  {
    id: 'gyn-infection',
    name: '妇科感染专家',
    icon: '🦠',
    specialty: '妇科感染',
    subSpecialties: ['阴道炎', '盆腔炎', 'STI', '产褥感染'],
    focusAreas: ['感染诊断', '病原体鉴别', '抗生素应用', '性传播疾病'],
    keywords: ['感染', '炎症', '分泌物', '白带', '盆腔炎', 'STD', '抗生素'],
    promptEnhancement: `
你特别擅长：
- 阴道炎的鉴别诊断（细菌性、霉菌性、滴虫性）
- 盆腔炎性疾病（PID）的诊断标准和抗生素选择
- 性传播感染（STI）的筛查和治疗（淋病、衣原体、梅毒、HPV）
- 白带常规和阴道微生态的解读
- 妊娠期感染的安全用药（青霉素类、头孢类的分级）
- 手术部位感染（SSI）的预防和处理
`
  },
  {
    id: 'gyn-minimally-invasive',
    name: '微创手术专家',
    icon: '🔬',
    specialty: '妇科微创',
    subSpecialties: ['腹腔镜', '宫腔镜', '阴式手术', '介入治疗'],
    focusAreas: ['手术指征', '术式选择', '并发症预防', '术后管理'],
    keywords: ['腹腔镜', '宫腔镜', '手术', '子宫肌瘤', '卵巢囊肿', '内异症'],
    promptEnhancement: `
你特别擅长：
- 手术适应症和禁忌症的判断
- 手术方式的选择（腹腔镜 vs 开腹 vs 阴式）
- 术前评估和准备（肠道准备、血栓预防）
- 手术并发症的识别和处理（出血、器官损伤、CO2栓塞）
- 术后快速康复（ERAS）方案
- 特殊手术：子宫肌瘤剔除、卵巢囊肿剔除、子宫内膜异位症手术
`
  },
  {
    id: 'emergency-obgyn',
    name: '妇产科急诊专家',
    icon: '🚨',
    specialty: '妇产科急诊',
    subSpecialties: ['产科急症', '妇科急腹症', '大出血', '急诊手术'],
    focusAreas: ['快速诊断', '紧急处理', '生命支持', '急诊手术'],
    keywords: ['急诊', '急腹症', '出血', '休克', '异位妊娠', '卵巢扭转', '子痫'],
    promptEnhancement: `
你特别擅长：
- 妇产科急症的快速识别（异位妊娠、卵巢扭转、胎盘早剥、子痫）
- 急性盆腔痛的鉴别诊断（外科、内科、妇科病因）
- 产后大出血的原因和处理（4T原则：Tone、Trauma、Tissue、Thrombin）
- 急诊超声的应用（FAST）
- 生命支持和液体复苏
- 急诊手术指征的把握
- 危急值的识别（血红蛋白<60g/L、血压<90/60mmHg等）
`
  },
  {
    id: 'urogynecology',
    name: '盆底康复专家',
    icon: '🧘',
    specialty: '盆底功能障碍',
    subSpecialties: ['尿失禁', '盆腔器官脱垂', '性功能障碍', '慢性盆腔疼痛'],
    focusAreas: ['盆底评估', '康复训练', '手术重建', '疼痛管理'],
    keywords: ['尿失禁', '脱垂', '盆底', '骨盆', '漏尿', '膨出', '疼痛'],
    promptEnhancement: `
你特别擅长：
- 盆底功能障碍的评估（POP-Q分度、尿失禁分型）
- 压力性尿失禁的诊断和治疗（保守治疗 vs TVT/TOT手术）
- 盆腔器官脱垂的分度和手术方案
- 盆底肌肉训练（Kegel运动）指导
- 慢性盆腔疼痛的多学科管理
- 产后盆底康复方案
- 性功能障碍的评估和干预
`
  }
]
```

#### 智能医生推荐算法

根据病例关键词自动推荐最适合的专家组合：

```javascript
// utils/doctorRecommendation.js
export function recommendDoctorsForCase(patientCase) {
  const caseText = [
    patientCase.currentProblem,
    patientCase.pastHistory,
    patientCase.menstrualHistory,
    patientCase.marriageHistory
  ].join(' ').toLowerCase()
  
  const recommendations = []
  
  // 评分系统
  obgynSpecialties.forEach(specialty => {
    let score = 0
    specialty.keywords.forEach(keyword => {
      if (caseText.includes(keyword)) {
        score += 1
      }
    })
    
    if (score > 0) {
      recommendations.push({
        specialty,
        score,
        reason: `匹配到 ${score} 个专科关键词`
      })
    }
  })
  
  // 按分数排序，返回前3名
  return recommendations
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}

// 急诊识别
export function detectEmergency(patientCase) {
  const emergencyKeywords = [
    '剧烈疼痛', '大出血', '休克', '昏迷', '抽搐',
    '异位妊娠', '卵巢扭转', '胎盘早剥', '子痫',
    '产后大出血', '羊水栓塞', '子宫破裂'
  ]
  
  const caseText = patientCase.currentProblem?.toLowerCase() || ''
  const detected = emergencyKeywords.filter(kw => caseText.includes(kw))
  
  if (detected.length > 0) {
    return {
      isEmergency: true,
      keywords: detected,
      recommendedExperts: ['emergency-obgyn'],
      urgencyLevel: 'critical',
      message: '⚠️ 检测到急诊关键词，建议立即就医！'
    }
  }
  
  return { isEmergency: false }
}
```

---

### 功能模块 2：临床工具集成

#### 2.1 医学计算器库

```javascript
// utils/medicalCalculators.js

export const obgynCalculators = {
  // 预产期计算（Naegele法则）
  calculateEDD(lmpDate) {
    const lmp = new Date(lmpDate)
    const edd = new Date(lmp)
    edd.setDate(edd.getDate() + 280) // 280天 = 40周
    return {
      edd: edd.toISOString().split('T')[0],
      gestationalAge: this.calculateGestationalAge(lmpDate),
      trimester: this.getTrimester(lmpDate)
    }
  },
  
  // 孕周计算
  calculateGestationalAge(lmpDate) {
    const lmp = new Date(lmpDate)
    const now = new Date()
    const diffTime = now - lmp
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDays / 7)
    const days = diffDays % 7
    return {
      weeks,
      days,
      totalDays: diffDays,
      display: `${weeks}周+${days}天`
    }
  },
  
  // 妊娠期体重增长建议（基于孕前BMI）
  calculateWeightGain(prePregnancyBMI) {
    if (prePregnancyBMI < 18.5) {
      return { min: 12.5, max: 18, category: '偏瘦' }
    } else if (prePregnancyBMI < 25) {
      return { min: 11.5, max: 16, category: '正常' }
    } else if (prePregnancyBMI < 30) {
      return { min: 7, max: 11.5, category: '超重' }
    } else {
      return { min: 5, max: 9, category: '肥胖' }
    }
  },
  
  // Bishop评分（宫颈成熟度）
  bishopScore(cervixDilation, cervixEffacement, cervixStation, cervixConsistency, cervixPosition) {
    const scores = {
      dilation: [0, 1, 2, 3][cervixDilation] || 0,
      effacement: [0, 1, 2, 3][cervixEffacement] || 0,
      station: [0, 1, 2, 3][cervixStation] || 0,
      consistency: [0, 1, 2][cervixConsistency] || 0,
      position: [0, 1, 2][cervixPosition] || 0
    }
    const total = Object.values(scores).reduce((a, b) => a + b, 0)
    return {
      total,
      scores,
      interpretation: total >= 8 ? '宫颈成熟，可引产' : total >= 5 ? '宫颈较成熟' : '宫颈不成熟，需促宫颈成熟'
    }
  },
  
  // 卵巢癌风险指数（RMI，Risk of Malignancy Index）
  calculateRMI(ca125, ultrasoundScore, menopausalStatus) {
    const M = menopausalStatus === 'postmenopausal' ? 3 : 1
    const U = ultrasoundScore // 0, 1, 3 (根据超声特征)
    const rmi = ca125 * U * M
    return {
      rmi,
      risk: rmi < 25 ? '低风险' : rmi < 250 ? '中等风险' : '高风险',
      recommendation: rmi >= 250 ? '建议转诊妇科肿瘤专科' : '建议密切随访'
    }
  },
  
  // PCOS诊断（鹿特丹标准，满足3项中的2项）
  diagnosePCOS(irregularMenstruation, hyperandrogenism, polycysticOvaries) {
    const criteria = [irregularMenstruation, hyperandrogenism, polycysticOvaries]
    const count = criteria.filter(Boolean).length
    return {
      meetsCriteria: count >= 2,
      count,
      diagnosis: count >= 2 ? 'PCOS可能性大' : 'PCOS可能性小',
      nextSteps: count >= 2 
        ? '建议完善激素六项、糖耐量试验、排除其他病因（CAH、甲状腺疾病、高泌乳素血症）'
        : '建议进一步检查以明确诊断'
    }
  }
}

// 妊娠期用药安全分级（FDA分类）
export const pregnancyDrugCategories = {
  A: { level: '安全', description: '对照研究未发现风险', color: 'green' },
  B: { level: '较安全', description: '动物研究未见风险，缺乏人类研究', color: 'blue' },
  C: { level: '谨慎使用', description: '动物研究有不良反应，需权衡利弊', color: 'orange' },
  D: { level: '有风险', description: '有人类风险证据，但可能获益大于风险', color: 'red' },
  X: { level: '禁用', description: '明确致畸，禁用于妊娠期', color: 'darkred' }
}

// 常用药物数据库（示例）
export const commonDrugsInObGyn = [
  { name: '叶酸', category: 'A', indication: '预防神经管缺陷', dose: '0.4-0.8mg/日' },
  { name: '甲硝唑', category: 'B', indication: '细菌性阴道病', dose: '500mg bid×7天', note: '孕早期避免' },
  { name: '青霉素', category: 'B', indication: '链球菌感染', dose: '根据感染类型' },
  { name: '米索前列醇', category: 'X', indication: '引产', dose: '禁用于妊娠期', warning: '可致子宫收缩和流产' },
  // ... 更多药物
]
```

#### 2.2 评分量表系统

```vue
<!-- components/ClinicalScales.vue -->
<template>
  <div class="clinical-scales">
    <a-card title="临床评分量表">
      <a-tabs v-model:activeKey="activeScale">
        <!-- Edinburgh产后抑郁量表 -->
        <a-tab-pane key="epds" tab="产后抑郁评估(EPDS)">
          <EPDSScale @score-calculated="handleEPDSScore" />
        </a-tab-pane>
        
        <!-- APGAR评分 -->
        <a-tab-pane key="apgar" tab="新生儿APGAR评分">
          <APGARScale @score-calculated="handleAPGARScore" />
        </a-tab-pane>
        
        <!-- POP-Q分度 -->
        <a-tab-pane key="popq" tab="盆腔器官脱垂(POP-Q)">
          <POPQScale @score-calculated="handlePOPQScore" />
        </a-tab-pane>
        
        <!-- 痛经评分 -->
        <a-tab-pane key="dysmenorrhea" tab="痛经严重程度评分">
          <DysmenorrheaScale @score-calculated="handleDysScore" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeScale = ref('epds')

const handleEPDSScore = (result) => {
  // 总分≥13分提示可能抑郁
  if (result.total >= 13) {
    showWarning('EPDS评分提示可能存在产后抑郁，建议心理科会诊')
  }
}

const handleAPGARScore = (result) => {
  // 0-3分：重度窒息，4-7分：轻度窒息，8-10分：正常
  const interpretation = result.total >= 8 ? '正常' : result.total >= 4 ? '轻度窒息' : '重度窒息'
  console.log(`APGAR评分：${result.total}分，${interpretation}`)
}
</script>
```

---

### 功能模块 3：智能症状导航系统

#### 症状决策树

```javascript
// utils/symptomNavigator.js

export const obgynSymptomTree = {
  // 主诉：阴道出血
  vaginalBleeding: {
    question: '阴道出血的情况',
    branches: [
      {
        condition: '孕期出血',
        subQuestions: [
          {
            q: '孕周？',
            branches: [
              { condition: '孕早期(<12周)', possibleDx: ['先兆流产', '异位妊娠', '葡萄胎', '宫颈病变'] },
              { condition: '孕中晚期', possibleDx: ['前置胎盘', '胎盘早剥', '先兆早产', '宫颈机能不全'] }
            ]
          },
          {
            q: '是否伴有腹痛？',
            branches: [
              { condition: '有腹痛', urgency: 'high', possibleDx: ['异位妊娠', '胎盘早剥', '流产'] },
              { condition: '无腹痛', urgency: 'medium', possibleDx: ['前置胎盘', '宫颈息肉'] }
            ]
          }
        ]
      },
      {
        condition: '非孕期出血',
        subQuestions: [
          {
            q: '与月经周期的关系？',
            branches: [
              { condition: '月经期延长', possibleDx: ['子宫肌瘤', '子宫腺肌症', '凝血功能障碍', '排卵障碍'] },
              { condition: '周期缩短', possibleDx: ['黄体功能不足', '围绝经期'] },
              { condition: '不规则出血', possibleDx: ['子宫内膜病变', '宫颈病变', '排卵期出血', '功血'] },
              { condition: '绝经后出血', urgency: 'high', possibleDx: ['子宫内膜癌', '宫颈癌', '萎缩性阴道炎', 'HRT相关'] }
            ]
          }
        ]
      },
      {
        condition: '性交后出血',
        urgency: 'high',
        possibleDx: ['宫颈癌', '宫颈糜烂', '宫颈息肉', '阴道炎'],
        recommendations: ['妇科检查', '宫颈TCT', 'HPV检测', '阴道镜']
      }
    ]
  },
  
  // 主诉：腹痛
  abdominalPain: {
    question: '腹痛的性质和部位',
    branches: [
      {
        condition: '急性剧烈腹痛',
        urgency: 'critical',
        subQuestions: [
          {
            q: '是否怀孕或可能怀孕？',
            branches: [
              { 
                condition: '是', 
                possibleDx: ['异位妊娠破裂', '流产', '黄体破裂'],
                emergencyActions: ['立即急诊就诊', '禁食禁水', '建立静脉通路', '备血']
              },
              { 
                condition: '否', 
                possibleDx: ['卵巢扭转', '卵巢囊肿破裂', '盆腔炎', '阑尾炎'],
                emergencyActions: ['急诊超声', '血常规', '妇科检查']
              }
            ]
          }
        ]
      },
      {
        condition: '慢性盆腔痛',
        subQuestions: [
          {
            q: '与月经周期的关系？',
            branches: [
              { condition: '月经期加重', possibleDx: ['子宫内膜异位症', '子宫腺肌症', '原发性痛经'] },
              { condition: '排卵期疼痛', possibleDx: ['排卵痛', '卵巢囊肿'] },
              { condition: '无周期性', possibleDx: ['慢性盆腔炎', '盆腔粘连', '肠易激综合征'] }
            ]
          }
        ]
      }
    ]
  },
  
  // 主诉：不孕
  infertility: {
    question: '不孕的基本情况',
    initialAssessment: [
      '未避孕性生活时间≥1年？',
      '女方年龄？',
      '月经规律性？',
      '既往妊娠史？',
      '男方精液检查？'
    ],
    workupPlan: {
      female: [
        '基础激素检测（月经第2-4天FSH、LH、E2、PRL、T、AMH）',
        '排卵监测（基础体温、排卵试纸、超声监测）',
        '输卵管通畅性检查（HSG或腹腔镜）',
        '宫腔形态评估（超声、宫腔镜）',
        '甲状腺功能、血糖'
      ],
      male: [
        '精液常规分析（禁欲2-7天）',
        '精子形态学',
        '必要时：精子DNA碎片率、染色体核型'
      ]
    },
    commonCauses: [
      { cause: '排卵障碍', percentage: '25-30%', workup: ['激素检查', '超声监测'] },
      { cause: '输卵管因素', percentage: '30-40%', workup: ['HSG', '腹腔镜'] },
      { cause: '子宫内膜异位症', percentage: '10-15%', workup: ['CA125', '腹腔镜'] },
      { cause: '男方因素', percentage: '30-40%', workup: ['精液分析'] },
      { cause: '不明原因', percentage: '10-15%', workup: ['排除其他病因'] }
    ]
  }
}

// 智能症状分析
export function analyzeSymptoms(symptoms) {
  const results = []
  
  symptoms.forEach(symptom => {
    const tree = obgynSymptomTree[symptom.type]
    if (tree) {
      const analysis = traverseTree(tree, symptom.details)
      results.push(analysis)
    }
  })
  
  return {
    possibleDiagnoses: consolidateDiagnoses(results),
    urgencyLevel: determineUrgency(results),
    recommendedWorkup: generateWorkupPlan(results),
    redFlags: identifyRedFlags(symptoms)
  }
}

function identifyRedFlags(symptoms) {
  const redFlags = []
  const criticalKeywords = [
    '大出血', '休克', '意识障碍', '抽搐', '剧烈腹痛',
    '绝经后出血', '进行性加重', '体重下降', '盆腔包块'
  ]
  
  symptoms.forEach(s => {
    criticalKeywords.forEach(kw => {
      if (s.description?.includes(kw)) {
        redFlags.push({
          keyword: kw,
          urgency: 'high',
          action: '建议立即就医'
        })
      }
    })
  })
  
  return redFlags
}
```

---

### 功能模块 4：临床指南知识库

#### 指南集成系统

```javascript
// utils/clinicalGuidelines.js

export const obgynGuidelines = {
  // 异位妊娠诊疗规范
  ectopicPregnancy: {
    title: '异位妊娠诊疗规范（2021版）',
    source: '中华医学会妇产科学分会',
    keyPoints: [
      {
        section: '诊断标准',
        content: `
1. 停经史 + 阴道出血/腹痛
2. 血HCG升高但未倍增（48h增长<66%）
3. 超声未见宫内孕囊但附件区包块
4. 诊断性腹腔镜：金标准
        `
      },
      {
        section: '治疗选择',
        content: `
期待治疗：
- 血HCG<1000 mIU/ml且下降
- 无症状或症状轻微
- 包块<3cm

药物治疗（MTX）：
- 血HCG<5000 mIU/ml
- 包块<4cm
- 无胎心搏动
- 肝肾功能正常

手术治疗：
- 血HCG>5000 mIU/ml
- 包块>4cm
- 有胎心
- 腹腔内出血>500ml
- 生命体征不稳定
        `
      }
    ],
    flowchart: '/guidelines/ectopic-pregnancy-flowchart.png'
  },
  
  // 妊娠期高血压疾病
  hdp: {
    title: '妊娠期高血压疾病诊治指南（2020版）',
    source: '中华医学会妇产科学分会',
    classification: [
      {
        type: '妊娠期高血压',
        criteria: '孕20周后新出现BP≥140/90mmHg，产后12周内恢复正常',
        proteinuria: '阴性'
      },
      {
        type: '子痫前期',
        criteria: 'BP≥140/90mmHg + 蛋白尿≥300mg/24h或PCR≥0.3',
        severity: {
          mild: 'BP 140-159/90-109 mmHg',
          severe: 'BP≥160/110 mmHg 或伴有脏器损害'
        }
      },
      {
        type: '子痫',
        criteria: '子痫前期基础上发生不能用其他原因解释的抽搐'
      }
    ],
    management: {
      monitoring: [
        '血压监测：至少每日2次',
        '尿蛋白：每周1次',
        '血常规、肝肾功能、凝血功能：每周1-2次',
        '胎儿监测：NST、超声生物物理评分'
      ],
      medications: [
        {
          drug: '拉贝洛尔',
          indication: '首选降压药',
          dose: '100-400mg bid-tid',
          category: 'C'
        },
        {
          drug: '硝苯地平缓释片',
          indication: '次选',
          dose: '30-60mg qd',
          category: 'C'
        },
        {
          drug: '硫酸镁',
          indication: '预防和治疗子痫',
          dose: '负荷量4-6g，维持量1-2g/h',
          note: '监测镁中毒：呼吸>16次/分，尿量>25ml/h，膝反射存在'
        }
      ],
      deliveryTiming: {
        mild: '≥37周终止妊娠',
        severe: '≥34周终止妊娠，<34周促胎肺成熟后终止',
        eclampsia: '控制抽搐后12-24h内终止妊娠'
      }
    }
  },
  
  // PCOS诊疗指南
  pcos: {
    title: '多囊卵巢综合征中国诊疗指南',
    diagnosticCriteria: {
      rotterdam: {
        name: '鹿特丹标准（2003）',
        criteria: [
          '稀发排卵或无排卵',
          '高雄激素的临床表现和/或高雄激素血症',
          '卵巢多囊性改变（超声：单侧卵巢≥12个直径2-9mm卵泡或卵巢体积≥10ml）'
        ],
        rule: '满足3项中的2项，排除其他高雄激素病因'
      }
    },
    treatment: {
      lifestyle: {
        priority: '一线治疗',
        targets: [
          '减重：减少5-10%体重可改善代谢和生殖功能',
          '饮食：低GI饮食',
          '运动：每周150分钟中等强度有氧运动'
        ]
      },
      medications: [
        {
          indication: '调整月经周期',
          drugs: ['短效口服避孕药（如优思明、优思悦）', '孕激素后半周期疗法'],
          note: '至少3-6个月'
        },
        {
          indication: '降雄激素',
          drugs: ['达英-35（含醋酸环丙孕酮）', '螺内酯'],
          duration: '6-12个月'
        },
        {
          indication: '改善胰岛素抵抗',
          drugs: ['二甲双胍 1500-2000mg/日'],
          benefits: '改善代谢、恢复排卵、减轻体重'
        },
        {
          indication: '促排卵（有生育要求）',
          drugs: [
            '克罗米芬 50-150mg/日×5天（月经第5天开始）',
            '来曲唑 2.5-7.5mg/日×5天',
            '促性腺激素（FSH/HMG）'
          ],
          monitoring: '超声监测卵泡发育，预防OHSS'
        }
      ]
    }
  }
}

// 指南检索功能
export function searchGuidelines(keyword) {
  const results = []
  Object.entries(obgynGuidelines).forEach(([key, guideline]) => {
    if (JSON.stringify(guideline).toLowerCase().includes(keyword.toLowerCase())) {
      results.push({ id: key, ...guideline })
    }
  })
  return results
}
```

---

### 功能模块 5：增强型病例输入表单

扩展现有的 `CaseInputForm.vue`，增加更多结构化字段：

```vue
<!-- components/EnhancedCaseInputForm.vue -->
<template>
  <a-form :model="formData" layout="vertical" @finish="handleSubmit">
    <a-card title="基本信息" class="form-section">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="患者姓名" name="name" :rules="[{ required: true }]">
            <a-input v-model:value="formData.name" placeholder="请输入患者姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="性别" name="gender">
            <a-radio-group v-model:value="formData.gender">
              <a-radio value="女">女</a-radio>
              <a-radio value="男">男（配偶信息）</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="年龄" name="age">
            <a-input-number v-model:value="formData.age" :min="0" :max="120" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="妇科专科信息" class="form-section">
      <a-row :gutter="16">
        <!-- 月经史 -->
        <a-col :span="12">
          <a-form-item label="末次月经(LMP)">
            <a-date-picker v-model:value="formData.lmp" style="width: 100%" @change="calculateGestationalAge" />
            <div v-if="gestationalAge" class="hint-text">
              孕周：{{ gestationalAge.display }} | 预产期：{{ edd }}
            </div>
          </a-form-item>
        </a-col>
        
        <a-col :span="12">
          <a-form-item label="月经周期">
            <a-input v-model:value="formData.menstrualCycle" placeholder="例如：28-30天，规律" />
          </a-form-item>
        </a-col>
        
        <a-col :span="12">
          <a-form-item label="初潮年龄">
            <a-input-number v-model:value="formData.menarche" :min="8" :max="18" suffix="岁" style="width: 100%" />
          </a-form-item>
        </a-col>
        
        <a-col :span="12">
          <a-form-item label="绝经状态">
            <a-select v-model:value="formData.menopausalStatus">
              <a-select-option value="premenopausal">未绝经</a-select-option>
              <a-select-option value="perimenopausal">围绝经期</a-select-option>
              <a-select-option value="postmenopausal">已绝经</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      
      <!-- 婚育史 -->
      <a-divider>婚育史</a-divider>
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="孕次">
            <a-input-number v-model:value="formData.gravida" :min="0" suffix="次" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="产次">
            <a-input-number v-model:value="formData.para" :min="0" suffix="次" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="流产次数">
            <a-input-number v-model:value="formData.abortion" :min="0" suffix="次" style="width: 100%" />
          </a-form-item>
        </a-col>
        
        <a-col :span="24">
          <a-form-item label="生育需求">
            <a-radio-group v-model:value="formData.fertilityDesire">
              <a-radio value="no">无生育要求</a-radio>
              <a-radio value="yes">有生育要求</a-radio>
              <a-radio value="completed">已完成生育</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
    </a-card>

    <a-card title="临床表现" class="form-section">
      <!-- 主诉 -->
      <a-form-item label="主诉" name="chiefComplaint" :rules="[{ required: true }]">
        <a-textarea 
          v-model:value="formData.chiefComplaint" 
          placeholder="例如：停经45天，阴道少量出血3天"
          :rows="2"
          show-count
          :maxlength="200"
        />
      </a-form-item>
      
      <!-- 症状快速选择 -->
      <a-form-item label="症状快速选择">
        <a-checkbox-group v-model:value="formData.symptoms">
          <a-row>
            <a-col :span="6"><a-checkbox value="vaginalBleeding">阴道出血</a-checkbox></a-col>
            <a-col :span="6"><a-checkbox value="abdominalPain">腹痛</a-checkbox></a-col>
            <a-col :span="6"><a-checkbox value="discharge">白带异常</a-checkbox></a-col>
            <a-col :span="6"><a-checkbox value="dysmenorrhea">痛经</a-checkbox></a-col>
            <a-col :span="6"><a-checkbox value="amenorrhea">闭经</a-checkbox></a-col>
            <a-col :span="6"><a-checkbox value="infertility">不孕</a-checkbox></a-col>
            <a-col :span="6"><a-checkbox value="pelvicMass">盆腔包块</a-checkbox></a-col>
            <a-col :span="6"><a-checkbox value="urinaryIncontinence">尿失禁</a-checkbox></a-col>
          </a-row>
        </a-checkbox-group>
        <a-button size="small" type="link" @click="showSymptomNavigator">
          🧭 使用症状导航助手
        </a-button>
      </a-form-item>
      
      <!-- 现病史 -->
      <a-form-item label="现病史">
        <a-textarea 
          v-model:value="formData.historyOfPresentIllness" 
          placeholder="详细描述症状的发生、发展、伴随症状、已进行的检查和治疗"
          :rows="4"
          show-count
          :maxlength="1000"
        />
      </a-form-item>
    </a-card>

    <a-card title="体格检查" class="form-section">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item label="体温(°C)">
            <a-input-number v-model:value="formData.temperature" :min="35" :max="42" :step="0.1" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="血压(mmHg)">
            <a-input v-model:value="formData.bloodPressure" placeholder="例如：120/80" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="脉搏(次/分)">
            <a-input-number v-model:value="formData.pulse" :min="40" :max="200" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-form-item label="妇科检查">
        <a-textarea 
          v-model:value="formData.gynecologicalExam" 
          placeholder="外阴、阴道、宫颈、宫体、附件检查结果"
          :rows="3"
        />
      </a-form-item>
    </a-card>

    <a-card title="辅助检查" class="form-section">
      <!-- 实验室检查 -->
      <a-collapse>
        <a-collapse-panel key="labs" header="实验室检查">
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="血HCG (mIU/ml)">
                <a-input-number v-model:value="formData.labs.hcg" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="血红蛋白 (g/L)">
                <a-input-number v-model:value="formData.labs.hemoglobin" :min="0" :max="200" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="CA125 (U/ml)">
                <a-input-number v-model:value="formData.labs.ca125" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          
          <!-- 激素检查 -->
          <a-divider>性激素六项</a-divider>
          <a-row :gutter="16">
            <a-col :span="8">
              <a-form-item label="FSH (mIU/ml)">
                <a-input-number v-model:value="formData.labs.fsh" :min="0" :step="0.1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="LH (mIU/ml)">
                <a-input-number v-model:value="formData.labs.lh" :min="0" :step="0.1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="E2 (pg/ml)">
                <a-input-number v-model:value="formData.labs.e2" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="P (ng/ml)">
                <a-input-number v-model:value="formData.labs.progesterone" :min="0" :step="0.1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="T (ng/ml)">
                <a-input-number v-model:value="formData.labs.testosterone" :min="0" :step="0.01" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="PRL (ng/ml)">
                <a-input-number v-model:value="formData.labs.prolactin" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
        
        <!-- 影像学检查 -->
        <a-collapse-panel key="imaging" header="影像学检查">
          <a-form-item label="超声检查">
            <a-textarea v-model:value="formData.imaging.ultrasound" placeholder="子宫大小、肌层回声、内膜厚度、附件情况" :rows="3" />
          </a-form-item>
          <a-form-item label="CT/MRI">
            <a-textarea v-model:value="formData.imaging.ctMri" placeholder="如有，请描述" :rows="2" />
          </a-form-item>
        </a-collapse-panel>
        
        <!-- 病理检查 -->
        <a-collapse-panel key="pathology" header="病理检查">
          <a-form-item label="宫颈细胞学(TCT)">
            <a-select v-model:value="formData.pathology.tct">
              <a-select-option value="NILM">未见上皮内病变</a-select-option>
              <a-select-option value="ASC-US">不能明确意义的非典型鳞状细胞</a-select-option>
              <a-select-option value="LSIL">低级别鳞状上皮内病变</a-select-option>
              <a-select-option value="HSIL">高级别鳞状上皮内病变</a-select-option>
              <a-select-option value="SCC">鳞状细胞癌</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="HPV检测">
            <a-radio-group v-model:value="formData.pathology.hpv">
              <a-radio value="negative">阴性</a-radio>
              <a-radio value="positive">阳性</a-radio>
            </a-radio-group>
            <a-input v-if="formData.pathology.hpv === 'positive'" v-model:value="formData.pathology.hpvType" placeholder="请输入具体型别（如：HPV16/18）" style="margin-top: 8px" />
          </a-form-item>
        </a-collapse-panel>
      </a-collapse>
    </a-card>

    <a-card title="诊断与治疗" class="form-section">
      <a-form-item label="初步诊断">
        <a-input v-model:value="formData.preliminaryDiagnosis" placeholder="如已有初步诊断，请填写" />
      </a-form-item>
      
      <a-form-item label="已采取的治疗">
        <a-textarea v-model:value="formData.treatmentGiven" placeholder="已用药物、手术、其他治疗" :rows="2" />
      </a-form-item>
      
      <a-form-item label="会诊目的">
        <a-checkbox-group v-model:value="formData.consultationPurpose">
          <a-checkbox value="diagnosis">明确诊断</a-checkbox>
          <a-checkbox value="treatment">治疗方案</a-checkbox>
          <a-checkbox value="prognosis">预后评估</a-checkbox>
          <a-checkbox value="secondOpinion">获取第二意见</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
    </a-card>

    <!-- 提交按钮 -->
    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" size="large">
          开始AI会诊
        </a-button>
        <a-button @click="showCalculators">
          🧮 临床计算器
        </a-button>
        <a-button @click="showGuidelines">
          📚 查看相关指南
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { obgynCalculators } from '../utils/medicalCalculators'
import { analyzeSymptoms } from '../utils/symptomNavigator'

const formData = ref({
  // ... 所有字段
  labs: {},
  imaging: {},
  pathology: {}
})

// 孕周计算
const gestationalAge = computed(() => {
  if (!formData.value.lmp) return null
  return obgynCalculators.calculateGestationalAge(formData.value.lmp)
})

const edd = computed(() => {
  if (!formData.value.lmp) return null
  return obgynCalculators.calculateEDD(formData.value.lmp).edd
})

// 症状分析
watch(() => formData.value.symptoms, (newSymptoms) => {
  if (newSymptoms && newSymptoms.length > 0) {
    const analysis = analyzeSymptoms(newSymptoms)
    if (analysis.urgencyLevel === 'critical') {
      showEmergencyWarning(analysis)
    }
  }
})

const handleSubmit = () => {
  // 提交前进行数据验证和增强
  const enhancedData = enhanceCaseData(formData.value)
  emit('submit', enhancedData)
}

function enhanceCaseData(data) {
  // 自动计算和补充信息
  return {
    ...data,
    calculatedFields: {
      gestationalAge: gestationalAge.value,
      edd: edd.value,
      bmi: data.weight && data.height ? data.weight / ((data.height / 100) ** 2) : null,
      // 其他计算字段
    },
    aiHints: {
      // 为AI提供的结构化提示
      keyFindings: extractKeyFindings(data),
      possibleDiagnoses: data.symptoms ? analyzeSymptoms(data.symptoms).possibleDiagnoses : []
    }
  }
}
</script>

<style scoped>
.form-section {
  margin-bottom: 16px;
}
.hint-text {
  margin-top: 8px;
  color: #1890ff;
  font-size: 12px;
}
</style>
```

---

### 功能模块 6：智能随访系统

```javascript
// utils/followUpManager.js

export class FollowUpManager {
  // 根据诊断生成随访计划
  static generateFollowUpPlan(diagnosis, treatmentPlan) {
    const plans = {
      // 异位妊娠术后随访
      'ectopic-pregnancy-post-op': {
        schedule: [
          { time: '术后1周', items: ['血HCG', '腹部症状评估', '切口检查'] },
          { time: '术后2周', items: ['血HCG（应降至<5 mIU/ml）', '超声复查'] },
          { time: '术后1月', items: ['月经恢复情况', '避孕指导'] },
          { time: '术后3月', items: ['输卵管通畅性检查（如保留输卵管）'] }
        ],
        warnings: [
          '血HCG不降或升高→可能残留或持续性异位妊娠',
          '腹痛加重→警惕内出血',
          '建议避孕3-6个月后再妊娠'
        ]
      },
      
      // 子宫肌瘤随访
      'uterine-fibroids': {
        schedule: [
          { 
            time: '每6-12个月', 
            items: ['妇科超声', '评估肌瘤大小和数量', '月经情况', '贫血评估（血常规）'],
            triggers: '如肌瘤增大>2cm/年、症状加重、或直径>5cm，考虑手术'
          }
        ],
        surgeryIndications: [
          '肌瘤直径>5cm',
          '多发肌瘤导致子宫增大超过孕10周大小',
          '月经过多导致贫血',
          '压迫症状（尿频、便秘）',
          '不孕或反复流产且无其他原因',
          '肌瘤快速增长（疑肉瘤变）'
        ]
      },
      
      // 产前检查
      'antenatal-care': {
        schedule: this.getAntenatalSchedule()
      },
      
      // 宫颈病变随访
      'cervical-lesion': {
        'CIN1': {
          management: '观察随访',
          schedule: [
            { time: '6个月', items: ['TCT+HPV联合筛查'] },
            { time: '12个月', items: ['TCT+HPV联合筛查', '阴道镜检查'] }
          ],
          criteria: '连续2次TCT+HPV均阴性→恢复常规筛查；持续异常或进展→阴道镜+活检'
        },
        'CIN2/3': {
          management: '宫颈锥切术（LEEP或冷刀）',
          postOpFollowUp: [
            { time: '术后3月', items: ['TCT+HPV'] },
            { time: '术后6月', items: ['TCT+HPV'] },
            { time: '术后12月', items: ['TCT+HPV'] },
            { time: '后续', items: ['每年TCT+HPV，持续20年'] }
          ]
        }
      }
    }
    
    return plans[diagnosis] || this.generateGenericPlan(diagnosis)
  }
  
  // 产检时间表
  static getAntenatalSchedule() {
    return [
      { weeks: '6-8周', items: ['确认宫内妊娠', '超声看胎心', '建档'] },
      { weeks: '11-13+6周', items: ['NT检查', '早期唐氏筛查', '基础检查（血常规、肝肾功能、血型、TORCH等）'] },
      { weeks: '15-20周', items: ['中期唐氏筛查或无创DNA', '超声排查异常'] },
      { weeks: '20-24周', items: ['系统超声（大排畸）'] },
      { weeks: '24-28周', items: ['糖耐量试验（OGTT）', '血常规（筛查贫血）'] },
      { weeks: '28周后', items: ['每2周产检一次', '胎动计数', '胎心监护NST'] },
      { weeks: '36周后', items: ['每周产检', 'NST', 'B超评估胎儿大小和羊水', 'GBS筛查'] },
      { weeks: '40-41周', items: ['评估引产指征', '宫颈Bishop评分'] }
    ]
  }
  
  // 自动提醒功能
  static calculateNextVisit(lastVisitDate, followUpPlan) {
    // 根据随访计划计算下次就诊时间
    // 可集成到日历、发送提醒等
  }
}
```

---

## 技术实施路径

### 第一阶段：核心功能增强（1-2周）

#### 任务列表
1. ✅ **扩展医生角色系统**
   - 修改 `src/store/global.js`，添加专科分类字段
   - 创建 `src/utils/specialties.js`，定义8个亚专科专家角色
   - 实现智能推荐算法

2. ✅ **增强病例输入表单**
   - 扩展 `CaseInputForm.vue`，增加结构化字段
   - 集成医学计算器（预产期、孕周、BMI等）
   - 添加症状快速选择和导航

3. ✅ **优化 AI Prompt**
   - 根据亚专科特点定制 Prompt 模板
   - 在 `buildFullPrompt` 中集成专科增强提示
   - 添加急诊识别和风险提示逻辑

#### 技术实现示例

```javascript
// src/utils/prompt.js 增强版

export function buildFullPrompt(doctor, patientCase, previousMessages, roundPhase) {
  // 基础系统提示词
  let basePrompt = doctor.customPrompt || store.settings.globalSystemPrompt
  
  // 专科增强提示（新增）
  const specialtyEnhancement = getSpecialtyEnhancement(doctor.specialty)
  if (specialtyEnhancement) {
    basePrompt += '\n\n' + specialtyEnhancement
  }
  
  // 病例结构化呈现（增强）
  const structuredCase = formatCaseStructured(patientCase)
  
  // 检测急诊情况（新增）
  const emergencyDetection = detectEmergencyFromCase(patientCase)
  if (emergencyDetection.isEmergency) {
    basePrompt += `\n\n⚠️ 急诊警示：检测到${emergencyDetection.keywords.join('、')}，请立即评估急诊处理需求！`
  }
  
  // 整合历史讨论
  const historyContext = formatHistoryForProvider(previousMessages, doctor.provider)
  
  // 根据讨论阶段调整提示（增强）
  const stagePrompt = getStageSpecificPrompt(roundPhase)
  
  return {
    systemPrompt: basePrompt,
    userMessage: `${structuredCase}\n\n${stagePrompt}\n\n${historyContext}`
  }
}

function formatCaseStructured(patientCase) {
  // 将病例格式化为结构化文本
  let sections = []
  
  // 基本信息
  sections.push(`【基本信息】
姓名：${patientCase.name}
性别：${patientCase.gender || '女'}
年龄：${patientCase.age}岁`)
  
  // 月经史（如有）
  if (patientCase.menstrualHistory || patientCase.lmp) {
    sections.push(`【月经史】
${patientCase.menstrualHistory || ''}
${patientCase.lmp ? `末次月经：${patientCase.lmp}（孕周：${calculateGA(patientCase.lmp)}）` : ''}`)
  }
  
  // 婚育史（如有）
  if (patientCase.gravida !== undefined || patientCase.para !== undefined) {
    sections.push(`【婚育史】
G${patientCase.gravida || 0}P${patientCase.para || 0}A${patientCase.abortion || 0}
生育需求：${patientCase.fertilityDesire || '未说明'}`)
  }
  
  // 主诉和现病史
  sections.push(`【主诉】
${patientCase.chiefComplaint || patientCase.currentProblem}`)
  
  if (patientCase.historyOfPresentIllness) {
    sections.push(`【现病史】
${patientCase.historyOfPresentIllness}`)
  }
  
  // 体格检查
  if (patientCase.gynecologicalExam) {
    sections.push(`【妇科检查】
${patientCase.gynecologicalExam}`)
  }
  
  // 辅助检查（结构化）
  const labs = formatLabResults(patientCase.labs)
  if (labs) {
    sections.push(`【辅助检查】
${labs}`)
  }
  
  // 既往史
  if (patientCase.pastHistory) {
    sections.push(`【既往史】
${patientCase.pastHistory}`)
  }
  
  // 图像识别结果
  if (patientCase.imageRecognitionResult) {
    sections.push(`【影像学AI识别】
${patientCase.imageRecognitionResult}`)
  }
  
  return sections.join('\n\n')
}

function formatLabResults(labs) {
  if (!labs || Object.keys(labs).length === 0) return null
  
  const results = []
  
  // 激素六项
  const hormones = ['fsh', 'lh', 'e2', 'progesterone', 'testosterone', 'prolactin']
  const hormoneLabels = {
    fsh: 'FSH',
    lh: 'LH',
    e2: 'E2',
    progesterone: 'P',
    testosterone: 'T',
    prolactin: 'PRL'
  }
  const hormoneValues = hormones
    .filter(h => labs[h] !== undefined)
    .map(h => `${hormoneLabels[h]}: ${labs[h]}`)
  
  if (hormoneValues.length > 0) {
    results.push(`性激素：${hormoneValues.join(', ')}`)
  }
  
  // 其他检查
  if (labs.hcg) results.push(`血HCG: ${labs.hcg} mIU/ml`)
  if (labs.hemoglobin) results.push(`血红蛋白: ${labs.hemoglobin} g/L`)
  if (labs.ca125) results.push(`CA125: ${labs.ca125} U/ml`)
  
  return results.join('\n')
}

function getStageSpecificPrompt(roundPhase) {
  const prompts = {
    'initial-assessment': '请进行初步评估，提出可能的诊断和需要进一步完善的检查。',
    'differential-diagnosis': '请进行鉴别诊断，列出至少3个可能的诊断并说明依据。',
    'treatment-planning': '请提出具体的治疗方案，包括药物选择、剂量、疗程和手术指征。',
    'challenge-and-debate': '请审慎评估其他医生的观点，如有不同意见请明确提出并说明理由。'
  }
  return prompts[roundPhase] || '请发表你的专业意见。'
}

function getSpecialtyEnhancement(specialty) {
  // 从 obgynSpecialties 中获取对应专科的 promptEnhancement
  const specialtyData = obgynSpecialties.find(s => s.id === specialty || s.name === specialty)
  return specialtyData?.promptEnhancement || null
}
```

---

### 第二阶段：工具与知识库（2-3周）

#### 任务列表
1. **临床计算器组件**
   - 创建独立的计算器模块 `components/MedicalCalculators/`
   - 实现预产期、孕周、BMI、Bishop评分、RMI等
   - 集成到病例表单中

2. **评分量表系统**
   - 实现 EPDS、APGAR、POP-Q、痛经评分等
   - 创建 `components/ClinicalScales/` 组件库
   - 评分结果自动解读和警示

3. **症状导航系统**
   - 实现决策树算法 `utils/symptomNavigator.js`
   - 创建交互式症状导航界面
   - 自动生成鉴别诊断列表

4. **指南知识库**
   - 整理常见病指南（至少10个）
   - 创建指南检索和展示组件
   - AI 会诊中自动引用相关指南

#### 技术实现示例

```vue
<!-- components/MedicalCalculators/CalculatorModal.vue -->
<template>
  <a-modal
    v-model:visible="visible"
    title="临床计算器"
    width="800px"
    :footer="null"
  >
    <a-tabs v-model:activeKey="activeCalculator">
      <!-- 预产期计算 -->
      <a-tab-pane key="edd" tab="预产期计算">
        <a-form layout="vertical">
          <a-form-item label="末次月经 (LMP)">
            <a-date-picker v-model:value="lmpDate" @change="calculateEDD" style="width: 100%" />
          </a-form-item>
          <a-alert v-if="eddResult" type="info" show-icon>
            <template #message>
              <div class="calc-result">
                <p><strong>预产期：</strong>{{ eddResult.edd }}</p>
                <p><strong>当前孕周：</strong>{{ eddResult.ga.display }}</p>
                <p><strong>孕期阶段：</strong>{{ eddResult.trimester }}</p>
              </div>
            </template>
          </a-alert>
        </a-form>
      </a-tab-pane>
      
      <!-- Bishop评分 -->
      <a-tab-pane key="bishop" tab="Bishop评分">
        <BishopScoreCalculator @result="handleBishopResult" />
      </a-tab-pane>
      
      <!-- RMI -->
      <a-tab-pane key="rmi" tab="卵巢癌RMI">
        <RMICalculator @result="handleRMIResult" />
      </a-tab-pane>
      
      <!-- BMI -->
      <a-tab-pane key="bmi" tab="BMI与孕期体重增长">
        <BMICalculator @result="handleBMIResult" />
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref } from 'vue'
import { obgynCalculators } from '../../utils/medicalCalculators'

const visible = defineModel('visible')
const activeCalculator = ref('edd')
const lmpDate = ref(null)
const eddResult = ref(null)

const calculateEDD = () => {
  if (lmpDate.value) {
    eddResult.value = obgynCalculators.calculateEDD(lmpDate.value)
  }
}

const handleBishopResult = (result) => {
  // 可以自动填充到病例表单或显示建议
  if (result.total >= 8) {
    showSuccess('宫颈成熟，可考虑引产')
  }
}
</script>
```

---

### 第三阶段：智能化增强（2-3周）

#### 任务列表
1. **智能医生推荐**
   - 根据病例关键词自动推荐最合适的专家
   - 急诊自动识别和警示
   - 创建 `components/DoctorRecommendation.vue`

2. **风险评估系统**
   - 妊娠并发症风险评分
   - 手术风险评估
   - 肿瘤复发风险预测

3. **随访管理系统**
   - 根据诊断自动生成随访计划
   - 时间节点提醒（可导出到日历）
   - 创建 `components/FollowUpPlanner.vue`

4. **病例库功能**
   - 保存典型病例到本地库
   - 病例标签和分类
   - 相似病例检索

---

### 第四阶段：体验优化（1-2周）

#### 任务列表
1. **UI/UX 优化**
   - 响应式设计，适配移动端
   - 添加引导教程（新用户指引）
   - 快捷操作和键盘快捷键

2. **导出功能增强**
   - 会诊报告导出为 PDF
   - 病历导出为 Word
   - 随访计划导出为日历文件（.ics）

3. **数据统计分析**
   - 会诊历史统计
   - 常见诊断分布
   - 医生表现分析（哪个模型更准确）

4. **多语言支持（可选）**
   - 英文界面
   - 国际临床指南

---

## 数据结构设计

### 增强的 Pinia Store

```javascript
// src/store/obgynEnhanced.js

import { defineStore } from 'pinia'

export const useObgynStore = defineStore('obgyn', {
  state: () => ({
    // 专科设置
    specialtySettings: {
      preferredSpecialties: [],  // 用户常用的专科
      autoRecommend: true,  // 是否自动推荐医生
      emergencyAlert: true  // 是否启用急诊警示
    },
    
    // 临床工具缓存
    calculatorHistory: [],  // 计算器使用历史
    scaleResults: [],  // 评分量表结果
    
    // 知识库
    guidelines: obgynGuidelines,  // 临床指南
    drugDatabase: commonDrugsInObGyn,  // 药物数据库
    
    // 病例库
    savedCases: [],  // 保存的病例
    caseTags: [],  // 病例标签
    
    // 随访管理
    followUpPlans: [],  // 随访计划
    
    // 统计数据
    statistics: {
      totalConsultations: 0,
      diagnosisDistribution: {},
      specialtyUsage: {},
      averageRounds: 0
    }
  }),
  
  getters: {
    // 获取特定专科的医生
    getDoctorsBySpecialty: (state) => (specialty) => {
      return state.doctors.filter(d => d.specialty === specialty)
    },
    
    // 获取相似病例
    getSimilarCases: (state) => (currentCase) => {
      // 基于关键词匹配查找相似病例
      return state.savedCases.filter(c => {
        const similarity = calculateSimilarity(c, currentCase)
        return similarity > 0.7
      })
    },
    
    // 统计分析
    topDiagnoses: (state) => {
      return Object.entries(state.statistics.diagnosisDistribution)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
    }
  },
  
  actions: {
    // 保存病例到库
    saveCaseToLibrary(caseData, tags = []) {
      const savedCase = {
        id: Date.now().toString(),
        ...caseData,
        tags,
        savedAt: new Date().toISOString()
      }
      this.savedCases.push(savedCase)
      this.persistToLocalStorage()
    },
    
    // 添加随访计划
    addFollowUpPlan(consultationId, plan) {
      this.followUpPlans.push({
        id: Date.now().toString(),
        consultationId,
        plan,
        createdAt: new Date().toISOString(),
        completed: false
      })
      this.persistToLocalStorage()
    },
    
    // 更新统计数据
    updateStatistics(consultationResult) {
      this.statistics.totalConsultations++
      
      // 诊断分布
      const diagnosis = consultationResult.finalDiagnosis
      if (diagnosis) {
        this.statistics.diagnosisDistribution[diagnosis] = 
          (this.statistics.diagnosisDistribution[diagnosis] || 0) + 1
      }
      
      // 专科使用频率
      consultationResult.doctors.forEach(d => {
        this.statistics.specialtyUsage[d.specialty] = 
          (this.statistics.specialtyUsage[d.specialty] || 0) + 1
      })
      
      // 平均轮次
      this.statistics.averageRounds = 
        (this.statistics.averageRounds * (this.statistics.totalConsultations - 1) + consultationResult.totalRounds) / 
        this.statistics.totalConsultations
      
      this.persistToLocalStorage()
    },
    
    // 持久化到 localStorage
    persistToLocalStorage() {
      localStorage.setItem('obgyn-enhanced-data', JSON.stringify({
        savedCases: this.savedCases,
        followUpPlans: this.followUpPlans,
        statistics: this.statistics,
        specialtySettings: this.specialtySettings
      }))
    },
    
    // 从 localStorage 恢复
    restoreFromLocalStorage() {
      const data = localStorage.getItem('obgyn-enhanced-data')
      if (data) {
        const parsed = JSON.parse(data)
        this.savedCases = parsed.savedCases || []
        this.followUpPlans = parsed.followUpPlans || []
        this.statistics = parsed.statistics || this.statistics
        this.specialtySettings = parsed.specialtySettings || this.specialtySettings
      }
    }
  }
})

function calculateSimilarity(case1, case2) {
  // 简单的相似度计算（可以用更复杂的算法）
  const keywords1 = extractKeywords(case1.currentProblem)
  const keywords2 = extractKeywords(case2.currentProblem)
  const intersection = keywords1.filter(k => keywords2.includes(k))
  return intersection.length / Math.max(keywords1.length, keywords2.length)
}

function extractKeywords(text) {
  // 提取关键词（简化版）
  const stopwords = ['的', '了', '和', '是', '在']
  return text.split(/\s+/)
    .filter(w => !stopwords.includes(w) && w.length > 1)
}
```

---

## AI Prompt 优化

### 专科定制化 Prompt 策略

每个专科医生应该有不同的思考模式和关注重点：

```javascript
// src/utils/specialtyPrompts.js

export const specialtyPromptTemplates = {
  // 产科专家的思维模式
  obstetrics: `
作为产科专家，你的思维框架：

1. 【孕周计算】首先确定孕周的准确性（LMP、早期超声、体格检查）
2. 【母胎双方】同时关注母体和胎儿的健康状况
3. 【时间窗口】产科疾病有明确的时间敏感性，把握诊疗时机
4. 【风险分层】区分低危、高危妊娠，制定相应管理方案
5. 【分娩方式】评估阴道分娩 vs 剖宫产的指征

【产科急症识别】
- 胎盘早剥：腹痛+阴道出血+子宫板状硬+胎心异常
- 前置胎盘：无痛性阴道出血（孕晚期）
- 子痫：抽搐+高血压+蛋白尿
- 羊水栓塞：分娩时突发呼吸困难、休克、DIC
- 产后大出血：产后24h内出血>500ml（阴道分娩）或>1000ml（剖宫产）

【产检关键时间点】
- 11-13+6周：NT，早唐
- 15-20周：中唐/无创DNA
- 20-24周：大排畸
- 24-28周：OGTT
- 28周后：每2周产检
- 36周后：每周产检，GBS筛查
`,

  // 妇科肿瘤专家的思维模式
  gynecologicOncology: `
作为妇科肿瘤专家，你的思维框架：

1. 【早期筛查】重视筛查的重要性（宫颈癌TCT+HPV，卵巢癌超声+CA125）
2. 【分期诊断】准确分期决定治疗方案（FIGO分期）
3. 【保育治疗】年轻患者尽量保留生育功能
4. 【多学科协作】肿瘤治疗需要手术、化疗、放疗综合考虑
5. 【随访监测】术后定期监测肿瘤标志物和影像学

【肿瘤标志物解读】
- CA125：卵巢癌首选，但非特异性（子宫内膜异位症、盆腔炎也可升高）
- HE4：卵巢癌特异性更高，联合CA125用于鉴别良恶性
- AFP+HCG：生殖细胞肿瘤
- SCC：宫颈鳞癌
- CEA：粘液性肿瘤

【手术原则】
- 早期癌：分期手术（全面分期，淋巴结清扫）
- 晚期癌：肿瘤细胞减灭术（尽量达到R0切除）
- 保育手术：严格掌握适应症（IA1期宫颈癌、IA期卵巢癌、年轻、强烈生育要求）
`,

  // 生殖内分泌专家的思维模式
  reproductiveEndocrinology: `
作为生殖内分泌专家，你的思维框架：

1. 【时相解读】激素检查必须明确月经周期时相（卵泡期、排卵期、黄体期）
2. 【轴的调节】HPO轴（下丘脑-垂体-卵巢轴）的完整性评估
3. 【代谢联系】内分泌疾病常伴代谢异常（PCOS与胰岛素抵抗、肥胖）
4. 【生育力】关注卵巢储备功能和生育力保护
5. 【长期管理】内分泌疾病需要长期随访和管理

【激素六项解读原则】
- FSH：月经第2-4天，基础FSH>10提示卵巢储备下降，>40提示卵巢早衰
- LH：基础LH/FSH>2-3提示PCOS可能
- E2：基础E2<50 pg/ml正常，>80提示可能有卵泡残留或囊肿
- P：黄体中期（排卵后7天）>10 ng/ml提示有排卵
- T：升高提示高雄激素血症
- PRL：>25 ng/ml高泌乳素血症，需排除垂体瘤

【PCOS诊断陷阱】
- 鹿特丹标准：稀发排卵/无排卵、高雄激素、卵巢多囊改变（3选2）
- 必须排除：CAH（先天性肾上腺皮质增生）、库欣综合征、高泌乳素血症、甲状腺疾病、卵巢或肾上腺肿瘤
- 超声多囊卵巢≠PCOS（20-30%正常女性也有多囊卵巢改变）
`,

  // 妇科急诊专家的思维模式
  emergencyObGyn: `
作为妇产科急诊专家，你的思维模式：

1. 【生命体征优先】首先评估ABC（气道、呼吸、循环）
2. 【快速诊断】利用病史、体格检查、床旁超声快速定位
3. 【鉴别诊断】急性盆腔痛：妇科、外科、内科病因
4. 【止血复苏】大出血时先复苏再诊断
5. 【手术时机】把握急诊手术指征

【急腹症鉴别诊断（妇科 vs 外科）】
妇科病因：
- 异位妊娠破裂：停经+腹痛+休克+血HCG(+)
- 卵巢囊肿蒂扭转：突发剧烈下腹痛，恶心呕吐，包块+压痛
- 卵巢黄体破裂：月经中期或黄体期突发下腹痛
- 急性盆腔炎：发热+下腹痛+白带增多+宫颈举痛

外科病因：
- 急性阑尾炎：转移性右下腹痛，McBurney点压痛
- 肠梗阻：腹痛+腹胀+停止排气排便
- 泌尿系结石：腰痛放射至会阴，血尿

【产后大出血4T原则】
- Tone（宫缩乏力）：最常见（70%），子宫软、出血多→宫缩剂（缩宫素、卡前列素）
- Trauma（软产道损伤）：宫缩好但出血多→检查宫颈、阴道裂伤并缝合
- Tissue（胎盘残留）：胎盘不完整→清宫
- Thrombin（凝血功能障碍）：多次妊娠、胎盘早剥、子痫、DIC→补充凝血因子

【危急值识别】
- 血红蛋白<60 g/L：严重贫血，输血指征
- 血压<90/60 mmHg：低血压性休克
- 血HCG>100,000 mIU/ml且超声未见宫内孕囊：高度怀疑异位妊娠或葡萄胎
- 腹腔积液>500ml + 不稳定生命体征：内出血，急诊手术
`
}

// 在构建 Prompt 时动态插入
export function buildEnhancedPrompt(doctor, patientCase, discussionHistory, round) {
  const basePrompt = doctor.customPrompt || getDefaultPrompt()
  const specialtyPrompt = specialtyPromptTemplates[doctor.specialty] || ''
  
  // 根据轮次调整提示重点
  const roundGuidance = getRoundSpecificGuidance(round)
  
  // 如果检测到急诊，加入紧急提示
  const emergencyAlert = patientCase.emergencyDetected 
    ? '\n\n🚨🚨🚨 紧急情况！请立即评估是否需要急诊处理，生命体征是否稳定，是否需要立即手术！' 
    : ''
  
  return `${basePrompt}

${specialtyPrompt}

${roundGuidance}

${emergencyAlert}

现在，请基于以下病历和讨论历史，发表你的专业意见：

【病历信息】
${formatPatientCase(patientCase)}

【讨论历史】
${formatDiscussionHistory(discussionHistory)}
`
}

function getRoundSpecificGuidance(round) {
  if (round === 1) {
    return `【第1轮讨论要求】
- 提出2-3个最可能的初步诊断
- 说明每个诊断的支持依据
- 建议需要完善的检查
- 初步评估病情严重程度和紧急性`
  } else if (round === 2) {
    return `【第2轮讨论要求】
- 进行鉴别诊断，排除不太可能的诊断
- 如果有新的检查结果，重新评估
- 开始考虑治疗方案的大致方向
- 指出其他医生观点中值得商榷的地方`
  } else {
    return `【后续轮次要求】
- 明确最可能的诊断
- 提出具体、可操作的治疗方案（药物名称、剂量、疗程或手术方式）
- 评估预后和随访计划
- 如果与其他医生意见不同，明确指出分歧点并说明理由`
  }
}
```

---

## 临床价值分析

### 对妇产科医生的价值

1. **辅助诊断工具**
   - 💡 快速获取多角度诊断思路
   - 💡 罕见病鉴别诊断参考
   - 💡 减少诊断遗漏

2. **临床决策支持**
   - 💡 治疗方案对比评估
   - 💡 自动引用最新临床指南
   - 💡 用药安全性检查（妊娠期分级）

3. **教学与培训**
   - 💡 住院医师培训工具
   - 💡 模拟复杂病例讨论
   - 💡 积累典型病例库

4. **学术支持**
   - 💡 病例学术价值评估
   - 💡 协助撰写病例报告
   - 💡 快速生成文献综述框架

### 对患者的价值

1. **获得多专家意见**
   - ✅ 无需挂多个专家号
   - ✅ 24/7 随时可用
   - ✅ 节省就医时间和费用

2. **更好理解病情**
   - ✅ AI 解释更易懂
   - ✅ 获取疾病科普知识
   - ✅ 了解治疗选项

3. **隐私保护**
   - ✅ 纯前端，数据不上传
   - ✅ 敏感问题可放心咨询

### 对医疗系统的价值

1. **提高诊疗效率**
   - 📈 减少误诊漏诊
   - 📈 优化转诊流程
   - 📈 减轻基层医疗压力

2. **医疗资源优化**
   - 📈 患者更合理就医（不必要的专家门诊减少）
   - 📈 促进分级诊疗
   - 📈 减少医疗纠纷

3. **医学知识传播**
   - 📈 最新指南快速推广
   - 📈 标准化诊疗流程
   - 📈 提升整体诊疗水平

---

## 商业化建议

### 免费版 vs 专业版

#### 免费版功能
- ✅ 基础多医生会诊（最多3位医生）
- ✅ 常用医学计算器
- ✅ 基础临床指南查询
- ✅ 保存最近10次会诊记录
- ⚠️ 每日会诊次数限制（如5次/天）
- ⚠️ 仅支持OpenAI和国产模型（需自备API Key）

#### 专业版功能 ($9.99/月 或 $99/年)
- ✨ 无限制会诊次数
- ✨ 最多8位专家同时参与
- ✨ 完整临床工具库（所有计算器、评分量表）
- ✨ 完整临床指南库（定期更新）
- ✨ 病例库（无限保存、标签、检索）
- ✨ 随访管理系统（日历同步、提醒）
- ✨ 数据分析和统计
- ✨ PDF/Word 导出
- ✨ 优先使用最新AI模型
- ✨ 客服支持

#### 机构版功能 (定制报价)
- 🏥 多用户管理（医院/诊所）
- 🏥 团队协作功能
- 🏥 病例共享和教学
- 🏥 定制专科知识库
- 🏥 数据分析仪表板
- 🏥 私有部署选项
- 🏥 培训和技术支持
- 🏥 API 接口

### 盈利模式

1. **订阅收费**（主要）
   - 个人专业版订阅
   - 机构版按席位收费

2. **API 调用分成**（次要）
   - 推荐特定 LLM 服务商，获取返佣
   - 或提供统一 API 中转服务（加价）

3. **增值服务**
   - 真人专家咨询对接（平台抽成）
   - 病例报告润色服务
   - 定制化开发

4. **广告和推广**（谨慎）
   - 医学会议、教材、医疗器械等相关广告
   - 必须保证专业性和用户体验

### 目标用户群体

#### 一级用户（核心）
- 妇产科医生（住院医师、主治医师）
- 医学生（实习、规培）
- 基层医疗机构（乡镇卫生院、社区医院）

#### 二级用户（扩展）
- 患者（自我健康管理）
- 健康管理师
- 医疗保险审核人员

#### 三级用户（长期）
- 医学院校（教学工具）
- 医疗培训机构
- 制药/医疗器械公司（医学教育）

### 市场推广策略

1. **学术营销**
   - 在妇产科学术会议展示
   - 发表相关论文（AI 辅助诊断的临床研究）
   - 与医学院校合作（教学案例库）

2. **内容营销**
   - 公众号/视频号：妇产科知识科普
   - 知乎/小红书：真实病例分析（去隐私化）
   - B站：医生使用教程、典型病例讨论

3. **KOL 合作**
   - 邀请知名妇产科医生试用并推荐
   - 医学大V背书
   - 医院科室团购优惠

4. **免费试用**
   - 免费试用7天专业版
   - 医学生/住院医师教育优惠
   - 医院/诊所团队试用

---

## 风险与合规

### 法律风险

⚠️ **医疗责任界定**
- 必须明确声明：本系统为辅助工具，不替代医生诊断
- 所有诊断和治疗建议仅供参考
- 患者必须就医确诊
- 在显著位置添加免责声明

⚠️ **数据隐私**
- 虽然是纯前端，但仍需明确隐私政策
- API Key等敏感信息的安全存储
- 用户可选择是否保存病历

⚠️ **医疗器械监管**
- 国内：如果用于辅助诊断，可能需要NMPA认证（三类医疗器械）
- 解决方案：定位为"医学教育工具"或"临床决策支持系统（非诊断）"

### 技术风险

⚠️ **AI 幻觉和错误**
- LLM 可能生成不准确甚至危险的建议
- 缓解措施：
  - 多医生交叉验证
  - 引用权威临床指南
  - 在结果中显示"置信度"
  - 定期人工审核常见病例的AI输出质量

⚠️ **API 依赖**
- 依赖第三方LLM服务，可能面临服务中断、涨价
- 缓解措施：
  - 支持多个供应商切换
  - 考虑私有化部署开源大模型（如Qwen、LLaMA）

### 医学伦理

⚠️ **过度依赖AI**
- 医生可能过度依赖AI而忽视自己的临床判断
- 缓解措施：
  - 强调"辅助"而非"替代"
  - 鼓励医生批判性思考AI建议
  - 提供继续医学教育资源

⚠️ **患者自我诊断风险**
- 患者使用后可能自行诊断，延误就医
- 缓解措施：
  - 在患者版界面中更强调"必须就医"
  - 急诊情况自动高亮警告

---

## 实施时间表

### 快速启动（MVP，4-6周）

**Week 1-2: 核心功能扩展**
- ✅ 添加8个亚专科专家角色
- ✅ 优化病例输入表单（结构化字段）
- ✅ 专科 Prompt 优化
- ✅ 急诊识别和警示

**Week 3-4: 临床工具集成**
- ✅ 医学计算器（预产期、孕周、BMI、Bishop、RMI）
- ✅ 基础评分量表（EPDS、APGAR）
- ✅ 症状导航系统（3-5个常见症状决策树）

**Week 5-6: 测试和优化**
- ✅ 邀请妇产科医生内测
- ✅ 收集反馈并快速迭代
- ✅ 编写用户文档和教程
- ✅ 准备上线

### 完整版（3-6个月）

**Month 2:**
- 完整的临床工具库（10+计算器，6+评分量表）
- 临床指南知识库（20+指南）
- 智能医生推荐系统
- 病例库功能

**Month 3:**
- 随访管理系统
- 数据统计分析
- 导出功能增强（PDF、Word、日历）
- 移动端适配

**Month 4-6:**
- 商业化准备（付费系统）
- 市场推广
- 持续优化和扩展

---

## 成功指标 (KPIs)

### 产品指标
- 📊 日活跃用户数 (DAU)
- 📊 会诊次数/用户/周
- 📊 用户留存率（7日、30日）
- 📊 平均会诊轮次
- 📊 工具使用率（计算器、评分量表）

### 质量指标
- ✅ AI 建议准确性（医生评分）
- ✅ 用户满意度（NPS）
- ✅ Bug/错误报告数
- ✅ 响应时间（API调用延迟）

### 商业指标
- 💰 免费用户 → 付费用户转化率
- 💰 月经常性收入 (MRR)
- 💰 用户生命周期价值 (LTV)
- 💰 获客成本 (CAC)
- 💰 流失率 (Churn Rate)

### 影响力指标
- 🌟 学术论文发表
- 🌟 医学会议演讲邀请
- 🌟 媒体报道
- 🌟 医生社区口碑

---

## 结论与建议

### 核心优势

✨ **垂直深化，而非横向扩展**
与其尝试覆盖所有科室，不如将妇产科做到极致：
- 最专业的妇产科AI专家团队
- 最全面的妇产科临床工具
- 最权威的妇产科知识库
- 最适合妇产科场景的工作流

✨ **技术+医学的深度融合**
- 利用AI的泛化能力（多角度思考）
- 结合医学的专业性（结构化知识）
- 创造1+1>2的价值

✨ **纯前端的独特优势**
- 数据安全（医疗数据最敏感）
- 部署简单（无需服务器）
- 成本低（适合个人/小团队）

### 优先级建议

**P0 (必须做，4-6周内)**
1. 8个亚专科专家角色 + 专科 Prompt
2. 增强病例输入表单（结构化）
3. 基础医学计算器（预产期、孕周、Bishop、RMI）
4. 急诊识别和警示
5. 内测和反馈收集

**P1 (应该做，2-3个月内)**
1. 完整临床工具库
2. 症状导航系统
3. 临床指南知识库
4. 病例库和标签
5. 智能医生推荐

**P2 (可以做，3-6个月内)**
1. 随访管理系统
2. 数据统计分析
3. PDF/Word 导出
4. 移动端优化
5. 商业化功能

**P3 (长期规划)**
1. 真人专家对接
2. 团队协作功能
3. 私有化部署
4. 多语言支持
5. 其他专科扩展

### 最终建议

🎯 **最小可行产品 (MVP) 策略**

从现有系统出发，用4-6周时间实现P0功能，快速验证市场需求：

1. **Week 1-2**: 添加专科角色 + Prompt优化
2. **Week 3-4**: 基础临床工具（计算器）
3. **Week 5-6**: 内测 + 反馈迭代

然后邀请10-20位妇产科医生深度试用，收集反馈：
- 哪些功能最有价值？
- 哪些功能缺失？
- 愿意为哪些功能付费？

根据反馈决定后续开发优先级。

🎯 **差异化竞争**

市场上可能有其他医疗AI产品，但你的优势是：
- **专科深度**：其他产品可能是通用型，你是妇产科垂直领域
- **多专家协作**：投票淘汰机制提高准确性
- **纯前端**：数据安全，部署简单
- **临床工具集成**：不仅是AI对话，还有计算器、评分量表、指南等

🎯 **医生社区建设**

长期成功的关键是建立医生社区：
- 邀请医生分享典型病例（去隐私化）
- 举办线上病例讨论会
- 建立医学知识共创机制
- 让医生成为产品的传播者

---

## 附录：参考资源

### 临床指南来源
- 中华医学会妇产科学分会：http://www.csog.org.cn/
- UpToDate（需订阅）
- 国家卫健委临床路径
- ACOG Practice Bulletins（美国妇产科医师学会）
- NICE Guidelines（英国）

### 医学数据库
- PubMed：https://pubmed.ncbi.nlm.nih.gov/
- Cochrane Library
- 中国知网（CNKI）

### 开发资源
- Vue 3 文档：https://vuejs.org/
- Ant Design Vue：https://antdv.com/
- Pinia：https://pinia.vuejs.org/
- marked.js：https://marked.js.org/
- html2canvas（截图导出）：https://html2canvas.hertzen.com/

### 类似产品参考
- UpToDate（临床决策支持）
- Isabel（鉴别诊断系统）
- DynaMed
- Epocrates（药物参考）
- Medscape（临床工具）

---

**祝项目成功！如有技术实现问题，欢迎随时讨论。** 🎉
