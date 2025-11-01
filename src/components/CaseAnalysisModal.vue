<template>
  <a-modal
    v-model:open="modalOpen"
    title="妇产科病例学术价值分析系统"
    width="1200px"
    :footer="null"
    :bodyStyle="{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }"
  >
    <a-row :gutter="16">
      <a-col :span="10">
        <a-card title="病例信息录入" size="small" style="margin-bottom: 16px;">
          <a-form layout="vertical" :model="localCase">
            <a-form-item label="患者姓名" required>
              <a-input v-model:value="localCase.name" placeholder="请输入患者姓名" />
            </a-form-item>
            
            <a-row :gutter="12">
              <a-col :span="12">
                <a-form-item label="性别">
                  <a-select v-model:value="localCase.gender" placeholder="请选择性别">
                    <a-select-option value="female">女</a-select-option>
                    <a-select-option value="male">男</a-select-option>
                    <a-select-option value="other">其他</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item label="年龄">
                  <a-input-number
                    v-model:value="localCase.age"
                    :min="0"
                    :max="120"
                    style="width: 100%"
                    placeholder="年龄"
                  />
                </a-form-item>
              </a-col>
            </a-row>

            <a-form-item label="月经史">
              <a-textarea
                v-model:value="localCase.menstrualHistory"
                :rows="2"
                placeholder="例：LMP 2024-01-15，G3P2A0，月经规律"
              />
            </a-form-item>

            <a-form-item label="婚育史">
              <a-textarea
                v-model:value="localCase.marriageHistory"
                :rows="2"
                placeholder="例：已婚，育有2子，无流产史"
              />
            </a-form-item>

            <a-form-item label="既往妇科病史">
              <a-textarea
                v-model:value="localCase.pastHistory"
                :rows="2"
                placeholder="例：5年前行子宫肌瘤剔除术"
              />
            </a-form-item>

            <a-form-item label="主诉" required>
              <a-textarea
                v-model:value="localCase.currentProblem"
                :rows="3"
                placeholder="例：间断性阴道流血3月，伴下腹痛1周"
              />
            </a-form-item>

            <a-form-item label="体格检查与辅助检查">
              <a-textarea
                v-model:value="localCase.examination"
                :rows="3"
                placeholder="例：妇科检查：宫颈光滑，宫体增大如孕8周，质韧，活动可；实验室：HCG 5000 mIU/ml，CA125 45 U/ml"
              />
            </a-form-item>

            <a-form-item label="影像学检查结果">
              <a-textarea
                v-model:value="localCase.imageRecognitionResult"
                :rows="2"
                placeholder="例：超声提示子宫前壁5cm低回声团块，边界清，CDFI示周边血流信号"
              />
            </a-form-item>

            <a-form-item label="诊断">
              <a-textarea
                v-model:value="localCase.diagnosis"
                :rows="2"
                placeholder="例：子宫肌瘤（浆膜下型），继发贫血"
              />
            </a-form-item>

            <a-form-item label="治疗方案">
              <a-textarea
                v-model:value="localCase.treatment"
                :rows="3"
                placeholder="例：腹腔镜下子宫肌瘤剔除术，术中采用改良止血技术，术后GnRH-a类似物3个月"
              />
            </a-form-item>

            <a-form-item label="治疗效果">
              <a-textarea
                v-model:value="localCase.outcome"
                :rows="2"
                placeholder="例：术后恢复良好，月经恢复正常，术后6月复查未见复发"
              />
            </a-form-item>

            <a-form-item label="随访情况">
              <a-textarea
                v-model:value="localCase.followUp"
                :rows="2"
                placeholder="例：术后12月随访，患者自然受孕并足月顺产一男婴"
              />
            </a-form-item>
          </a-form>

          <a-space style="width: 100%; justify-content: space-between">
            <a-space>
              <a-button type="primary" @click="startAnalysis" :loading="isAnalyzing" :disabled="!canAnalyze">
                {{ isAnalyzing ? '分析中...' : '开始分析' }}
              </a-button>
              <a-button @click="clearForm">清空</a-button>
            </a-space>
            <a-button @click="loadFromConsult" v-if="hasConsultData">从当前会诊导入</a-button>
          </a-space>
        </a-card>

        <a-card title="分析医生选择" size="small">
          <a-select
            v-model:value="selectedDoctorId"
            style="width: 100%"
            placeholder="请选择一位AI医生进行分析"
            :options="doctorOptions"
          />
          <div v-if="selectedDoctorId" style="margin-top: 8px; color: #8c8c8c; font-size: 12px;">
            已选择：{{ selectedDoctorName }}
          </div>
        </a-card>
      </a-col>

      <a-col :span="14">
        <a-card title="学术价值分析结果" size="small" style="height: 100%;">
          <div v-if="store.analysisResult.status === 'idle'" style="text-align: center; padding: 60px 20px; color: #8c8c8c;">
            <div style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;">📄</div>
            <div>请填写病例信息并选择医生后开始分析</div>
          </div>

          <div v-else-if="store.analysisResult.status === 'analyzing'" style="text-align: center; padding: 60px 20px;">
            <a-spin size="large" tip="AI正在深度分析病例的学术价值与创新性，请稍候..." />
          </div>

          <div v-else-if="store.analysisResult.status === 'error'" style="padding: 20px;">
            <a-alert type="error" show-icon :message="store.analysisResult.content" />
          </div>

          <div v-else-if="store.analysisResult.status === 'completed'" ref="resultRef">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <a-tag color="success">分析完成</a-tag>
                <span style="color: #8c8c8c; font-size: 12px;">
                  由 {{ store.analysisResult.doctorName }} 生成 · {{ formatTime(store.analysisResult.timestamp) }}
                </span>
              </div>
              <a-button type="dashed" size="small" @click="exportResultImage">导出图片</a-button>
            </div>

            <div class="analysis-result-container">
              <div class="result-header">
                <h3>🔬 妇产科病例学术价值分析报告</h3>
                <div class="patient-brief">
                  <strong>{{ localCase.name || '未命名患者' }}</strong>
                  <span v-if="localCase.gender">（{{ genderText }}）</span>
                  <span v-if="localCase.age !== null && localCase.age !== undefined">，{{ localCase.age }}岁</span>
                </div>
              </div>
              
              <div v-html="renderMarkdown(store.analysisResult.content)" class="markdown-content"></div>
            </div>
          </div>
        </a-card>

        <a-card v-if="hasHistory" title="分析历史" size="small" style="margin-top: 16px;">
          <a-list :data-source="store.analysisHistory.slice().reverse()" size="small">
            <template #renderItem="{ item }">
              <a-list-item>
                <template #actions>
                  <a @click="loadHistory(item.id)">查看</a>
                  <a-popconfirm title="确认删除？" @confirm="deleteHistory(item.id)">
                    <a style="color: #ff4d4f;">删除</a>
                  </a-popconfirm>
                </template>
                <a-list-item-meta>
                  <template #title>
                    {{ item.patientCase.name || '未命名患者' }}
                  </template>
                  <template #description>
                    {{ formatTime(item.timestamp) }} · 由 {{ item.doctorName }} 分析
                  </template>
                </a-list-item-meta>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </a-modal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { marked } from 'marked'
