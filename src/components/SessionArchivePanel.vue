<template>
  <div class="session-archive-panel">
    <a-card title="会话归档管理" :bordered="false">
      <template #extra>
        <a-space>
          <a-button size="small" @click="showImportModal">导入会话</a-button>
          <a-button size="small" type="primary" @click="archiveCurrentSession" :disabled="!canArchive">
            归档当前会话
          </a-button>
        </a-space>
      </template>

      <div class="archive-stats">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-statistic title="总会话数" :value="archiveStore.statistics.total" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="已完成" :value="archiveStore.statistics.finished" :value-style="{ color: '#52c41a' }" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="进行中" :value="archiveStore.statistics.inProgress" :value-style="{ color: '#1890ff' }" />
          </a-col>
          <a-col :span="6">
            <a-statistic title="平均轮次" :value="archiveStore.statistics.averageRounds" :precision="1" />
          </a-col>
        </a-row>
      </div>

      <a-divider />

      <div class="archive-settings">
        <a-space>
          <a-switch
            v-model:checked="archiveStore.autoArchiveEnabled"
            @change="handleAutoArchiveChange"
          />
          <span>自动归档已完成的会话</span>
        </a-space>
        <a-space style="margin-left: 20px;">
          <a-switch
            v-model:checked="archiveStore.compressionEnabled"
            @change="handleCompressionChange"
          />
          <span>启用消息压缩（适用于超长会话）</span>
        </a-space>
      </div>

      <a-divider />

      <div class="session-list">
        <a-input-search
          v-model:value="searchText"
          placeholder="搜索会话名称或患者姓名..."
          style="margin-bottom: 16px;"
        />

        <a-empty v-if="filteredSessions.length === 0" description="暂无归档会话" />

        <a-list v-else :data-source="filteredSessions" :pagination="{ pageSize: 10 }">
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-dropdown>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="restore" @click="handleRestore(item.id)">
                        <template #icon><span>🔄</span></template>
                        恢复到当前
                      </a-menu-item>
                      <a-menu-item key="export-json" @click="handleExport(item.id, 'json')">
                        <template #icon><span>📄</span></template>
                        导出为 JSON
                      </a-menu-item>
                      <a-menu-item key="export-md" @click="handleExport(item.id, 'markdown')">
                        <template #icon><span>📝</span></template>
                        导出为 Markdown
                      </a-menu-item>
                      <a-menu-item key="export-html" @click="handleExport(item.id, 'html')">
                        <template #icon><span>🌐</span></template>
                        导出为 HTML
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="compare" @click="selectForComparison(item.id)">
                        <template #icon><span>⚖️</span></template>
                        选择对比
                      </a-menu-item>
                      <a-menu-divider />
                      <a-menu-item key="delete" @click="handleDelete(item.id)" danger>
                        <template #icon><span>🗑️</span></template>
                        删除
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <a-button size="small">操作 <span class="dropdown-arrow">▼</span></a-button>
                </a-dropdown>
              </template>

              <a-list-item-meta>
                <template #title>
                  <a-space>
                    <span :style="{ fontWeight: 600 }">{{ item.consultationName }}</span>
                    <a-tag v-if="item.metadata?.hasFinished" color="success">已完成</a-tag>
                    <a-tag v-else color="processing">进行中</a-tag>
                    <a-tag v-if="item.metadata?.compressed" color="orange">已压缩</a-tag>
                  </a-space>
                </template>
                <template #description>
                  <div>
                    <div>
                      <strong>患者</strong>: {{ item.patientCase?.name || '未知' }}
                      <span v-if="item.patientCase?.age"> · {{ item.patientCase.age }}岁</span>
                      <span v-if="item.patientCase?.gender"> · {{ getGenderText(item.patientCase.gender) }}</span>
                    </div>
                    <div style="margin-top: 4px;">
                      <strong>归档时间</strong>: {{ formatDate(item.timestamp) }}
                      · 轮次: {{ item.metadata?.totalRounds || 0 }}
                      · 消息数: {{ item.metadata?.totalMessages || 0 }}
                      · 医生数: {{ item.doctors?.length || 0 }}
                    </div>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </template>
        </a-list>
      </div>

      <a-divider v-if="selectedForCompare.length === 2" />

      <div v-if="selectedForCompare.length === 2" class="comparison-section">
        <a-card title="会话对比" size="small">
          <template #extra>
            <a-button size="small" @click="clearComparison">清除对比</a-button>
          </template>
          <div v-if="comparisonResult">
            <a-row :gutter="16">
              <a-col :span="12">
                <h4>{{ comparisonResult.session1.name }}</h4>
                <p>归档时间: {{ formatDate(comparisonResult.session1.timestamp) }}</p>
                <p>轮次: {{ comparisonResult.session1.metadata?.totalRounds || 0 }}</p>
                <p>消息数: {{ comparisonResult.session1.metadata?.totalMessages || 0 }}</p>
              </a-col>
              <a-col :span="12">
                <h4>{{ comparisonResult.session2.name }}</h4>
                <p>归档时间: {{ formatDate(comparisonResult.session2.timestamp) }}</p>
                <p>轮次: {{ comparisonResult.session2.metadata?.totalRounds || 0 }}</p>
                <p>消息数: {{ comparisonResult.session2.metadata?.totalMessages || 0 }}</p>
              </a-col>
            </a-row>
            <a-divider />
            <h4>对比结果</h4>
            <p>轮次差异: {{ comparisonResult.comparison.roundsDiff > 0 ? '+' : '' }}{{ comparisonResult.comparison.roundsDiff }}</p>
            <p>消息数差异: {{ comparisonResult.comparison.messagesDiff > 0 ? '+' : '' }}{{ comparisonResult.comparison.messagesDiff }}</p>
            <p>同一患者: {{ comparisonResult.comparison.samePatient ? '是' : '否' }}</p>
            <p>医生人数相同: {{ comparisonResult.comparison.sameDoctorCount ? '是' : '否' }}</p>
          </div>
        </a-card>
      </div>
    </a-card>

    <!-- Import Modal -->
    <a-modal
      v-model:open="importModalVisible"
      title="导入会话"
      @ok="handleImport"
      @cancel="importModalVisible = false"
    >
      <a-textarea
        v-model:value="importData"
        placeholder="粘贴 JSON 格式的会话数据..."
        :rows="10"
      />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { message, Modal } from 'ant-design-vue'
