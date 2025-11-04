<template>
  <a-card title="病例输入" :bordered="false" class="case-input-card">
    <a-form :model="form" layout="vertical" @finish="onSubmit" class="case-form">
      <a-divider orientation="left">基本信息</a-divider>
      <a-row :gutter="16">
        <a-col :xs="24" :md="8">
          <a-form-item label="患者姓名" name="name" :rules="[{ required: true, message: '请输入患者姓名' }]">
            <a-input v-model:value="form.name" placeholder="请输入患者姓名" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="性别" name="gender">
            <a-select v-model:value="form.gender" placeholder="请选择性别">
              <a-select-option value="female">女</a-select-option>
              <a-select-option value="male">男</a-select-option>
              <a-select-option value="other">其他</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="4">
          <a-form-item label="年龄" name="age">
            <a-input-number v-model:value="form.age" :min="0" :max="120" style="width: 100%" placeholder="岁" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="3">
          <a-form-item label="体重 (kg)">
            <a-input-number v-model:value="form.weight" :min="20" :max="200" style="width: 100%" placeholder="kg" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="3">
          <a-form-item label="身高 (cm)">
            <a-input-number v-model:value="form.height" :min="120" :max="210" style="width: 100%" placeholder="cm" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :xs="24" :md="8">
          <a-form-item label="末次月经 (LMP)">
            <a-date-picker
              v-model:value="form.lmp"
              value-format="YYYY-MM-DD"
              style="width: 100%"
              placeholder="选择日期"
            />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="8">
          <a-form-item label="月经周期">
            <a-input v-model:value="form.menstrualCycle" placeholder="例如：28-30天，规律" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="4">
          <a-form-item label="初潮年龄">
            <a-input-number v-model:value="form.menarcheAge" :min="8" :max="20" style="width: 100%" placeholder="岁" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="4">
          <a-form-item label="绝经状态">
            <a-select v-model:value="form.menopausalStatus" placeholder="选择">
              <a-select-option value="premenopausal">未绝经</a-select-option>
              <a-select-option value="perimenopausal">围绝经期</a-select-option>
              <a-select-option value="postmenopausal">已绝经</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <div v-if="gestationalInfo" class="info-alert">
        <a-alert type="info" show-icon message="孕期提示" :description="gestationalDescription" />
      </div>
      <div v-if="bmiInfo" class="info-alert">
        <a-alert type="success" show-icon>
          <template #message>
            体质指数 (BMI)：{{ bmiInfo.bmi }}，{{ bmiInfo.category }}
          </template>
          <template #description>
            <div>
              <div v-if="weightGainInfo">
                建议孕期体重增长：{{ weightGainInfo.min }} - {{ weightGainInfo.max }} kg
              </div>
              <div v-else>保持健康的体重范围有助于孕期管理。</div>
            </div>
          </template>
        </a-alert>
      </div>

      <a-form-item label="月经史">
        <a-textarea v-model:value="form.menstrualHistory" rows="2" placeholder="初潮、周期、经量、痛经等" />
      </a-form-item>
      <a-form-item label="婚育史">
        <a-textarea v-model:value="form.marriageHistory" rows="2" placeholder="婚姻状况、孕产史、分娩方式等" />
      </a-form-item>

      <a-row :gutter="16">
        <a-col :xs="24" :md="6">
          <a-form-item label="孕次 (G)">
            <a-input-number v-model:value="form.gravida" :min="0" :max="20" style="width: 100%" placeholder="次" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="产次 (P)">
            <a-input-number v-model:value="form.para" :min="0" :max="20" style="width: 100%" placeholder="次" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="流产次数 (A)">
            <a-input-number v-model:value="form.abortion" :min="0" :max="20" style="width: 100%" placeholder="次" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="生育需求">
            <a-select v-model:value="form.fertilityDesire" placeholder="选择">
              <a-select-option value="">未说明</a-select-option>
              <a-select-option value="yes">有生育需求</a-select-option>
              <a-select-option value="no">无生育需求</a-select-option>
              <a-select-option value="completed">已完成生育</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>

      <a-form-item label="既往病史">
        <a-textarea v-model:value="form.pastHistory" rows="2" placeholder="妇科疾病史、手术史、用药史等" />
      </a-form-item>

      <a-divider orientation="left">临床表现</a-divider>
      <a-form-item label="主诉" name="currentProblem" :rules="[{ required: true, message: '请输入主诉' }]">
        <a-textarea
          v-model:value="form.currentProblem"
          rows="3"
          placeholder="如：停经45天，阴道少量出血3天"
          show-count
          :maxlength="200"
        />
      </a-form-item>
      <a-form-item label="症状选择">
        <a-checkbox-group v-model:value="form.symptoms">
          <a-row>
            <a-col v-for="option in symptomOptions" :key="option.value" :xs="12" :sm="8" :md="6">
              <a-checkbox :value="option.value">{{ option.label }}</a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="现病史">
        <a-textarea
          v-model:value="form.historyOfPresentIllness"
          rows="4"
          placeholder="描述症状发生、发展、伴随症状、已进行的检查和治疗"
        />
      </a-form-item>

      <a-divider orientation="left">体格检查</a-divider>
      <a-row :gutter="16">
        <a-col :xs="24" :md="6">
          <a-form-item label="体温 (°C)">
            <a-input-number v-model:value="form.temperature" :min="34" :max="43" :step="0.1" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="血压 (mmHg)">
            <a-input v-model:value="form.bloodPressure" placeholder="如：120/80" />
          </a-form-item>
        </a-col>
        <a-col :xs="24" :md="6">
          <a-form-item label="脉搏 (次/分)">
            <a-input-number v-model:value="form.pulse" :min="40" :max="200" style="width: 100%" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="妇科检查">
        <a-textarea v-model:value="form.gynecologicalExam" rows="3" placeholder="外阴、阴道、宫颈、宫体、附件检查结果" />
      </a-form-item>

      <a-divider orientation="left">辅助检查</a-divider>
      <a-collapse>
        <a-collapse-panel key="labs" header="实验室检查">
          <a-row :gutter="16">
            <a-col :xs="24" :md="6">
              <a-form-item label="血HCG (mIU/ml)">
                <a-input-number v-model:value="form.labs.hcg" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="6">
              <a-form-item label="血红蛋白 (g/L)">
                <a-input-number v-model:value="form.labs.hemoglobin" :min="0" :max="200" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="6">
              <a-form-item label="CA125 (U/ml)">
                <a-input-number v-model:value="form.labs.ca125" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-divider>性激素六项</a-divider>
          <a-row :gutter="16">
            <a-col :xs="24" :md="4">
              <a-form-item label="FSH">
                <a-input-number v-model:value="form.labs.fsh" :min="0" :step="0.1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="4">
              <a-form-item label="LH">
                <a-input-number v-model:value="form.labs.lh" :min="0" :step="0.1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="4">
              <a-form-item label="E2">
                <a-input-number v-model:value="form.labs.e2" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="4">
              <a-form-item label="P">
                <a-input-number v-model:value="form.labs.progesterone" :min="0" :step="0.1" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="4">
              <a-form-item label="T">
                <a-input-number v-model:value="form.labs.testosterone" :min="0" :step="0.01" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xs="24" :md="4">
              <a-form-item label="PRL">
                <a-input-number v-model:value="form.labs.prolactin" :min="0" style="width: 100%" />
              </a-form-item>
            </a-col>
          </a-row>
        </a-collapse-panel>
        <a-collapse-panel key="imaging" header="影像学检查">
          <a-form-item label="超声检查">
            <a-textarea v-model:value="form.imaging.ultrasound" rows="3" placeholder="子宫、内膜、附件、胎儿情况等" />
          </a-form-item>
          <a-form-item label="CT/MRI">
            <a-textarea v-model:value="form.imaging.ctMri" rows="2" placeholder="如有，请描述影像结果" />
          </a-form-item>
        </a-collapse-panel>
        <a-collapse-panel key="pathology" header="病理/宫颈筛查">
          <a-form-item label="宫颈细胞学 (TCT)">
            <a-select v-model:value="form.pathology.tct" allow-clear placeholder="选择结果">
              <a-select-option value="">未进行</a-select-option>
              <a-select-option value="NILM">NILM（未见上皮内病变）</a-select-option>
              <a-select-option value="ASC-US">ASC-US</a-select-option>
              <a-select-option value="LSIL">LSIL</a-select-option>
              <a-select-option value="HSIL">HSIL</a-select-option>
              <a-select-option value="SCC">SCC</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="HPV检测结果">
            <a-radio-group v-model:value="form.pathology.hpv">
              <a-radio value="">未检测</a-radio>
              <a-radio value="negative">阴性</a-radio>
              <a-radio value="positive">阳性</a-radio>
            </a-radio-group>
            <a-input
              v-if="form.pathology.hpv === 'positive'"
              v-model:value="form.pathology.hpvType"
              placeholder="请输入具体型别，如 HPV16/18"
              style="margin-top: 8px"
            />
          </a-form-item>
        </a-collapse-panel>
      </a-collapse>

      <a-divider orientation="left">影像资料（AI识别）</a-divider>
      <a-form-item v-if="imageRecognitionEnabled" label="上传影像">
        <div class="image-upload">
          <a-upload :before-upload="handleImageUpload" :show-upload-list="false" accept="image/*" multiple>
            <a-button :loading="hasPendingImages">
              <template #icon><span>📷</span></template>
              {{ uploadedImages.length ? '继续上传' : '上传影像' }}
            </a-button>
          </a-upload>
          <div v-if="recognizingCount > 0" class="image-status primary">
            正在识别 {{ recognizingCount }} 张图片，队列等待 {{ queuedCount }} 张
          </div>
          <div v-else-if="queuedCount > 0" class="image-status warning">
            已加入识别队列，待识别 {{ queuedCount }} 张
          </div>
          <div v-if="uploadedImages.length" class="image-preview-list">
            <div v-for="(image, index) in uploadedImages" :key="image.id" class="image-preview-item">
              <div class="preview-thumb">
                <img v-if="image.dataUrl" :src="image.dataUrl" alt="影像预览" />
                <div v-else class="no-preview">无预览</div>
              </div>
              <div class="preview-content">
                <div class="preview-header">
                  <span>图片 {{ index + 1 }}</span>
                  <a-button type="link" size="small" danger @click="removeImage(index)">删除</a-button>
                </div>
                <div v-if="image.status === 'recognizing'" class="preview-status info">
                  <a-spin size="small" /> 识别中...
                </div>
                <div v-else-if="image.status === 'queued'" class="preview-status warning">
                  ⏳ 排队中，等待识别
                </div>
                <div v-else-if="image.status === 'success' && image.result" class="preview-result">
                  <a-alert type="success" message="识别成功" show-icon>
                    <template #description>
                      <div class="preview-text">{{ image.result }}</div>
                    </template>
                  </a-alert>
                </div>
                <div v-else-if="image.status === 'error'" class="preview-result">
                  <a-alert type="error" message="识别失败" show-icon>
                    <template #description>
                      <div class="preview-text">{{ image.error || '识别失败' }}</div>
                    </template>
                  </a-alert>
                </div>
              </div>
            </div>
          </div>
        </div>
      </a-form-item>
      <a-alert
        v-else
        type="warning"
        show-icon
        message="未启用图像识别"
        description="如需使用AI影像识别，请在右上角“设置 - 图片识别”中启用并配置API。"
        style="margin-bottom: 16px;"
      />

      <a-divider orientation="left">诊疗信息</a-divider>
      <a-form-item label="初步诊断">
        <a-input v-model:value="form.preliminaryDiagnosis" placeholder="如已进行初步诊断，请填写" />
      </a-form-item>
      <a-form-item label="已采取的治疗">
        <a-textarea v-model:value="form.treatmentGiven" rows="2" placeholder="药物、手术或其他治疗措施" />
      </a-form-item>
      <a-form-item label="会诊目标">
        <a-checkbox-group v-model:value="form.consultationPurpose">
          <a-space direction="vertical">
            <a-checkbox v-for="option in consultationPurposeOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </a-checkbox>
          </a-space>
        </a-checkbox-group>
      </a-form-item>
      <a-form-item label="补充说明">
        <a-textarea v-model:value="form.historyNotes" rows="2" placeholder="其他需要AI医生重点关注的信息" />
      </a-form-item>

      <div class="form-actions">
        <a-button type="primary" html-type="submit" size="large">开始会诊</a-button>
        <a-button size="large" @click="openSettings">问诊设置</a-button>
        <a-button size="large" @click="openCalculators">🧮 临床计算器</a-button>
      </div>
    </a-form>

    <MedicalCalculatorModal v-model:open="calculatorVisible" />
  </a-card>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useConsultStore } from '../store'
