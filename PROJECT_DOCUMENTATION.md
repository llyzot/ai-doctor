# AI 妇产科多专家会诊系统 - 项目技术文档

## 📋 文档目录

- [项目概述](#项目概述)
- [技术架构](#技术架构)
- [项目结构](#项目结构)
- [核心功能模块](#核心功能模块)
- [状态管理](#状态管理)
- [AI 模型集成](#ai-模型集成)
- [业务流程](#业务流程)
- [数据持久化](#数据持久化)
- [开发指南](#开发指南)
- [部署说明](#部署说明)
- [扩展开发](#扩展开发)

---

## 项目概述

### 项目简介

AI 妇产科多专家会诊系统是一个面向妇产科领域的智能会诊平台，通过集成多个大语言模型（LLM）扮演不同亚专科的妇产科医生，实现多专家协同诊断。系统采用纯前端架构，无需后端服务器，直接在浏览器中调用各大 AI 服务商的 API。

**在线演示**: https://dragonchencl.github.io/ai-doctor/

### 核心特性

- 🏥 **妇产科多专家协作**: 支持添加多个由不同 LLM 驱动的妇产科医生参与会诊，涵盖高危妊娠、妇科肿瘤、生殖内分泌、妇科微创、产科急症等亚专科
- 🤖 **多模型支持**: 集成 OpenAI、Anthropic Claude、Google Gemini、硅基流动、魔搭社区等主流 AI 模型
- 💬 **实时讨论**: 医生轮流发言，支持打字机效果展示
- 🗳️ **智能评估**: 医生互相评估彼此的诊断，自动淘汰不准确的意见
- 📋 **妇产科专病采集**: 月经史、婚育史、既往妇科病史等专科化病例采集
- 🖼️ **妇产科影像识别**: 支持B超、阴超、宫腔镜等影像资料的AI识别与分析
- 📊 **状态监控**: 实时显示会诊阶段、轮次、医生状态等信息
- 💾 **会话管理**: 自动保存会诊记录，支持多个问诊会话切换
- ⚠️ **急症风险识别**: 特别关注异位妊娠、胎盘早剥、产后出血等产科急症
- 💊 **妊娠期用药安全**: 治疗建议强调孕期与哺乳期用药安全
- 🔗 **关联问诊**: 支持关联历史问诊记录，提供更全面的诊断参考

### 技术亮点

1. **无服务器架构**: 完全在浏览器端运行，降低部署成本
2. **多 AI 模型并行**: 同时调用不同的 AI 模型进行会诊
3. **妇产科专病提示词体系**: 针对不同亚专科构建专属提示词与诊断流程
4. **智能投票机制**: 通过 AI 互评实现诊断意见的优胜劣汰
5. **隐私保护**: 数据仅存储在本地浏览器，不上传到任何服务器

---

## 技术架构

### 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **Vue.js** | ^3.4.21 | 前端框架，提供响应式 UI |
| **Pinia** | ^2.1.7 | 状态管理库，管理应用状态 |
| **Ant Design Vue** | ^4.2.1 | UI 组件库，提供企业级组件 |
| **Vite** | ^5.2.8 | 构建工具，快速开发和构建 |
| **Axios** | ^1.6.7 | HTTP 客户端，调用 AI API |
| **Marked** | ^9.1.6 | Markdown 渲染，展示 AI 回复 |
| **html-to-image** | ^1.11.11 | 图片导出功能 |
| **vuedraggable** | ^4.1.0 | 拖拽排序功能 |

### 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        浏览器环境                             │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐        ┌──────────────┐                   │
│  │   Vue 3 App  │───────▶│  Ant Design  │                   │
│  │  (组件层)     │        │     UI       │                   │
│  └──────┬───────┘        └──────────────┘                   │
│         │                                                     │
│         ▼                                                     │
│  ┌──────────────────────────────────────┐                   │
│  │        Pinia Store (状态管理)         │                   │
│  ├───────────────┬──────────────────────┤                   │
│  │ consult store │ global   │ sessions  │                   │
│  │  (会诊流程)   │  (全局)  │  (会话)   │                   │
│  └───────┬───────┴──────────┴───────────┘                   │
│          │                                                    │
│          ▼                                                    │
│  ┌──────────────────────────────────────┐                   │
│  │         API 调用层                    │                   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐ │                   │
│  │  │callAI  │  │models  │  │http    │ │                   │
│  │  └────────┘  └────────┘  └────────┘ │                   │
│  └──────────────┬───────────────────────┘                   │
│                 │                                             │
│                 ▼                                             │
│  ┌──────────────────────────────────────┐                   │
│  │       localStorage (数据持久化)       │                   │
│  └──────────────────────────────────────┘                   │
│                                                               │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS API 调用
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                   第三方 AI 服务商                            │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   OpenAI     │  Anthropic   │   Gemini     │   其他国内厂商  │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

### 数据流向

```
用户输入病例
    │
    ▼
创建/更新 Store 状态
    │
    ▼
开始会诊流程 ──┐
    │          │
    ▼          │
医生轮流发言   │
    │          │
    ├─ 调用 AI API
    │          │
    ▼          │
显示医生回复   │
    │          │
    ▼          │
评估投票阶段   │
    │          │
    ▼          │
淘汰医生      │
    │          │
    └──────────┘ (循环直到结束条件)
    │
    ▼
生成最终诊断
    │
    ▼
保存到 localStorage
```

---

## 项目结构

### 目录树

```
ai-medical-consultation-panel/
├── public/                          # 静态资源
├── src/
│   ├── api/                         # API 调用模块
│   │   ├── callAI.js                # AI 模型调用封装 (核心)
│   │   ├── http.js                  # HTTP 代理配置
│   │   ├── imageRecognition.js      # 图像识别 API
│   │   └── models.js                # 模型列表获取
│   │
│   ├── assets/                      # 静态资源
│   │   └── logo.svg                 # Logo 图标
│   │
│   ├── components/                  # Vue 组件
│   │   ├── CaseInputForm.vue        # 病例输入表单
│   │   ├── ChatDisplay.vue          # 聊天记录显示
│   │   ├── ConsultationSettingsModal.vue  # 问诊设置弹窗
│   │   ├── DiscussionPanel.vue      # 讨论面板 (核心组件)
│   │   ├── DoctorList.vue           # 医生列表
│   │   ├── ExpandableText.vue       # 可展开文本组件
│   │   ├── GlobalSettingsModal.vue  # 全局设置弹窗 (核心)
│   │   ├── SessionListDrawer.vue    # 会话列表抽屉
│   │   ├── StatusPanel.vue          # 状态面板 (核心)
│   │   ├── VoteTally.vue            # 投票统计
│   │   └── VotingControls.vue       # 投票控制
│   │
│   ├── composables/                 # 组合式函数
│   │   └── useImageRecognitionQueue.js  # 图像识别队列管理
│   │
│   ├── store/                       # Pinia 状态管理
│   │   ├── index.js                 # 会诊流程状态 (核心 Store)
│   │   ├── global.js                # 全局配置状态
│   │   └── sessions.js              # 会话管理状态
│   │
│   ├── utils/                       # 工具函数
│   │   └── prompt.js                # 提示词构建 (核心)
│   │
│   ├── App.vue                      # 根组件
│   └── main.js                      # 应用入口
│
├── index.html                       # HTML 模板
├── vite.config.js                   # Vite 配置
├── package.json                     # 项目配置
├── .env.example                     # 环境变量示例
├── .gitignore                       # Git 忽略配置
├── README.md                        # 用户文档
├── README.zh.md                     # 中文文档
└── PROJECT_DOCUMENTATION.md         # 项目技术文档 (本文档)
```

### 核心文件说明

#### 1. **src/store/index.js** (会诊流程核心)

管理整个会诊流程的状态，包括：
- 病例信息 (`patientCase`)
- 医生列表 (`doctors`)
- 工作流状态 (`workflow`)
- 对话历史 (`messages`)
- 投票结果 (`voteTally`)

主要 Actions:
- `startConsultation()`: 启动会诊
- `runDiscussion()`: 执行讨论轮次
- `requestVote()`: 请求投票
- `processFinalSummary()`: 生成最终总结

#### 2. **src/api/callAI.js** (AI 调用核心)

封装了对不同 AI 供应商的 API 调用：
- `callOpenAI()`: OpenAI 规范调用
- `callAnthropic()`: Anthropic Claude 调用
- `callGemini()`: Google Gemini 调用
- `callSiliconFlow()`: 硅基流动调用
- `callModelScope()`: 魔搭社区调用

#### 3. **src/utils/prompt.js** (提示词构建)

构建发送给 AI 的提示词：
- `buildFullPrompt()`: 构建医生发言提示词
- `buildVotePrompt()`: 构建投票评估提示词
- `buildFinalSummaryPrompt()`: 构建最终总结提示词
- `formatHistoryForProvider()`: 格式化对话历史

#### 4. **src/components/GlobalSettingsModal.vue** (全局配置)

管理全局配置的核心 UI 组件：
- 医生配置管理 (添加/编辑/删除医生)
- 全局系统提示词
- 最终总结提示词
- 发言顺序设置
- 图像识别配置
- 预设提示词管理

#### 5. **src/components/DiscussionPanel.vue** (讨论面板)

显示会诊讨论的主要 UI 组件：
- 病例输入表单
- 对话历史展示
- 打字机效果
- 最终答案展示

---

## 核心功能模块

### 1. 会诊流程管理

**文件**: `src/store/index.js`

#### 工作流阶段 (Phase)

```javascript
phase: 'setup' | 'discussing' | 'voting' | 'summary' | 'finished'
```

- **setup**: 初始化阶段，用户输入病例信息
- **discussing**: 讨论阶段，医生轮流发言
- **voting**: 投票阶段，医生互相评估
- **summary**: 总结阶段，生成最终诊断
- **finished**: 完成阶段，显示最终结果

#### 会诊启动流程

```javascript
startConsultation() {
  // 1. 验证输入
  if (!this.patientCase.name || !this.patientCase.currentProblem) {
    throw new Error('必填项缺失')
  }
  
  // 2. 初始化医生状态
  this.doctors.forEach(d => {
    d.status = 'active'
    d.votes = 0
  })
  
  // 3. 设置工作流
  this.workflow.phase = 'discussing'
  this.workflow.currentRound = 1
  
  // 4. 开始讨论
  this.runDiscussion()
}
```

#### 讨论轮次流程

```javascript
async runDiscussion() {
  // 1. 确定发言顺序
  const queue = this.settings.turnOrder === 'random' 
    ? shuffle(activeDoctors) 
    : activeDoctors
  
  // 2. 医生依次发言
  for (const doctor of queue) {
    const prompt = buildFullPrompt(doctor, patientCase, messages)
    const reply = await callAI(doctor, prompt, history)
    
    this.messages.push({
      role: 'doctor',
      doctorId: doctor.id,
      content: reply
    })
  }
  
  // 3. 进入投票阶段
  this.workflow.phase = 'voting'
  this.requestVote()
}
```

### 2. 投票评估机制

**文件**: `src/store/index.js` - `requestVote()` action

#### 投票流程

```javascript
async requestVote() {
  const votes = {}
  
  // 1. 每位医生进行评估
  for (const doctor of activeDoctors) {
    const votePrompt = buildVotePrompt(doctor, messages, activeDoctors)
    const response = await callAI(doctor, votePrompt, [])
    
    // 2. 解析投票结果
    const targetName = parseVoteResponse(response)
    if (targetName) {
      votes[targetName] = (votes[targetName] || 0) + 1
    }
  }
  
  // 3. 统计并淘汰
  const maxVotes = Math.max(...Object.values(votes))
  if (maxVotes > 0) {
    const eliminated = findDoctorWithVotes(maxVotes)
    eliminated.status = 'eliminated'
  }
  
  // 4. 判断是否继续
  if (activeDoctors.length === 1) {
    this.processFinalSummary()
  } else {
    this.workflow.currentRound++
    this.runDiscussion()
  }
}
```

#### 投票提示词示例

```javascript
function buildVotePrompt(doctor, messages, activeDoctors) {
  return {
    system: "你是医生评审委员，需要评估其他医生的诊断质量",
    user: `
请评估本轮讨论中的所有医生发言，选择一位你认为"不太准确"的医生。

参与医生: ${activeDoctors.map(d => d.name).join(', ')}

本轮发言:
${formatMessages(messages)}

请直接输出你选择的医生名字，例如: Dr. GPT-4
    `
  }
}
```

### 3. 图像识别功能

**文件**: 
- `src/api/imageRecognition.js` - API 调用
- `src/composables/useImageRecognitionQueue.js` - 队列管理
- `src/store/global.js` - 配置管理

#### 图像识别流程

```javascript
// 1. 用户上传图片
const file = event.target.files[0]
const dataUrl = await readFileAsDataUrl(file)

// 2. 添加到识别队列
const recognition = {
  id: generateId(),
  name: file.name,
  dataUrl: dataUrl,
  status: 'queued'
}

// 3. 调用 AI 识别 API
const result = await recognizeImage(dataUrl, {
  provider: config.provider,
  model: config.model,
  apiKey: config.apiKey,
  prompt: config.prompt
})

// 4. 更新结果
recognition.status = 'success'
recognition.result = result
```

#### 支持的识别供应商

- **硅基流动**: `Pro/Qwen/Qwen2-VL-72B-Instruct` (默认)
- **OpenAI**: `gpt-4o`, `gpt-4o-mini` (支持 vision)
- **其他兼容 OpenAI 格式的供应商**

### 4. 关联问诊功能

**文件**: `src/store/index.js` - `linkedConsultations`

#### 关联问诊用途

- 提供历史诊断参考
- 追踪患者病情发展
- 辅助医生做出更准确的诊断

#### 数据结构

```javascript
{
  linkedConsultations: [
    {
      id: 'session-123',
      sourceId: 'session-123',
      consultationName: '2024-01-01 感冒问诊',
      patientName: '张三',
      patientGender: '男',
      patientAge: 35,
      pastHistory: '高血压病史',
      currentProblem: '发热、咳嗽',
      imageRecognitionResult: '...',
      finalSummary: '...',
      finishedAt: '2024-01-01T10:00:00.000Z'
    }
  ]
}
```

### 5. 会话管理

**文件**: `src/store/sessions.js`

#### 会话列表功能

- 自动保存每次会诊
- 支持切换历史会话
- 删除不需要的会话
- 复制会话创建新问诊

#### 会话数据结构

```javascript
{
  id: 'session-uuid',
  name: '自动生成或用户命名',
  createdAt: 1234567890000,
  updatedAt: 1234567890000,
  snapshot: {
    consultationName: '...',
    patientCase: {...},
    doctors: [...],
    messages: [...],
    workflow: {...},
    // ... 其他状态
  }
}
```

---

## 状态管理

### Store 架构

系统使用 Pinia 管理三个独立的 Store：

```javascript
// 1. consult store - 会诊流程状态
useConsultStore()

// 2. global store - 全局配置
useGlobalStore()

// 3. sessions store - 会话管理
useSessionsStore()
```

### 1. Consult Store (src/store/index.js)

#### State 结构

```javascript
{
  // 问诊名称
  consultationName: '',
  
  // 全局设置
  settings: {
    globalSystemPrompt: '...',      // 全局系统提示词
    summaryPrompt: '...',            // 最终总结提示词
    turnOrder: 'random',             // 发言顺序: random | sequential
    maxRoundsWithoutElimination: 3   // 最大无淘汰轮数
  },
  
  // 参与问诊的医生
  doctors: [
    {
      id: 'doc-1',
      name: 'Dr. GPT-4',
      provider: 'openai',
      model: 'gpt-4o',
      apiKey: '...',
      baseUrl: '',
      customPrompt: '',
      status: 'active',               // active | eliminated | excluded
      votes: 0
    }
  ],
  
  // 病例信息
  patientCase: {
    name: '',                         // 患者姓名
    gender: '',                       // 性别
    age: null,                        // 年龄
    pastHistory: '',                  // 既往病史
    currentProblem: '',               // 当前问题
    imageRecognitionResult: '',       // 图像识别结果汇总
    imageRecognitions: []             // 图像识别详情
  },
  
  // 关联的历史问诊
  linkedConsultations: [],
  
  // 工作流状态
  workflow: {
    phase: 'setup',                   // setup | discussing | voting | summary | finished
    currentRound: 0,                  // 当前轮次
    roundsWithoutElimination: 0,      // 连续未淘汰轮数
    activeTurn: null,                 // 当前发言医生 ID
    turnQueue: [],                    // 发言队列
    isRunning: false,                 // 是否正在运行
    hasInitiatedVote: false,          // 是否已发起投票
    eliminatedInRound: null,          // 本轮淘汰的医生 ID
    summaryInProgress: false          // 是否正在生成总结
  },
  
  // 对话历史
  messages: [
    {
      type: 'case',                   // case | discussion | vote
      role: 'system',                 // system | user | doctor
      doctorId: null,                 // 医生 ID (如果是医生发言)
      content: '...',                 // 消息内容
      timestamp: 1234567890000,       // 时间戳
      roundNumber: 1,                 // 轮次
      eliminated: false               // 是否已被淘汰的医生
    }
  ],
  
  // 投票统计
  voteTally: {
    'Dr. GPT-4': 2,
    'Dr. Claude': 1
  },
  
  // 最终答案
  finalAnswer: null
}
```

#### 核心 Actions

| Action | 功能 | 参数 |
|--------|------|------|
| `startConsultation()` | 启动会诊 | 无 |
| `runDiscussion()` | 运行讨论轮次 | 无 |
| `requestVote()` | 发起投票 | 无 |
| `processFinalSummary()` | 生成最终总结 | 无 |
| `endConsultation()` | 结束会诊 | 无 |
| `resetAll()` | 重置所有状态 | 无 |
| `setConsultationName(name)` | 设置问诊名称 | name: string |
| `setPatientCase(data)` | 设置病例信息 | data: object |
| `setDoctors(list)` | 设置医生列表 | list: array |
| `setLinkedConsultations(list)` | 设置关联问诊 | list: array |

### 2. Global Store (src/store/global.js)

#### State 结构

```javascript
{
  // 全局医生配置 (不包含运行时状态)
  doctors: [
    {
      id: 'doc-1',
      name: 'Dr. GPT-4',
      provider: 'openai',
      model: 'gpt-4o-mini',
      apiKey: '',
      baseUrl: '',
      customPrompt: ''
    }
  ],
  
  // 图像识别配置
  imageRecognition: {
    enabled: false,                    // 是否启用
    provider: 'siliconflow',           // 供应商
    model: 'Pro/Qwen/Qwen2-VL-72B-Instruct',
    apiKey: '',
    baseUrl: '',
    prompt: '识别当前病灶相关的图片内容...',
    maxConcurrent: 1                   // 最大并发数
  },
  
  // 预设提示词
  presetPrompts: [
    {
      id: 'preset-1',
      name: '心血管内科医生',
      prompt: '你是一位资深的心血管内科专家医生...'
    }
  ]
}
```

#### 核心 Actions

| Action | 功能 | 参数 |
|--------|------|------|
| `setDoctors(list)` | 保存全局医生配置 | list: array |
| `setImageRecognition(config)` | 保存图像识别配置 | config: object |
| `setPresetPrompts(list)` | 保存预设提示词 | list: array |

### 3. Sessions Store (src/store/sessions.js)

#### State 结构

```javascript
{
  // 当前会话 ID
  currentId: null,
  
  // 所有会话列表
  sessions: [
    {
      id: 'session-uuid',
      name: '2024-01-01 张三问诊',
      createdAt: 1234567890000,
      updatedAt: 1234567890000,
      snapshot: {
        // 完整的 consult store state
      }
    }
  ]
}
```

#### 核心 Actions

| Action | 功能 | 参数 |
|--------|------|------|
| `init()` | 初始化会话列表 | 无 |
| `saveSnapshotFromConsult()` | 保存当前会诊快照 | 无 |
| `switchSession(id)` | 切换到指定会话 | id: string |
| `createNewSession()` | 创建新会话 | 无 |
| `deleteSession(id)` | 删除会话 | id: string |
| `renameSession(id, name)` | 重命名会话 | id: string, name: string |

---

## AI 模型集成

### 支持的 AI 供应商

系统支持 5 种 AI 供应商类型，可以通过配置接入任何兼容对应规范的服务：

#### 1. OpenAI 规范

**默认 Base URL**: `https://api.openai.com/v1`

**请求格式**:
```javascript
POST /v1/chat/completions
Headers: {
  "Authorization": "Bearer {apiKey}",
  "Content-Type": "application/json"
}
Body: {
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "..."},
    {"role": "user", "content": "..."}
  ],
  "temperature": 0.7
}
```

**推荐模型**:
- `gpt-4o` - 最新、最强大
- `gpt-4o-mini` - 更快、更经济
- `gpt-4-turbo` - 高性能

**兼容服务**:
- OpenAI 官方
- Azure OpenAI
- 各类国内代理服务
- 自部署的兼容服务 (如 FastChat)

#### 2. Anthropic 规范

**默认 Base URL**: `https://api.anthropic.com/v1`

**请求格式**:
```javascript
POST /v1/messages
Headers: {
  "x-api-key": "{apiKey}",
  "anthropic-version": "2023-06-01",
  "Content-Type": "application/json"
}
Body: {
  "model": "claude-3-5-sonnet-20241022",
  "system": "...",
  "messages": [...],
  "max_tokens": 1024
}
```

**推荐模型**:
- `claude-3-5-sonnet-20241022` - 最新旗舰
- `claude-3-opus-20240229` - 最强推理
- `claude-3-haiku-20240307` - 快速响应

#### 3. Gemini 规范

**默认 Base URL**: `https://generativelanguage.googleapis.com/v1beta`

**请求格式**:
```javascript
POST /v1beta/models/{model}:generateContent?key={apiKey}
Headers: {
  "Content-Type": "application/json"
}
Body: {
  "systemInstruction": {
    "role": "system",
    "parts": [{"text": "..."}]
  },
  "contents": [
    {
      "role": "user",
      "parts": [{"text": "..."}]
    }
  ]
}
```

**推荐模型**:
- `gemini-1.5-pro` - 旗舰模型
- `gemini-1.5-flash` - 快速模型

#### 4. 硅基流动

**默认 Base URL**: `https://api.siliconflow.cn/v1`

**请求格式**: 同 OpenAI 规范

**推荐模型**:
- `Qwen/Qwen2.5-7B-Instruct` - 通义千问
- `THUDM/glm-4-9b-chat` - 智谱 GLM
- `Pro/Qwen/Qwen2.5-72B-Instruct` - 高性能版

**特点**:
- 国内访问速度快
- 支持众多开源模型
- 价格低廉

**文档**: https://docs.siliconflow.cn/

#### 5. 魔搭社区

**默认 Base URL**: `https://dashscope.aliyuncs.com/compatible-mode/v1`

**请求格式**: 同 OpenAI 规范

**推荐模型**:
- `qwen-turbo` - 通义千问 Turbo
- `qwen-plus` - 通义千问 Plus
- `qwen-max` - 通义千问 Max

**特点**:
- 阿里云官方服务
- 稳定可靠
- 支持通义千问全系列

**文档**: https://modelscope.cn/docs/model-service/API-Inference/intro

### 添加新的 AI 供应商

如需添加新的 AI 供应商，需要修改以下文件：

#### 1. 修改 `src/api/callAI.js`

```javascript
// 1. 添加供应商调用函数
async function callNewProvider({ apiKey, model, fullPrompt, history, baseUrl }) {
  const messages = formatMessages(fullPrompt, history)
  const url = wrapUrlForDev(`${baseUrl}/your/endpoint`)
  
  const res = await axios.post(url, {
    // 根据供应商 API 规范构建请求体
    model,
    messages,
    // ... 其他参数
  }, {
    headers: {
      // 根据供应商要求设置 headers
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  })
  
  // 提取回复内容
  return res.data.choices[0].message.content.trim()
}

// 2. 在 callAI 函数中添加 case
export async function callAI(doctor, fullPrompt, historyForProvider) {
  const { provider } = doctor
  
  switch (provider) {
    case 'openai':
      return callOpenAI(...)
    case 'newprovider':  // 新增
      return callNewProvider(...)
    default:
      throw new Error('Unsupported AI provider')
  }
}
```

#### 2. 修改 `src/components/GlobalSettingsModal.vue`

```vue
<template>
  <a-select v-model:value="editingDoctor.provider">
    <a-select-option value="openai">OpenAI规范</a-select-option>
    <!-- 新增选项 -->
    <a-select-option value="newprovider">新供应商</a-select-option>
  </a-select>
</template>
```

#### 3. 添加模型列表 (可选)

修改 `src/api/models.js`:

```javascript
const MODEL_LISTS = {
  newprovider: [
    { value: 'model-1', label: 'Model 1' },
    { value: 'model-2', label: 'Model 2' }
  ]
}

export async function fetchModels(provider, apiKey, baseUrl) {
  if (provider === 'newprovider') {
    // 如果供应商提供 API 获取模型列表
    // 可以在这里实现
    return MODEL_LISTS.newprovider
  }
  // ...
}
```

---

## 业务流程

### 完整会诊流程图

```mermaid
graph TD
    A[开始] --> B[用户输入病例信息]
    B --> C{是否启用图像识别?}
    C -->|是| D[上传并识别医学影像]
    C -->|否| E[点击"开始会诊"]
    D --> E
    
    E --> F[初始化医生状态]
    F --> G[phase: discussing]
    
    G --> H[确定发言顺序]
    H --> I[医生1发言]
    I --> J[调用AI API]
    J --> K[展示回复 打字机效果]
    
    K --> L{是否所有医生发言完?}
    L -->|否| M[下一位医生发言]
    M --> J
    
    L -->|是| N[phase: voting]
    N --> O[所有医生进行评估投票]
    O --> P[统计投票结果]
    
    P --> Q{是否有医生被淘汰?}
    Q -->|是| R[标记医生为eliminated]
    Q -->|否| S[roundsWithoutElimination++]
    
    R --> T{剩余医生数量?}
    S --> U{是否达到最大轮数?}
    
    T -->|= 1| V[phase: summary]
    T -->|> 1| W[currentRound++]
    
    U -->|是| V
    U -->|否| W
    
    W --> G
    
    V --> X[调用最终总结AI]
    X --> Y[生成完整诊断报告]
    Y --> Z[phase: finished]
    Z --> AA[保存到localStorage]
    AA --> AB[结束]
```

### 关键业务逻辑

#### 1. 发言顺序决策

```javascript
function determineTurnQueue(doctors, turnOrder) {
  const activeDoctors = doctors.filter(d => d.status === 'active')
  
  if (turnOrder === 'random') {
    // 随机打乱顺序
    return shuffleArray(activeDoctors)
  } else {
    // 按列表顺序
    return [...activeDoctors]
  }
}
```

#### 2. 投票解析逻辑

```javascript
function parseVoteResponse(response, doctorNames) {
  // 尝试从回复中提取医生名字
  for (const name of doctorNames) {
    if (response.includes(name)) {
      return name
    }
  }
  
  // 如果找不到，返回 null
  return null
}
```

#### 3. 淘汰决策逻辑

```javascript
function determineElimination(voteTally, doctors) {
  // 找出获得最多票数的医生
  const maxVotes = Math.max(...Object.values(voteTally))
  
  // 如果没有人获得投票，不淘汰任何人
  if (maxVotes === 0) {
    return null
  }
  
  // 找出所有获得最高票数的医生
  const candidates = Object.entries(voteTally)
    .filter(([name, votes]) => votes === maxVotes)
    .map(([name]) => name)
  
  // 如果有多人并列，不淘汰（避免不公平）
  if (candidates.length > 1) {
    return null
  }
  
  // 返回要淘汰的医生 ID
  return findDoctorIdByName(candidates[0], doctors)
}
```

#### 4. 结束条件判断

```javascript
function shouldEndConsultation(workflow, activeDoctors) {
  // 条件1: 只剩一位医生
  if (activeDoctors.length === 1) {
    return { shouldEnd: true, reason: 'only-one-left' }
  }
  
  // 条件2: 连续多轮无淘汰
  if (workflow.roundsWithoutElimination >= settings.maxRoundsWithoutElimination) {
    return { shouldEnd: true, reason: 'max-rounds-reached' }
  }
  
  return { shouldEnd: false }
}
```

---

## 数据持久化

### LocalStorage 架构

系统使用浏览器的 `localStorage` 进行数据持久化，主要存储以下内容：

#### 1. 全局医生配置

**Key**: `global_doctors_config`

**数据结构**:
```json
[
  {
    "id": "doc-1",
    "name": "Dr. GPT-4",
    "provider": "openai",
    "model": "gpt-4o-mini",
    "apiKey": "sk-...",
    "baseUrl": "",
    "customPrompt": ""
  }
]
```

**特点**:
- 不包含运行时状态 (status, votes)
- 在全局设置中管理
- 创建新会诊时作为模板使用

#### 2. 图像识别配置

**Key**: `global_image_recognition_config`

**数据结构**:
```json
{
  "enabled": false,
  "provider": "siliconflow",
  "model": "Pro/Qwen/Qwen2-VL-72B-Instruct",
  "apiKey": "",
  "baseUrl": "",
  "prompt": "识别当前病灶相关的图片内容...",
  "maxConcurrent": 1
}
```

#### 3. 预设提示词

**Key**: `global_preset_prompts`

**数据结构**:
```json
[
  {
    "id": "preset-1",
    "name": "心血管内科医生",
    "prompt": "你是一位资深的心血管内科专家医生..."
  }
]
```

#### 4. 会话列表

**Key**: `sessions_list`

**数据结构**:
```json
{
  "currentId": "session-uuid-1",
  "sessions": [
    {
      "id": "session-uuid-1",
      "name": "2024-01-01 张三问诊",
      "createdAt": 1704067200000,
      "updatedAt": 1704070800000,
      "snapshot": {
        "consultationName": "张三的感冒问诊",
        "settings": {...},
        "doctors": [...],
        "patientCase": {...},
        "workflow": {...},
        "messages": [...],
        "voteTally": {...},
        "finalAnswer": "...",
        "linkedConsultations": [...]
      }
    }
  ]
}
```

### 自动保存机制

**文件**: `src/App.vue`

```javascript
// 监听 consult store 的变化，防抖保存
watch(
  () => consult.$state,
  () => {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      sessions.saveSnapshotFromConsult()
    }, 500)  // 500ms 防抖
  },
  { deep: true }
)
```

**保存时机**:
- 用户输入病例信息
- 医生发言后
- 投票完成后
- 最终总结生成后
- 任何状态变更后 (500ms 防抖)

### 数据迁移和备份

由于数据存储在 localStorage，用户可以：

1. **导出数据** (TODO: 待实现):
```javascript
function exportAllData() {
  const data = {
    doctors: localStorage.getItem('global_doctors_config'),
    imageRecognition: localStorage.getItem('global_image_recognition_config'),
    presetPrompts: localStorage.getItem('global_preset_prompts'),
    sessions: localStorage.getItem('sessions_list')
  }
  
  const json = JSON.stringify(data, null, 2)
  downloadAsFile('ai-doctor-backup.json', json)
}
```

2. **导入数据** (TODO: 待实现):
```javascript
function importData(jsonString) {
  const data = JSON.parse(jsonString)
  
  if (data.doctors) {
    localStorage.setItem('global_doctors_config', data.doctors)
  }
  // ... 其他数据
  
  // 重新加载
  location.reload()
}
```

---

## 开发指南

### 环境搭建

#### 1. 克隆项目

```bash
git clone <repository-url>
cd ai-medical-consultation-panel
```

#### 2. 安装依赖

推荐使用 pnpm (速度更快，磁盘占用更少):

```bash
pnpm install
```

或使用 npm:

```bash
npm install
```

#### 3. 启动开发服务器

```bash
pnpm dev
# 或
npm run dev
```

访问: http://localhost:5173

#### 4. 配置 API Key

在应用中点击"全局设置"，添加医生并配置 API Key。

### 开发调试

#### 1. Vue Devtools

推荐安装 [Vue Devtools](https://devtools.vuejs.org/) 浏览器扩展，可以：
- 查看组件树
- 检查组件状态
- 调试 Pinia Store
- 查看事件

#### 2. 查看 Store 状态

在浏览器控制台:

```javascript
// 获取 store 实例
const { useConsultStore, useGlobalStore, useSessionsStore } = window.__PINIA_STORES__

// 查看状态
console.log(useConsultStore().$state)
console.log(useGlobalStore().$state)
console.log(useSessionsStore().$state)
```

#### 3. 模拟 AI 回复

如果不想消耗 API 调用，可以在 `src/api/callAI.js` 中不配置 `apiKey`，系统会返回模拟回复：

```javascript
if (!apiKey) {
  await sleep(600)
  return `【模拟回复 - ${doctor.name}】\n根据提供的病历与讨论历史，我认为需要进一步完善体格检查与辅助检查以明确诊断。`
}
```

#### 4. 清除 localStorage

调试时可能需要清除本地数据：

```javascript
// 清除所有数据
localStorage.clear()

// 清除特定数据
localStorage.removeItem('global_doctors_config')
localStorage.removeItem('sessions_list')

// 刷新页面
location.reload()
```

### 代码规范

#### 1. Vue 组件

- 使用 **组合式 API** (Composition API)
- 使用 `<script setup>` 语法
- Props 使用 `defineProps()`
- Emits 使用 `defineEmits()`

示例:

```vue
<template>
  <div>{{ message }}</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  title: String
})

const emit = defineEmits(['update'])

const message = ref('Hello')

const computedValue = computed(() => {
  return props.title + message.value
})

function handleClick() {
  emit('update', message.value)
}
</script>
```

#### 2. Pinia Store

- Action 中使用 `this` 访问 state
- 不需要 mutations，直接修改 state
- 复杂逻辑封装在 actions 中

示例:

```javascript
export const useMyStore = defineStore('myStore', {
  state: () => ({
    count: 0
  }),
  
  getters: {
    doubleCount: (state) => state.count * 2
  },
  
  actions: {
    increment() {
      this.count++
    },
    
    async fetchData() {
      const data = await api.get()
      this.count = data.count
    }
  }
})
```

#### 3. 命名规范

- **组件文件**: PascalCase (如 `GlobalSettingsModal.vue`)
- **工具文件**: camelCase (如 `prompt.js`)
- **变量**: camelCase (如 `currentRound`)
- **常量**: UPPER_SNAKE_CASE (如 `MAX_ROUNDS`)
- **组件名**: PascalCase (如 `<GlobalSettingsModal />`)

### 添加新功能

#### 示例: 添加"医生专长标签"功能

**1. 修改数据结构** (src/store/index.js):

```javascript
state: () => ({
  doctors: [
    {
      // ... 现有字段
      specialties: ['心血管', '高血压'] // 新增字段
    }
  ]
})
```

**2. 修改 UI** (src/components/GlobalSettingsModal.vue):

```vue
<template>
  <a-form-item label="专长标签">
    <a-select
      v-model:value="editingDoctor.specialties"
      mode="tags"
      placeholder="输入专长标签"
    />
  </a-form-item>
</template>
```

**3. 显示标签** (src/components/DoctorList.vue):

```vue
<template>
  <a-tag v-for="tag in doctor.specialties" :key="tag">
    {{ tag }}
  </a-tag>
</template>
```

**4. 在提示词中使用** (src/utils/prompt.js):

```javascript
export function buildFullPrompt(doctor, patientCase, messages) {
  const specialtyText = doctor.specialties?.length 
    ? `你的专长领域是: ${doctor.specialties.join('、')}\n`
    : ''
  
  return {
    system: `${specialtyText}${doctor.customPrompt || globalPrompt}`,
    user: `...`
  }
}
```

---

## 部署说明

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

构建产物在 `dist/` 目录。

### 部署方式

#### 1. 静态托管 (推荐)

**适用平台**:
- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

**部署步骤** (以 GitHub Pages 为例):

```bash
# 1. 构建
pnpm build

# 2. 进入构建目录
cd dist

# 3. 初始化 git 并推送
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:username/repo.git master:gh-pages

# 4. 在 GitHub 仓库设置中启用 GitHub Pages
# 选择 gh-pages 分支
```

#### 2. 自建服务器

**Nginx 配置**:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /var/www/ai-doctor/dist;
    index index.html;
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # 安全头
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 环境变量配置

创建 `.env.production`:

```bash
# 是否启用代理 (如果部署环境有 nginx 代理)
VITE_ENABLE_PROXY=false
```

### CORS 问题

由于直接调用第三方 API，可能遇到 CORS 跨域问题。

**解决方案**:

#### 方案 1: 使用官方支持的域名

部分 AI 服务商（如 OpenAI、Anthropic）允许浏览器直接调用 API，不会有 CORS 问题。

#### 方案 2: Nginx 代理

在服务器配置 Nginx 反向代理:

```nginx
# 代理 OpenAI API
location /api/openai/ {
    proxy_pass https://api.openai.com/v1/;
    proxy_set_header Host api.openai.com;
    proxy_set_header Authorization $http_authorization;
}

# 代理 Anthropic API
location /api/anthropic/ {
    proxy_pass https://api.anthropic.com/v1/;
    proxy_set_header Host api.anthropic.com;
    proxy_set_header x-api-key $http_x_api_key;
}
```

修改医生配置的 Base URL:
- OpenAI: `https://your-domain.com/api/openai`
- Anthropic: `https://your-domain.com/api/anthropic`

#### 方案 3: 使用国内代理服务

使用支持 CORS 的国内 API 代理服务。

---

## 扩展开发

### 添加新的评估机制

当前系统使用"投票淘汰"机制，你可以添加新的评估方式：

#### 示例: 添加"评分机制"

**1. 修改投票提示词** (src/utils/prompt.js):

```javascript
export function buildVotePrompt(doctor, messages, activeDoctors) {
  return {
    system: "你是医生评审委员",
    user: `
请为每位医生的诊断打分 (1-10分):

${activeDoctors.map(d => `- ${d.name}`).join('\n')}

请按以下格式输出:
Dr. GPT-4: 8
Dr. Claude: 7
...
    `
  }
}
```

**2. 解析评分** (src/store/index.js):

```javascript
function parseScores(response, doctorNames) {
  const scores = {}
  
  for (const name of doctorNames) {
    const regex = new RegExp(`${name}:\\s*(\\d+)`)
    const match = response.match(regex)
    if (match) {
      scores[name] = parseInt(match[1])
    }
  }
  
  return scores
}
```

**3. 根据评分决定淘汰** (src/store/index.js):

```javascript
async requestVote() {
  const allScores = []
  
  // 每位医生评分
  for (const doctor of activeDoctors) {
    const votePrompt = buildVotePrompt(...)
    const response = await callAI(...)
    const scores = parseScores(response, doctorNames)
    allScores.push(scores)
  }
  
  // 计算平均分
  const avgScores = calculateAverageScores(allScores)
  
  // 淘汰最低分 (如果分差显著)
  const minScore = Math.min(...Object.values(avgScores))
  const maxScore = Math.max(...Object.values(avgScores))
  
  if (maxScore - minScore >= 2) {  // 分差阈值
    const eliminated = findDoctorWithScore(minScore)
    eliminated.status = 'eliminated'
  }
  
  // ...
}
```

### 添加导出功能

#### 导出为 PDF

```bash
npm install jspdf
```

```javascript
import jsPDF from 'jspdf'

export function exportToPDF(consultation) {
  const doc = new jsPDF()
  
  // 添加标题
  doc.setFontSize(20)
  doc.text('AI 医疗会诊报告', 20, 20)
  
  // 添加病例信息
  doc.setFontSize(12)
  doc.text(`患者: ${consultation.patientCase.name}`, 20, 40)
  doc.text(`年龄: ${consultation.patientCase.age}`, 20, 50)
  
  // 添加诊断内容
  doc.text('最终诊断:', 20, 70)
  doc.text(consultation.finalAnswer, 20, 80, { maxWidth: 170 })
  
  // 保存
  doc.save('consultation-report.pdf')
}
```

#### 导出为 Word

```bash
npm install docx file-saver
```

```javascript
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

export async function exportToWord(consultation) {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: 'AI 医疗会诊报告',
              bold: true,
              size: 28
            })
          ]
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `患者: ${consultation.patientCase.name}`
            })
          ]
        }),
        // ... 更多内容
      ]
    }]
  })
  
  const blob = await Packer.toBlob(doc)
  saveAs(blob, 'consultation-report.docx')
}
```

### 添加语音功能

#### 语音输入

```javascript
export function startVoiceInput(onResult) {
  if (!('webkitSpeechRecognition' in window)) {
    alert('您的浏览器不支持语音识别')
    return
  }
  
  const recognition = new webkitSpeechRecognition()
  recognition.lang = 'zh-CN'
  recognition.continuous = false
  recognition.interimResults = false
  
  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript
    onResult(transcript)
  }
  
  recognition.start()
}
```

#### 语音播报

```javascript
export function speakText(text) {
  if (!('speechSynthesis' in window)) {
    alert('您的浏览器不支持语音播报')
    return
  }
  
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'zh-CN'
  utterance.rate = 1.0
  utterance.pitch = 1.0
  
  speechSynthesis.speak(utterance)
}
```

### 添加协作功能

#### 使用 WebSocket 实现多人协作

**1. 安装 Socket.IO 客户端**:

```bash
npm install socket.io-client
```

**2. 创建协作 Store** (src/store/collaboration.js):

```javascript
import { defineStore } from 'pinia'
import { io } from 'socket.io-client'

export const useCollaborationStore = defineStore('collaboration', {
  state: () => ({
    socket: null,
    roomId: null,
    participants: []
  }),
  
  actions: {
    connect(roomId) {
      this.socket = io('wss://your-server.com')
      this.roomId = roomId
      
      this.socket.emit('join-room', roomId)
      
      this.socket.on('user-joined', (user) => {
        this.participants.push(user)
      })
      
      this.socket.on('message-update', (message) => {
        // 同步消息
        const consultStore = useConsultStore()
        consultStore.messages.push(message)
      })
    },
    
    disconnect() {
      if (this.socket) {
        this.socket.disconnect()
        this.socket = null
      }
    },
    
    broadcastMessage(message) {
      if (this.socket) {
        this.socket.emit('new-message', {
          roomId: this.roomId,
          message
        })
      }
    }
  }
})
```

**3. 在组件中使用**:

```vue
<script setup>
import { useCollaborationStore } from '@/store/collaboration'

const collaboration = useCollaborationStore()

onMounted(() => {
  const roomId = route.query.room || generateRoomId()
  collaboration.connect(roomId)
})

onBeforeUnmount(() => {
  collaboration.disconnect()
})
</script>
```

---

## 常见问题

### 1. CORS 跨域问题

**问题**: 调用 AI API 时出现 CORS 错误

**解决**:
- 使用官方支持浏览器调用的 API
- 配置 Nginx 反向代理
- 使用支持 CORS 的代理服务

### 2. API Key 安全

**问题**: API Key 存储在浏览器不安全

**说明**: 
- 本系统设计为个人使用工具
- API Key 仅存储在用户自己的浏览器
- 不会上传到任何服务器

**建议**:
- 使用限额较小的 API Key
- 定期更换 API Key
- 不要在公共电脑上使用

### 3. 数据丢失

**问题**: 清除浏览器缓存后数据丢失

**解决**:
- 实现数据导出功能 (待开发)
- 定期备份重要会诊记录
- 使用浏览器的"不清除特定网站数据"功能

### 4. AI 回复速度慢

**问题**: 某些 AI 模型响应很慢

**优化**:
- 选择更快的模型 (如 GPT-4o-mini, Claude Haiku)
- 减少参与会诊的医生数量
- 使用国内 AI 服务商 (如硅基流动)

### 5. 打字机效果卡顿

**问题**: 长文本的打字机效果导致页面卡顿

**优化**:
- 调整打字速度 (修改 `ChatDisplay.vue` 中的 delay)
- 使用 `requestAnimationFrame` 优化动画
- 长文本跳过打字机效果直接显示

---

## 更新日志

### v0.1.0 (当前版本)

**核心功能**:
- ✅ 多医生协作会诊
- ✅ 投票淘汰机制
- ✅ 最终诊断总结
- ✅ 会话管理
- ✅ 图像识别
- ✅ 关联问诊
- ✅ 预设提示词

**支持的 AI 供应商**:
- ✅ OpenAI
- ✅ Anthropic Claude
- ✅ Google Gemini
- ✅ 硅基流动
- ✅ 魔搭社区

**已知问题**:
- 部分浏览器不支持某些 AI API
- 长时间运行可能占用大量内存
- 缺少数据导出功能

### 未来规划

**v0.2.0**:
- [ ] 数据导出功能 (PDF, Word, JSON)
- [ ] 语音输入/输出
- [ ] 移动端适配
- [ ] 更多 AI 模型支持

**v0.3.0**:
- [ ] 协作模式 (多人实时协作)
- [ ] 医学知识库集成
- [ ] 诊断质量评估
- [ ] 统计报表

---

## 贡献指南

欢迎提交 Issue 和 Pull Request！

### 提交 Issue

**Bug 报告**应包含:
- 问题描述
- 复现步骤
- 预期行为
- 实际行为
- 浏览器版本
- 错误截图/日志

**功能建议**应包含:
- 功能描述
- 使用场景
- 预期效果
- 可选: 实现思路

### 提交 Pull Request

1. Fork 本项目
2. 创建特性分支: `git checkout -b feature/AmazingFeature`
3. 提交更改: `git commit -m 'Add some AmazingFeature'`
4. 推送到分支: `git push origin feature/AmazingFeature`
5. 提交 Pull Request

**Pull Request 要求**:
- 遵循项目代码规范
- 添加必要的注释
- 通过 ESLint 检查
- 功能完整可用
- 不引入新的 Bug

---

## 许可证

本项目采用 MIT 许可证开源。

**MIT License**

Copyright (c) 2024 AI Medical Consultation Panel Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 联系方式

- **项目主页**: https://github.com/DragonChenCL/ai-doctor
- **在线演示**: https://dragonchencl.github.io/ai-doctor/
- **问题反馈**: [GitHub Issues](https://github.com/DragonChenCL/ai-doctor/issues)

---

<div align="center">

**Made with ❤️ by the AI Medical Consultation Panel Team**

如果这个项目对您有帮助，请给我们一个 ⭐️ Star！

</div>