import { message } from 'ant-design-vue'
import { useCaseAnalysisStore } from '../store/caseAnalysis'
import { useGlobalStore } from '../store/global'
import { useConsultStore } from '../store'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['update:open'])

const store = useCaseAnalysisStore()
const globalStore = useGlobalStore()
const consultStore = useConsultStore()

const modalOpen = ref(props.open)
const localCase = ref({ ...store.patientCase })
const selectedDoctorId = ref(store.selectedDoctor ? store.selectedDoctor.id : null)
const resultRef = ref(null)

watch(() => props.open, (v) => {
  modalOpen.value = v
  if (v) {
    localCase.value = { ...store.patientCase }
    selectedDoctorId.value = store.selectedDoctor ? store.selectedDoctor.id : null
  }
})

watch(modalOpen, (v) => emit('update:open', v))

watch(localCase, (value) => {
  store.setPatientCase(value)
}, { deep: true })

watch(selectedDoctorId, (id) => {
  const doctor = globalStore.doctors.find((d) => d.id === id)
  store.setSelectedDoctor(doctor || null)
})

const doctorOptions = computed(() => {
  return globalStore.doctors.map((d) => ({
    label: `${d.name}（${d.provider} · ${d.model}）`,
    value: d.id
  }))
})

const selectedDoctorName = computed(() => {
  const doctor = globalStore.doctors.find((d) => d.id === selectedDoctorId.value)
  return doctor ? doctor.name : ''
})

