import { defineStore } from 'pinia'
import { callAI } from '../api/callAI'

export const useCaseAnalysisStore = defineStore('caseAnalysis', {
  state: () => ({
    analysisConfig: {
      systemPrompt: `你是一位资深的妇产科专家和医学教育者，精通妇产科临床实践、医学研究和病例分析。你的任务是深入分析妇产科病例的创新性和学术价值。

你的分析必须遵循以下原则：
1. 多维度评估：从临床表现、诊断策略、治疗方案、学术价值等多个维度进行分析
2. 创新性识别：识别病例中的独特之处、罕见表现、创新治疗方法或诊断思路
3. 学术价值：评估病例的教育意义、研究潜力和发表价值
4. 循证分析：基于最新的妇产科医学文献和指南进行评估
5. 实用建议：提供具体的改进建议和进一步研究方向

请从以下维度进行分析：
- 病例特殊性（罕见度、复杂性、非典型性）
- 诊断创新性（诊断方法、辅助检查应用、鉴别诊断思路）
- 治疗创新性（治疗方案、用药选择、手术技术、围手术期管理）
- 学术价值（病例报告价值、教学价值、研究启示）
- 临床意义（对临床实践的指导意义、推广价值）
- 改进空间（可以进一步探索的方向、数据补充建议）`,
      analysisPrompt: `请对以下妇产科病例进行深入的创新性分析，输出结构化的分析报告。

## 分析维度

### 1. 病例特殊性评估（评分：1-10分）
- 罕见度：该病例在妇产科临床中的罕见程度
- 复杂性：病例涉及的疾病数量、诊疗难度
- 非典型性：症状、体征、影像学表现的非典型程度
- 综合评分与说明

### 2. 诊断创新性分析（评分：1-10分）
- 诊断思路：是否体现创新的临床思维或诊断策略
- 辅助检查：是否运用新技术、新方法（如高级超声、MRI、分子诊断等）
- 鉴别诊断：鉴别诊断的全面性和深度
- 综合评分与说明

### 3. 治疗创新性评估（评分：1-10分）
- 治疗方案：是否采用创新的治疗策略（保守治疗、微创手术、新药应用等）
- 个体化程度：治疗方案针对患者特殊情况的个体化程度
- 生育力保护：对育龄女性的生育功能保护策略
- 综合评分与说明

### 4. 学术价值评估（评分：1-10分）
- 病例报告价值：是否具备发表病例报告的价值
- 教学价值：对医学生、住院医师培训的教学意义
- 研究启示：能否引发进一步的临床研究或基础研究
- 综合评分与说明

### 5. 临床指导意义（评分：1-10分）
- 实践指导：对其他临床医生的参考价值
- 推广潜力：诊疗经验的可推广性
- 安全性考虑：风险管理和并发症预防的借鉴意义
- 综合评分与说明

### 6. 创新性亮点总结
列出该病例最突出的3-5个创新点或特殊价值

### 7. 改进建议与研究方向
- 数据补充：建议补充哪些临床数据、检查结果或随访信息
- 深入研究：可以进一步探索的科研方向
- 文献对比：建议查阅的相关文献和指南

### 8. 综合创新性评分（1-10分）
综合以上各维度，给出该病例的总体创新性评分，并说明理由。

### 9. 发表建议
- 是否建议撰写病例报告
- 适合投稿的期刊类型（核心期刊、SCI期刊等）
- 撰写重点和注意事项

请确保分析客观、专业、全面，既指出创新之处，也诚实评估不足。`
    },
    selectedDoctor: null,
    patientCase: {
      name: '',
      gender: '',
      age: null,
      menstrualHistory: '',
      marriageHistory: '',
      pastHistory: '',
      currentProblem: '',
      imageRecognitionResult: '',
      examination: '',
      diagnosis: '',
      treatment: '',
      outcome: '',
      followUp: ''
    },
    analysisResult: {
      status: 'idle',
      content: '',
      timestamp: null,
      doctorName: ''
    },
    analysisHistory: []
  }),
  getters: {
    isAnalyzing(state) {
      return state.analysisResult.status === 'analyzing'
    },
    hasResult(state) {
      return state.analysisResult.status === 'completed' && state.analysisResult.content
    }
  },
  actions: {
    setSelectedDoctor(doctor) {
      this.selectedDoctor = doctor
    },
    setPatientCase(caseInfo) {
      this.patientCase = { ...this.patientCase, ...caseInfo }
    },
    setAnalysisConfig(config) {
      this.analysisConfig = { ...this.analysisConfig, ...config }
    },
    async analyzeCase() {
      if (!this.selectedDoctor) {
        throw new Error('请先选择一位AI医生进行分析')
      }
      if (!this.patientCase.name || !this.patientCase.currentProblem) {
        throw new Error('请至少填写患者姓名和主诉')
      }

      this.analysisResult = {
        status: 'analyzing',
        content: '',
        timestamp: new Date().toISOString(),
        doctorName: this.selectedDoctor.name
      }

      try {
        const caseDescription = this.buildCaseDescription()
        const fullPrompt = {
          system: this.analysisConfig.systemPrompt,
          user: `${this.analysisConfig.analysisPrompt}\n\n${caseDescription}`
        }
        
        const response = await callAI(this.selectedDoctor, fullPrompt, [])

        this.analysisResult = {
          status: 'completed',
          content: response,
          timestamp: new Date().toISOString(),
          doctorName: this.selectedDoctor.name
        }

        this.analysisHistory.push({
          id: `analysis-${Date.now()}`,
          patientCase: { ...this.patientCase },
          result: response,
          doctorName: this.selectedDoctor.name,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        this.analysisResult = {
          status: 'error',
          content: `分析失败：${error.message || error}`,
          timestamp: new Date().toISOString(),
          doctorName: this.selectedDoctor.name
        }
        throw error
      }
    },
    buildCaseDescription() {
      const parts = []
      parts.push('## 病例信息\n')
      
      if (this.patientCase.name) {
        parts.push(`**患者姓名**：${this.patientCase.name}`)
      }
      
      const genderMap = { male: '男', female: '女', other: '其他' }
      if (this.patientCase.gender) {
        parts.push(`**性别**：${genderMap[this.patientCase.gender] || this.patientCase.gender}`)
      }
      
      if (this.patientCase.age !== null && this.patientCase.age !== undefined) {
        parts.push(`**年龄**：${this.patientCase.age}岁`)
      }
      
      if (this.patientCase.menstrualHistory) {
        parts.push(`**月经史**：${this.patientCase.menstrualHistory}`)
      }
      
      if (this.patientCase.marriageHistory) {
        parts.push(`**婚育史**：${this.patientCase.marriageHistory}`)
      }
      
      if (this.patientCase.pastHistory) {
        parts.push(`**既往妇科病史**：${this.patientCase.pastHistory}`)
      }
      
      if (this.patientCase.currentProblem) {
        parts.push(`**主诉**：${this.patientCase.currentProblem}`)
      }
      
      if (this.patientCase.examination) {
        parts.push(`**体格检查与辅助检查**：${this.patientCase.examination}`)
      }
      
      if (this.patientCase.imageRecognitionResult) {
        parts.push(`**影像学检查**：${this.patientCase.imageRecognitionResult}`)
      }
      
      if (this.patientCase.diagnosis) {
        parts.push(`**诊断**：${this.patientCase.diagnosis}`)
      }
      
      if (this.patientCase.treatment) {
        parts.push(`**治疗方案**：${this.patientCase.treatment}`)
      }
      
      if (this.patientCase.outcome) {
        parts.push(`**治疗效果**：${this.patientCase.outcome}`)
      }
      
      if (this.patientCase.followUp) {
        parts.push(`**随访情况**：${this.patientCase.followUp}`)
      }
      
      return parts.join('\n\n')
    },
    resetAnalysis() {
      this.analysisResult = {
        status: 'idle',
        content: '',
        timestamp: null,
        doctorName: ''
      }
    },
    clearCase() {
      this.patientCase = {
        name: '',
        gender: '',
        age: null,
        menstrualHistory: '',
        marriageHistory: '',
        pastHistory: '',
        currentProblem: '',
        imageRecognitionResult: '',
        examination: '',
        diagnosis: '',
        treatment: '',
        outcome: '',
        followUp: ''
      }
      this.resetAnalysis()
    },
    loadFromHistory(historyId) {
      const history = this.analysisHistory.find((h) => h.id === historyId)
      if (history) {
        this.patientCase = { ...history.patientCase }
        this.analysisResult = {
          status: 'completed',
          content: history.result,
          timestamp: history.timestamp,
          doctorName: history.doctorName
        }
      }
    },
    deleteFromHistory(historyId) {
      this.analysisHistory = this.analysisHistory.filter((h) => h.id !== historyId)
    }
  }
})
