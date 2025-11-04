<template>
  <a-modal v-model:open="open" title="妇产科医学计算器" width="800px" :footer="null">
    <a-tabs v-model:activeKey="activeCalculator" type="card">
      <!-- 预产期计算 -->
      <a-tab-pane key="edd" tab="🤰 预产期">
        <a-form layout="vertical" style="padding: 16px;">
          <a-form-item label="末次月经 (LMP)">
            <a-date-picker 
              v-model:value="lmpDate" 
              @change="calculateEDD" 
              style="width: 100%"
              placeholder="请选择末次月经日期" 
            />
          </a-form-item>
          <a-alert v-if="eddResult" type="success" show-icon style="margin-top: 16px;">
            <template #message>
              <div class="calc-result">
                <p><strong>预产期：</strong>{{ eddResult.eddFormatted }}</p>
                <p><strong>当前孕周：</strong>{{ eddResult.gestationalAge.display }}</p>
                <p><strong>孕期阶段：</strong>{{ eddResult.trimester }}</p>
                <p style="font-size: 12px; color: #595959; margin-top: 8px;">
                  💡 预产期计算采用Naegele法则（末次月经+280天）
                </p>
              </div>
            </template>
          </a-alert>
        </a-form>
      </a-tab-pane>
      
      <!-- BMI计算 -->
      <a-tab-pane key="bmi" tab="📏 BMI">
        <a-form layout="vertical" style="padding: 16px;">
          <a-row :gutter="16">
            <a-col :span="12">
              <a-form-item label="体重 (kg)">
                <a-input-number v-model:value="weight" :min="1" :max="300" style="width: 100%" @change="calculateBMI" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="身高 (cm)">
                <a-input-number v-model:value="height" :min="50" :max="250" style="width: 100%" @change="calculateBMI" />
              </a-form-item>
            </a-col>
          </a-row>
          <a-alert v-if="bmiResult" :type="bmiResult.healthy ? 'success' : 'warning'" show-icon style="margin-top: 16px;">
            <template #message>
              <div class="calc-result">
                <p><strong>BMI：</strong>{{ bmiResult.bmi }}</p>
                <p><strong>分类：</strong>{{ bmiResult.category }}</p>
                <p style="font-size: 12px; color: #595959; margin-top: 8px;">
                  💡 正常范围：18.5-24
                </p>
              </div>
            </template>
          </a-alert>
          
          <!-- 孕期体重增长建议 -->
          <template v-if="bmiResult">
            <a-divider>孕期体重增长建议</a-divider>
            <a-alert v-if="weightGainResult" type="info" show-icon>
              <template #message>
                <div class="calc-result">
                  <p><strong>孕前体型：</strong>{{ weightGainResult.category }}</p>
                  <p><strong>建议孕期增重：</strong>{{ weightGainResult.min }}-{{ weightGainResult.max }} kg</p>
                  <p style="font-size: 12px; color: #595959; margin-top: 8px;">
                    💡 {{ weightGainResult.recommendation }}
                  </p>
                </div>
              </template>
            </a-alert>
          </template>
        </a-form>
      </a-tab-pane>
      
      <!-- Bishop评分 -->
      <a-tab-pane key="bishop" tab="🔍 Bishop评分">
        <a-form layout="vertical" style="padding: 16px;">
          <a-form-item label="宫颈扩张 (cm)">
            <a-radio-group v-model:value="bishopParams.cervixDilation" @change="calculateBishop">
              <a-radio :value="0">闭合 (0分)</a-radio>
              <a-radio :value="1">1-2cm (1分)</a-radio>
              <a-radio :value="2">3-4cm (2分)</a-radio>
              <a-radio :value="3">≥5cm (3分)</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="宫颈消退 (%)">
            <a-radio-group v-model:value="bishopParams.cervixEffacement" @change="calculateBishop">
              <a-radio :value="0">0-30% (0分)</a-radio>
              <a-radio :value="1">40-50% (1分)</a-radio>
              <a-radio :value="2">60-70% (2分)</a-radio>
              <a-radio :value="3">≥80% (3分)</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="先露位置">
            <a-radio-group v-model:value="bishopParams.cervixStation" @change="calculateBishop">
              <a-radio :value="0">-3 (0分)</a-radio>
              <a-radio :value="1">-2 (1分)</a-radio>
              <a-radio :value="2">-1/0 (2分)</a-radio>
              <a-radio :value="3">+1/+2 (3分)</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="宫颈硬度">
            <a-radio-group v-model:value="bishopParams.cervixConsistency" @change="calculateBishop">
              <a-radio :value="0">硬 (0分)</a-radio>
              <a-radio :value="1">中等 (1分)</a-radio>
              <a-radio :value="2">软 (2分)</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="宫颈位置">
            <a-radio-group v-model:value="bishopParams.cervixPosition" @change="calculateBishop">
              <a-radio :value="0">后位 (0分)</a-radio>
              <a-radio :value="1">中位 (1分)</a-radio>
              <a-radio :value="2">前位 (2分)</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-alert v-if="bishopResult" :type="bishopResult.total >= 6 ? 'success' : 'warning'" show-icon style="margin-top: 16px;">
            <template #message>
              <div class="calc-result">
                <p><strong>Bishop评分：</strong>{{ bishopResult.total }} 分</p>
                <p><strong>评估：</strong>{{ bishopResult.interpretation }}</p>
                <p><strong>建议：</strong>{{ bishopResult.recommendation }}</p>
              </div>
            </template>
          </a-alert>
        </a-form>
      </a-tab-pane>
      
      <!-- RMI -->
      <a-tab-pane key="rmi" tab="🎗️ 卵巢癌RMI">
        <a-form layout="vertical" style="padding: 16px;">
          <a-form-item label="CA125 (U/ml)">
            <a-input-number v-model:value="rmiParams.ca125" :min="0" style="width: 100%" @change="calculateRMI" />
          </a-form-item>
          <a-form-item label="超声评分">
            <a-radio-group v-model:value="rmiParams.ultrasoundScore" @change="calculateRMI">
              <a-space direction="vertical">
                <a-radio :value="0">0 - 无异常特征</a-radio>
                <a-radio :value="1">1 - 1个异常特征</a-radio>
                <a-radio :value="3">3 - 2-5个异常特征</a-radio>
              </a-space>
            </a-radio-group>
            <div style="font-size: 12px; color: #8c8c8c; margin-top: 8px;">
              超声异常特征：多房、实性、双侧、腹水、转移
            </div>
          </a-form-item>
          <a-form-item label="绝经状态">
            <a-radio-group v-model:value="rmiParams.menopausalStatus" @change="calculateRMI">
              <a-radio value="premenopausal">绝经前 (M=1)</a-radio>
              <a-radio value="postmenopausal">绝经后 (M=3)</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-alert v-if="rmiResult" :type="rmiResult.risk === '高风险' ? 'error' : rmiResult.risk === '中等风险' ? 'warning' : 'success'" show-icon style="margin-top: 16px;">
            <template #message>
              <div class="calc-result">
                <p><strong>RMI：</strong>{{ rmiResult.rmi }}</p>
                <p><strong>风险分层：</strong>{{ rmiResult.risk }}</p>
                <p><strong>建议：</strong>{{ rmiResult.recommendation }}</p>
                <p style="font-size: 12px; color: #595959; margin-top: 8px;">
                  💡 RMI = CA125 × 超声评分 × 绝经因子<br/>
                  <25：低风险；25-250：中等风险；≥250：高风险
                </p>
              </div>
            </template>
          </a-alert>
        </a-form>
      </a-tab-pane>
      
      <!-- PCOS诊断 -->
      <a-tab-pane key="pcos" tab="🧬 PCOS诊断">
        <a-form layout="vertical" style="padding: 16px;">
          <a-alert type="info" show-icon style="margin-bottom: 16px;">
            <template #message>
              鹿特丹标准：满足以下3项中的2项即可诊断PCOS
            </template>
          </a-alert>
          <a-form-item label="1. 稀发排卵或无排卵">
            <a-radio-group v-model:value="pcosParams.irregularMenstruation" @change="calculatePCOS">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="2. 高雄激素的临床表现和/或高雄激素血症">
            <a-radio-group v-model:value="pcosParams.hyperandrogenism" @change="calculatePCOS">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
            <div style="font-size: 12px; color: #8c8c8c; margin-top: 4px;">
              临床表现：多毛、痤疮、雄激素性脱发<br/>
              高雄激素血症：T升高
            </div>
          </a-form-item>
          <a-form-item label="3. 卵巢多囊性改变（超声）">
            <a-radio-group v-model:value="pcosParams.polycysticOvaries" @change="calculatePCOS">
              <a-radio :value="true">是</a-radio>
              <a-radio :value="false">否</a-radio>
            </a-radio-group>
            <div style="font-size: 12px; color: #8c8c8c; margin-top: 4px;">
              单侧卵巢≥12个直径2-9mm卵泡 或 卵巢体积≥10ml
            </div>
          </a-form-item>
          <a-alert v-if="pcosResult" :type="pcosResult.meetsCriteria ? 'warning' : 'info'" show-icon style="margin-top: 16px;">
            <template #message>
              <div class="calc-result">
                <p><strong>满足标准数：</strong>{{ pcosResult.criteriaCount }}/3</p>
                <p><strong>诊断：</strong>{{ pcosResult.diagnosis }}</p>
                <template v-if="pcosResult.meetsCriteria">
                  <p><strong>满足标准：</strong></p>
                  <ul>
                    <li v-for="(item, index) in pcosResult.metCriteria" :key="index">{{ item }}</li>
                  </ul>
                </template>
                <p style="margin-top: 8px;"><strong>下一步：</strong>{{ pcosResult.nextSteps }}</p>
              </div>
            </template>
          </a-alert>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { obgynCalculators } from '../utils/medicalCalculators'