const isAnalyzing = computed(() => store.isAnalyzing)

const canAnalyze = computed(() => {
  return selectedDoctorId.value && localCase.value.name && localCase.value.currentProblem
})

const hasConsultData = computed(() => {
  return consultStore.patientCase && consultStore.patientCase.name && consultStore.patientCase.currentProblem
})

const hasHistory = computed(() => store.analysisHistory && store.analysisHistory.length > 0)

const genderText = computed(() => {
  const genderMap = { male: '男', female: '女', other: '其他' }
  return genderMap[localCase.value.gender] || localCase.value.gender || ''
})

async function startAnalysis() {
  if (!canAnalyze.value) {
    message.warning('请填写患者姓名、主诉，并选择分析医生')
    return
  }

  try {
    store.setPatientCase(localCase.value)
    const doctor = globalStore.doctors.find((d) => d.id === selectedDoctorId.value)
    store.setSelectedDoctor(doctor)
    await store.analyzeCase()
    message.success('分析完成！')
  } catch (error) {
    message.error('分析失败：' + (error.message || error))
  }
}

function clearForm() {
  localCase.value = {
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
  store.clearCase()
}

function loadFromConsult() {
  const consultCase = consultStore.patientCase
  localCase.value = {
    name: consultCase.name || '',
    gender: consultCase.gender || '',
    age: consultCase.age,
    menstrualHistory: consultCase.menstrualHistory || '',
    marriageHistory: consultCase.marriageHistory || '',
    pastHistory: consultCase.pastHistory || '',
    currentProblem: consultCase.currentProblem || '',
    imageRecognitionResult: consultCase.imageRecognitionResult || '',
    examination: '',
    diagnosis: '',
    treatment: '',
    outcome: '',
    followUp: ''
  }
  
  if (consultStore.finalSummary && consultStore.finalSummary.content) {
    localCase.value.diagnosis = consultStore.finalSummary.content
  }
  
  message.success('已从当前会诊导入病例信息')
}

function loadHistory(historyId) {
  store.loadFromHistory(historyId)
  localCase.value = { ...store.patientCase }
  message.success('已加载历史分析记录')
}

function deleteHistory(historyId) {
  store.deleteFromHistory(historyId)
  message.success('已删除')
}

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const pad = (n) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function renderMarkdown(text) {
  try {
    return marked.parse(text || '')
  } catch (e) {
    return text
  }
}

async function exportResultImage() {
  const node = resultRef.value
  if (!node) return
  try {
    const dataUrl = await window.htmlToImage.toPng(node, { pixelRatio: 2, cacheBust: true })
    const a = document.createElement('a')
    const fileName = localCase.value.name ? `${localCase.value.name}-病例学术价值分析` : '病例学术价值分析'
    a.href = dataUrl
    a.download = `${fileName}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  } catch (e) {
    message.error('导出失败')
    console.error(e)
  }
}
</script>

<style scoped>
.analysis-result-container {
  background: #ffffff;
  border: 1px solid #e6f4ff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.result-header {
  border-bottom: 2px solid #1890ff;
  padding-bottom: 12px;
  margin-bottom: 20px;
}

.result-header h3 {
  margin: 0 0 8px 0;
  color: #0958d9;
  font-size: 18px;
  font-weight: 600;
}

.patient-brief {
  color: #595959;
  font-size: 14px;
}

.markdown-content {
  line-height: 1.8;
}

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4) {
  margin: 20px 0 12px;
  color: #262626;
}

.markdown-content :deep(h1) {
  font-size: 24px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 8px;
}

.markdown-content :deep(h2) {
  font-size: 20px;
  color: #1890ff;
}

.markdown-content :deep(h3) {
  font-size: 16px;
  color: #1890ff;
}

.markdown-content :deep(p) {
  margin: 8px 0;
  color: #595959;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
}

.markdown-content :deep(li) {
  margin: 4px 0;
  color: #595959;
}

.markdown-content :deep(strong) {
  color: #262626;
  font-weight: 600;
}

.markdown-content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  color: #d4380d;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #1890ff;
  padding-left: 12px;
  margin: 12px 0;
  color: #8c8c8c;
  font-style: italic;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #f0f0f0;
  padding: 8px 12px;
  text-align: left;
}

.markdown-content :deep(th) {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}
</style>