import { useImageRecognitionQueue } from '../composables/useImageRecognitionQueue'
import MedicalCalculatorModal from './MedicalCalculatorModal.vue'
import { obgynCalculators } from '../utils/medicalCalculators'

const store = useConsultStore()
const calculatorVisible = ref(false)

const symptomOptions = [
  { label: '阴道出血', value: 'vaginalBleeding' },
  { label: '腹痛', value: 'abdominalPain' },
  { label: '白带异常', value: 'abnormalDischarge' },
  { label: '痛经', value: 'dysmenorrhea' },
  { label: '闭经', value: 'amenorrhea' },
  { label: '不孕', value: 'infertility' },
  { label: '尿失禁', value: 'urinaryIncontinence' },
  { label: '盆腔包块', value: 'pelvicMass' },
  { label: '发热', value: 'fever' },
  { label: '恶心呕吐', value: 'nausea' },
  { label: '乏力', value: 'fatigue' },
  { label: '浮肿', value: 'edema' }
]

const consultationPurposeOptions = [
  { label: '明确诊断', value: 'diagnosis' },
  { label: '制定治疗方案', value: 'treatment' },
  { label: '评估预后与风险', value: 'prognosis' },
  { label: '获取第二诊疗意见', value: 'secondOpinion' },
  { label: '优化随访计划', value: 'followUp' }
]