const props = defineProps({
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['update:open'])

const open = computed({
  get: () => props.open,
  set: (val) => emit('update:open', val)
})

const activeCalculator = ref('edd')

// 预产期计算
const lmpDate = ref(null)
const eddResult = ref(null)

function calculateEDD() {
  if (lmpDate.value) {
    eddResult.value = obgynCalculators.calculateEDD(lmpDate.value)
  }
}

// BMI计算
const weight = ref(null)
const height = ref(null)
const bmiResult = ref(null)
const weightGainResult = ref(null)

function calculateBMI() {
  if (weight.value && height.value) {
    bmiResult.value = obgynCalculators.calculateBMI(weight.value, height.value)
    if (bmiResult.value) {
      weightGainResult.value = obgynCalculators.calculateWeightGain(bmiResult.value.bmi)
    }
  }
}

// Bishop评分
const bishopParams = ref({
  cervixDilation: 0,
  cervixEffacement: 0,
  cervixStation: 0,
  cervixConsistency: 0,
  cervixPosition: 0
})
const bishopResult = ref(null)

function calculateBishop() {
  bishopResult.value = obgynCalculators.bishopScore(bishopParams.value)
}

// RMI
const rmiParams = ref({
  ca125: null,
  ultrasoundScore: 0,
  menopausalStatus: 'premenopausal'
})
const rmiResult = ref(null)

function calculateRMI() {
  if (rmiParams.value.ca125 !== null) {
    rmiResult.value = obgynCalculators.calculateRMI(
      rmiParams.value.ca125,
      rmiParams.value.ultrasoundScore,
      rmiParams.value.menopausalStatus
    )
  }
}

// PCOS诊断
const pcosParams = ref({
  irregularMenstruation: false,
  hyperandrogenism: false,
  polycysticOvaries: false
})
const pcosResult = ref(null)

function calculatePCOS() {
  pcosResult.value = obgynCalculators.diagnosePCOS(
    pcosParams.value.irregularMenstruation,
    pcosParams.value.hyperandrogenism,
    pcosParams.value.polycysticOvaries
  )
}
</script>

<style scoped>
.calc-result p {
  margin-bottom: 8px;
}
.calc-result p:last-child {
  margin-bottom: 0;
}
.calc-result ul {
  margin: 8px 0 0 20px;
  padding: 0;
}
.calc-result ul li {
  margin-bottom: 4px;
}
</style>
