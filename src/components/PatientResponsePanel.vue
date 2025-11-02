<template>
  <a-card
    title="患者补充信息"
    size="small"
    :bordered="false"
    class="patient-response-panel"
  >
    <template v-if="keyQuestions.length > 0">
      <div class="questions-prompt">
        <a-alert
          type="info"
          show-icon
          message="医生提出了以下问题，请您详细回答以帮助诊断："
          :closable="false"
          style="margin-bottom: 12px;"
        />
      </div>

      <div class="questions-list">
        <div
          v-for="(q, index) in keyQuestions"
          :key="index"
          class="question-item"
        >
          <div class="question-header">
            <span class="question-number">问题 {{ index + 1 }}</span>
            <span class="question-doctor">{{ q.doctorName || '医生' }}</span>
          </div>
          <div class="question-text">{{ q.content }}</div>
          <a-textarea
            v-model:value="responses[index]"
            :placeholder="`请回答问题 ${index + 1}...`"
            :rows="3"
            style="margin-top: 8px;"
          />
        </div>
      </div>

      <div class="action-buttons">
        <a-space>
          <a-button
            type="primary"
            :disabled="!hasAnyResponse"
            @click="submitResponses"
          >
            提交补充信息
          </a-button>
          <a-button @click="clearResponses">清空回答</a-button>
        </a-space>
      </div>
    </template>

    <template v-else>
      <a-empty
        description="暂无需要补充的问题"
        style="padding: 40px 20px;"
      >
        <template #image>
          <div style="font-size: 64px; opacity: 0.25;">❓</div>
        </template>
      </a-empty>
    </template>
  </a-card>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { message } from 'ant-design-vue'
import { useConsultStore } from '../store'

const emit = defineEmits(['submitted'])

const store = useConsultStore()

const responses = ref([])

const keyQuestions = computed(() => {
  return (store.discussionHistory || [])
    .filter((msg) => msg.type === 'question')
    .slice(-12)
})

const hasAnyResponse = computed(() => {
  return responses.value.some((r) => r && r.trim())
})

watch(keyQuestions, (questions) => {
  if (questions.length !== responses.value.length) {
    responses.value = new Array(questions.length).fill('')
  }
}, { immediate: true })

function submitResponses() {
  const validResponses = responses.value
    .map((response, index) => ({
      index,
      question: keyQuestions.value[index],
      response
    }))
    .filter((item) => item.response && item.response.trim())

  if (validResponses.length === 0) {
    message.warning('请至少回答一个问题')
    return
  }

  const responseText = validResponses
    .map((item) => `问题${item.index + 1}的回答：${item.response.trim()}`)
    .join('\n\n')

  store.addPatientMessage(`患者补充信息：\n\n${responseText}`)

  message.success(`已提交 ${validResponses.length} 条补充信息`)

  emit('submitted', validResponses.length)

  clearResponses()
}

function clearResponses() {
  responses.value = responses.value.map(() => '')
}
</script>

<style scoped>
.patient-response-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.patient-response-panel :deep(.ant-card-body) {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px;
}

.questions-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 12px;
}

.question-item {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 12px;
}

.question-item:last-child {
  margin-bottom: 0;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.question-number {
  font-weight: 600;
  color: #1890ff;
  font-size: 14px;
}

.question-doctor {
  font-size: 12px;
  color: #8c8c8c;
}

.question-text {
  color: #262626;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 4px;
}

.action-buttons {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>