function createDefaultLabs() {
  return {
    hcg: null,
    hemoglobin: null,
    ca125: null,
    fsh: null,
    lh: null,
    e2: null,
    progesterone: null,
    testosterone: null,
    prolactin: null
  }
}

function createDefaultImaging() {
  return {
    ultrasound: '',
    ctMri: ''
  }
}

function createDefaultPathology() {
  return {
    tct: '',
    hpv: '',
    hpvType: ''
  }
}

const form = reactive({
  name: '',
  gender: 'female',
  age: null,
  weight: null,
  height: null,
  lmp: '',
  menstrualCycle: '',
  menarcheAge: null,
  menopausalStatus: '',
  menstrualHistory: '',
  marriageHistory: '',
  pastHistory: '',
  currentProblem: '',
  symptoms: [],
  historyOfPresentIllness: '',
  fertilityDesire: '',
  gravida: null,
  para: null,
  abortion: null,
  temperature: null,
  bloodPressure: '',
  pulse: null,
  gynecologicalExam: '',
  labs: createDefaultLabs(),
  imaging: createDefaultImaging(),
  pathology: createDefaultPathology(),
  preliminaryDiagnosis: '',
  treatmentGiven: '',
  consultationPurpose: [],
  historyNotes: ''
})

function syncFormFromStore(caseInfo = {}) {
  form.name = caseInfo.name || ''
  form.gender = caseInfo.gender || 'female'
  form.age = caseInfo.age ?? null
  form.weight = caseInfo.weight ?? null
  form.height = caseInfo.height ?? null
  form.lmp = caseInfo.lmp || ''
  form.menstrualCycle = caseInfo.menstrualCycle || ''
  form.menarcheAge = caseInfo.menarcheAge ?? null
  form.menopausalStatus = caseInfo.menopausalStatus || ''
  form.menstrualHistory = caseInfo.menstrualHistory || ''
  form.marriageHistory = caseInfo.marriageHistory || ''
  form.pastHistory = caseInfo.pastHistory || ''
  form.currentProblem = caseInfo.currentProblem || ''
  form.symptoms = Array.isArray(caseInfo.symptoms) ? [...caseInfo.symptoms] : []
  form.historyOfPresentIllness = caseInfo.historyOfPresentIllness || ''
  form.fertilityDesire = caseInfo.fertilityDesire || ''
  form.gravida = caseInfo.gravida ?? null
  form.para = caseInfo.para ?? null
  form.abortion = caseInfo.abortion ?? null
  form.temperature = caseInfo.temperature ?? null
  form.bloodPressure = caseInfo.bloodPressure || ''
  form.pulse = caseInfo.pulse ?? null
  form.gynecologicalExam = caseInfo.gynecologicalExam || ''
  Object.assign(form.labs, createDefaultLabs(), caseInfo.labs || {})
  Object.assign(form.imaging, createDefaultImaging(), caseInfo.imaging || {})
  Object.assign(form.pathology, createDefaultPathology(), caseInfo.pathology || {})
  form.preliminaryDiagnosis = caseInfo.preliminaryDiagnosis || ''
  form.treatmentGiven = caseInfo.treatmentGiven || ''
  form.consultationPurpose = Array.isArray(caseInfo.consultationPurpose) ? [...caseInfo.consultationPurpose] : []
  form.historyNotes = caseInfo.historyNotes || ''
}