import { useSessionArchiveStore } from '../store/sessionArchive'
import { useConsultStore } from '../store'

const archiveStore = useSessionArchiveStore()
const consultStore = useConsultStore()

const searchText = ref('')
const importModalVisible = ref(false)
const importData = ref('')
const selectedForCompare = ref([])
const comparisonResult = ref(null)

const canArchive = computed(() => {
  return consultStore.patientCase?.name && consultStore.discussionHistory?.length > 0
})

const filteredSessions = computed(() => {
  if (!searchText.value) {
    return archiveStore.sortedSessions
  }
  const keyword = searchText.value.toLowerCase()
  return archiveStore.sortedSessions.filter(session => {
    const name = (session.consultationName || '').toLowerCase()
    const patientName = (session.patientCase?.name || '').toLowerCase()
    return name.includes(keyword) || patientName.includes(keyword)
  })
})

function formatDate(timestamp) {
  if (!timestamp) return '未知'
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function getGenderText(gender) {
  const map = { male: '男', female: '女', other: '其他' }
  return map[gender] || gender
}

function archiveCurrentSession() {
  try {
    const id = archiveStore.archiveCurrentSession(consultStore)
    message.success('当前会话已归档')
  } catch (e) {
    message.error(`归档失败: ${e.message}`)
  }
}

function handleRestore(sessionId) {
  Modal.confirm({
    title: '确认恢复会话',
    content: '恢复此会话将覆盖当前的会诊数据，是否继续？',
    onOk: () => {
      try {
        archiveStore.restoreSession(sessionId, consultStore)
        message.success('会话已恢复')
      } catch (e) {
        message.error(`恢复失败: ${e.message}`)
      }
    }
  })
}

function handleExport(sessionId, format) {
  try {
    archiveStore.downloadSession(sessionId, format)
    message.success(`已导出为 ${format.toUpperCase()} 格式`)
  } catch (e) {
    message.error(`导出失败: ${e.message}`)
  }
}

function handleDelete(sessionId) {
  Modal.confirm({
    title: '确认删除',
    content: '删除后无法恢复，是否继续？',
    okType: 'danger',
    onOk: () => {
      try {
        archiveStore.deleteSession(sessionId)
        message.success('已删除')
        selectedForCompare.value = selectedForCompare.value.filter(id => id !== sessionId)
        if (selectedForCompare.value.length < 2) {
          comparisonResult.value = null
        }
      } catch (e) {
        message.error(`删除失败: ${e.message}`)
      }
    }
  })
}

function showImportModal() {
  importModalVisible.value = true
  importData.value = ''
}

function handleImport() {
  if (!importData.value.trim()) {
    message.warning('请输入要导入的数据')
    return
  }

  try {
    archiveStore.importSession(importData.value)
    message.success('会话导入成功')
    importModalVisible.value = false
    importData.value = ''
  } catch (e) {
    message.error(`导入失败: ${e.message}`)
  }
}

function selectForComparison(sessionId) {
  if (selectedForCompare.value.includes(sessionId)) {
    selectedForCompare.value = selectedForCompare.value.filter(id => id !== sessionId)
    message.info('已取消选择')
  } else if (selectedForCompare.value.length >= 2) {
    message.warning('最多只能选择两个会话进行对比')
  } else {
    selectedForCompare.value.push(sessionId)
    message.success(`已选择 ${selectedForCompare.value.length}/2 个会话`)
  }

  if (selectedForCompare.value.length === 2) {
    try {
      comparisonResult.value = archiveStore.compareSessions(
        selectedForCompare.value[0],
        selectedForCompare.value[1]
      )
    } catch (e) {
      message.error(`对比失败: ${e.message}`)
      comparisonResult.value = null
    }
  } else {
    comparisonResult.value = null
  }
}

function clearComparison() {
  selectedForCompare.value = []
  comparisonResult.value = null
  message.info('已清除对比')
}

function handleAutoArchiveChange(checked) {
  archiveStore.setAutoArchive(checked)
  message.success(checked ? '已启用自动归档' : '已禁用自动归档')
}

function handleCompressionChange(checked) {
  archiveStore.setCompression(checked)
  message.success(checked ? '已启用消息压缩' : '已禁用消息压缩')
}
</script>

<style scoped>
.session-archive-panel {
  height: 100%;
  overflow-y: auto;
}

.archive-stats {
  margin-bottom: 16px;
}

.archive-settings {
  display: flex;
  align-items: center;
  gap: 16px;
}

.session-list {
  margin-top: 16px;
}

.comparison-section {
  margin-top: 16px;
}

.dropdown-arrow {
  font-size: 10px;
  line-height: 1;
  margin-left: 4px;
}
</style>
