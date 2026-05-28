import { getTemplateFlow, workflowTemplates } from './templates'

// 默认模板（向后兼容）
const defaultTemplate = workflowTemplates.localDeploy.flow

export default defaultTemplate

// 导出模板系统
export { workflowTemplates, getTemplateFlow }
export type { WorkflowTemplate, QuickDeployConfig } from './templates'
export { getTemplateList, getTemplateById, generateQuickDeployFlow } from './templates'
