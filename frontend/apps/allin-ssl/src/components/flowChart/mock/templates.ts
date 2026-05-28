/**
 * 预定义工作流模板数据
 * 每种模板定义了固定的流程结构，用户选择后只需填写参数
 */

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'server' | 'cloud' | 'panel' | 'basic' | 'advanced'
  flow: any | null
}

// 通用的执行结果分支节点
const createExecuteResultBranch = (fromNodeId: string) => ({
  id: 'execute',
  name: '执行结果',
  type: 'execute_result_branch',
  config: { fromNodeId },
  conditionNodes: [
    {
      id: 'execute-success',
      name: '执行成功',
      type: 'execute_result_condition',
      config: { fromNodeId: '', type: 'success' },
    },
    {
      id: 'execute-failure',
      name: '执行失败',
      type: 'execute_result_condition',
      config: { fromNodeId: '', type: 'fail' },
    },
  ],
})

// 通用的通知节点
const createNotifyNode = () => ({
  id: 'notify-1',
  name: '通知任务',
  type: 'notify',
  config: {
    provider: '',
    provider_id: '',
    subject: '',
    body: '',
  },
})

// 通用的申请节点
const createApplyNode = (ca = 'letsencrypt') => ({
  id: 'apply-1',
  name: '申请证书',
  type: 'apply',
  config: {
    domains: '',
    email: '',
    eabId: '',
    ca,
    proxy: '',
    end_day: 30,
    provider: '',
    provider_id: '',
    algorithm: 'RSA2048',
    skip_check: 0,
  },
})

// 通用的部署节点
const createDeployNode = (provider = '', providerId = '') => ({
  id: 'deploy-1',
  name: '部署',
  type: 'deploy',
  inputs: [],
  config: {
    provider,
    provider_id: providerId,
    skip: 1,
    inputs: {
      fromNodeId: '',
      name: '',
    },
  },
})

// 通用的开始节点
const createStartNode = (childNode: any) => ({
  id: 'start-1',
  name: '开始',
  type: 'start',
  config: {
    exec_type: 'auto',
    type: 'day',
    hour: 1,
    minute: 0,
  },
  childNode,
})

// 通用的上传节点
const createUploadNode = () => ({
  id: 'upload-1',
  name: '上传证书',
  type: 'upload',
  config: {
    cert_id: '',
    cert: '',
    key: '',
  },
})

/**
 * 模板1: 本地/SSH部署
 * Start -> Apply -> Deploy(localhost/ssh) -> ExecuteResultBranch -> Notify
 */
const localDeployFlow = {
  name: '',
  childNode: createStartNode({
    ...createApplyNode(),
    childNode: {
      ...createDeployNode(),
      childNode: {
        ...createExecuteResultBranch('deploy-1'),
        childNode: createNotifyNode(),
      },
    },
  }),
}

/**
 * 模板2: CDN/云服务部署
 * Start -> Apply -> Deploy(CDN) -> ExecuteResultBranch -> Notify
 */
const cdnDeployFlow = {
  name: '',
  childNode: createStartNode({
    ...createApplyNode(),
    childNode: {
      ...createDeployNode(),
      childNode: {
        ...createExecuteResultBranch('deploy-1'),
        childNode: createNotifyNode(),
      },
    },
  }),
}

/**
 * 模板3: 面板站点部署
 * Start -> Apply -> Deploy(panel) -> ExecuteResultBranch -> Notify
 */
const panelDeployFlow = {
  name: '',
  childNode: createStartNode({
    ...createApplyNode(),
    childNode: {
      ...createDeployNode(),
      childNode: {
        ...createExecuteResultBranch('deploy-1'),
        childNode: createNotifyNode(),
      },
    },
  }),
}

/**
 * 模板4: 仅申请证书
 * Start -> Apply -> Upload
 */
const certOnlyFlow = {
  name: '',
  childNode: createStartNode({
    ...createApplyNode(),
    childNode: createUploadNode(),
  }),
}

/**
 * 所有预定义模板
 */
export const workflowTemplates: Record<string, WorkflowTemplate> = {
  localDeploy: {
    id: 'localDeploy',
    name: '本地/SSH部署',
    description: '申请证书并部署到本地服务器或通过SSH远程部署',
    icon: 'Server',
    category: 'server',
    flow: localDeployFlow,
  },
  cdnDeploy: {
    id: 'cdnDeploy',
    name: 'CDN/云服务部署',
    description: '申请证书并部署到阿里云、腾讯云等CDN服务',
    icon: 'Cloud',
    category: 'cloud',
    flow: cdnDeployFlow,
  },
  panelDeploy: {
    id: 'panelDeploy',
    name: '面板站点部署',
    description: '申请证书并部署到宝塔面板、1Panel等',
    icon: 'Dashboard',
    category: 'panel',
    flow: panelDeployFlow,
  },
  certOnly: {
    id: 'certOnly',
    name: '仅申请证书',
    description: '只申请SSL证书，不自动部署',
    icon: 'Certificate',
    category: 'basic',
    flow: certOnlyFlow,
  },
  advanced: {
    id: 'advanced',
    name: '高级自定义',
    description: '完全自定义的部署流程，自由添加节点',
    icon: 'Settings',
    category: 'advanced',
    flow: null,
  },
}

/**
 * 获取模板列表（用于UI展示）
 */
export const getTemplateList = (): WorkflowTemplate[] => {
  return Object.values(workflowTemplates)
}

/**
 * 根据ID获取模板
 */
export const getTemplateById = (id: string): WorkflowTemplate | null => {
  return workflowTemplates[id] || null
}

/**
 * 根据模板ID获取流程数据（深拷贝）
 */
export const getTemplateFlow = (id: string): any | null => {
  const template = workflowTemplates[id]
  if (!template || !template.flow) return null
  return JSON.parse(JSON.stringify(template.flow))
}

/**
 * 快速部署配置接口
 */
export interface QuickDeployConfig {
  domains: string
  dnsProvider: string
  dnsProviderId: string
  deployTarget: string
  deployProviderId: string
  ca?: string
  email?: string
}

/**
 * 根据快速部署配置生成工作流数据
 */
export const generateQuickDeployFlow = (config: QuickDeployConfig): any => {
  const applyNode = createApplyNode(config.ca || 'letsencrypt')
  applyNode.config.domains = config.domains
  applyNode.config.provider = config.dnsProvider
  applyNode.config.provider_id = config.dnsProviderId
  if (config.email) applyNode.config.email = config.email

  const deployNode = createDeployNode(config.deployTarget, config.deployProviderId)

  const flow = {
    name: `快速部署 - ${config.domains.split(',')[0]?.trim() || '新工作流'}`,
    childNode: createStartNode({
      ...applyNode,
      childNode: {
        ...deployNode,
        childNode: {
          ...createExecuteResultBranch('deploy-1'),
          childNode: createNotifyNode(),
        },
      },
    }),
  }

  return JSON.parse(JSON.stringify(flow))
}