syncFormFromStore(store.patientCase)

watch(
  () => store.patientCase,
  (newCase) => {
    syncFormFromStore(newCase || {})
  },
  { deep: true }
)

const gestationalInfo = computed(() => {
  if (!form.lmp) return null
  const info = obgynCalculators.calculateEDD(form.lmp)
  if (!info || !info.gestationalAge || info.gestationalAge.valid === false) {
    return null
  }
  return info
})

const gestationalDescription = computed(() => {
  if (!gestationalInfo.value) return ''
  return `孕周：${gestationalInfo.value.gestationalAge.display} ｜ 预产期：${gestationalInfo.value.eddFormatted || gestationalInfo.value.edd}`
})

const bmiInfo = computed(() => {
  if (!form.weight || !form.height) return null
  return obgynCalculators.calculateBMI(form.weight, form.height)
})

const weightGainInfo = computed(() => {
  if (!bmiInfo.value) return null
  return obgynCalculators.calculateWeightGain(parseFloat(bmiInfo.value.bmi))
})

const {
  uploadedImages,
  imageRecognitionEnabled,
  recognizingCount,
  queuedCount,
  hasPendingImages,
  queueImageFile,
  removeImage: removeImageFromQueue
} = useImageRecognitionQueue({
  onStatusChange(image, status, payload = {}) {
    if (status === 'success') {
      message.success('图片识别完成')
    } else if (status === 'error') {
      message.error(payload.error || image.error || '图片识别失败，请检查配置')
    }
  }
})

function sanitizeImages() {
  return (uploadedImages.value || []).map((item) => ({
    id: item.id,
    name: item.name,
    dataUrl: item.dataUrl,
    result: item.result,
    status: item.status,
    error: item.error,
    createdAt: item.createdAt,
    raw: item.status === 'queued' || item.status === 'recognizing' ? item.raw : ''
  }))
}

async function handleImageUpload(file) {
  if (!imageRecognitionEnabled.value) {
    message.warning('请先在设置中启用图像识别功能')
    return false
  }
  try {
    await queueImageFile(file)
    message.success(`已添加图片：${file.name}`)
  } catch (err) {
    console.error(err)
    message.error(err?.message || '读取图片失败，请重试')
  }
  return false
}

function removeImage(index) {
  const target = uploadedImages.value[index]
  if (!target) return
  if (target.status === 'recognizing') {
    message.warning('当前图片正在识别中，无法删除')
    return
  }
  removeImageFromQueue(index)
}

function openSettings() {
  const event = new CustomEvent('open-settings')
  window.dispatchEvent(event)
}

function openCalculators() {
  calculatorVisible.value = true
}

function onSubmit() {
  try {
    const trimmedName = (form.name || '').trim()
    if (!trimmedName) {
      message.warning('请输入患者姓名')
      return
    }
    if (!(form.currentProblem || '').trim()) {
      message.warning('请输入主诉')
      return
    }

    const calculatedFields = {}
    if (gestationalInfo.value) {
      calculatedFields.gestationalAge = gestationalInfo.value.gestationalAge
      calculatedFields.edd = gestationalInfo.value.edd
      calculatedFields.trimester = gestationalInfo.value.trimester
    }
    if (bmiInfo.value) {
      calculatedFields.bmi = bmiInfo.value
    }
    if (weightGainInfo.value) {
      calculatedFields.recommendedWeightGain = weightGainInfo.value
    }

    const aiHints = {}
    if (form.symptoms?.length) {
      aiHints.symptoms = [...form.symptoms]
    }
    if (gestationalInfo.value) {
      aiHints.gestationalAge = gestationalInfo.value.gestationalAge
    }

    store.setPatientCase({
      name: trimmedName,
      gender: form.gender,
      age: form.age,
      weight: form.weight,
      height: form.height,
      lmp: form.lmp,
      menstrualCycle: form.menstrualCycle,
      menarcheAge: form.menarcheAge,
      menopausalStatus: form.menopausalStatus,
      menstrualHistory: form.menstrualHistory,
      marriageHistory: form.marriageHistory,
      pastHistory: form.pastHistory,
      currentProblem: form.currentProblem,
      symptoms: [...form.symptoms],
      historyOfPresentIllness: form.historyOfPresentIllness,
      fertilityDesire: form.fertilityDesire,
      gravida: form.gravida,
      para: form.para,
      abortion: form.abortion,
      temperature: form.temperature,
      bloodPressure: form.bloodPressure,
      pulse: form.pulse,
      gynecologicalExam: form.gynecologicalExam,
      labs: { ...form.labs },
      imaging: { ...form.imaging },
      pathology: { ...form.pathology },
      preliminaryDiagnosis: form.preliminaryDiagnosis,
      treatmentGiven: form.treatmentGiven,
      consultationPurpose: [...form.consultationPurpose],
      historyNotes: form.historyNotes,
      imageRecognitions: sanitizeImages(),
      calculatedFields,
      aiHints
    })
    store.startConsultation()
  } catch (e) {
    message.error(e.message || String(e))
  }
}
</script>

<style scoped>
.case-input-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.case-form {
  padding-right: 4px;
}

.case-input-card :deep(.ant-card-body) {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.case-input-card :deep(.ant-card-body::-webkit-scrollbar) {
  width: 6px;
}

.info-alert {
  margin-bottom: 12px;
}

.image-upload {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.image-status {
  font-size: 12px;
}

.image-status.primary {
  color: #1890ff;
}

.image-status.warning {
  color: #faad14;
}

.image-preview-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.image-preview-item {
  display: flex;
  gap: 12px;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  padding: 8px;
}

.preview-thumb {
  width: 120px;
  height: 120px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fafafa;
}

.preview-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-preview {
  font-size: 12px;
  color: #8c8c8c;
}

.preview-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 600;
  font-size: 12px;
  color: #595959;
}

.preview-status {
  font-size: 12px;
}

.preview-status.info {
  color: #1890ff;
}

.preview-status.warning {
  color: #faad14;
}

.preview-result .preview-text {
  max-height: 100px;
  overflow-y: auto;
  font-size: 12px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }
  .form-actions .ant-btn {
    width: 100%;
  }
}
</style>
