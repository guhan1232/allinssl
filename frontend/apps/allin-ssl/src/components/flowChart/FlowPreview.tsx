import SvgIcon from '@components/svgIcon'
import { getTemplateFlow } from '@components/flowChart/mock/templates'

/**
 * 节点类型配置
 */
const nodeTypeConfig: Record<string, { label: string; icon: string; color: string; bgColor: string }> = {
  start: { label: '开始', icon: 'flow-start', color: '#fff', bgColor: '#3CB371' },
  apply: { label: '申请证书', icon: 'flow-apply', color: '#fff', bgColor: '#6366f1' },
  deploy: { label: '部署', icon: 'flow-deploy', color: '#fff', bgColor: '#f59e0b' },
  upload: { label: '上传证书', icon: 'flow-upload', color: '#fff', bgColor: '#8b5cf6' },
  notify: { label: '通知', icon: 'flow-notify', color: '#fff', bgColor: '#3b82f6' },
  execute_result_branch: { label: '执行结果分支', icon: 'flow-branch', color: '#fff', bgColor: '#6b7280' },
  execute_result_condition: { label: '条件', icon: 'flow-condition', color: '#fff', bgColor: '#9ca3af' },
  branch: { label: '并行分支', icon: 'flow-branch', color: '#fff', bgColor: '#6b7280' },
  condition: { label: '分支', icon: 'flow-condition', color: '#fff', bgColor: '#9ca3af' },
  private_ca: { label: '自签证书', icon: 'flow-private_ca', color: '#fff', bgColor: '#ec4899' },
}

/**
 * 获取节点配置
 */
const getNodeConfig = (type: string) => {
  return nodeTypeConfig[type] || { label: type, icon: 'flow-default', color: '#fff', bgColor: '#6b7280' }
}

/**
 * 简化的流程节点组件（只读预览）
 */
const PreviewNode = defineComponent({
  name: 'PreviewNode',
  props: {
    node: {
      type: Object as PropType<any>,
      required: true,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () => {
      const config = getNodeConfig(props.node.type)

      return (
        <div class="flex flex-col items-center">
          {/* 节点卡片 */}
          <div
            class="flex items-center gap-2 px-4 py-2 rounded-lg border min-w-[160px] shadow-sm"
            style={{
              borderColor: config.bgColor,
              backgroundColor: `${config.bgColor}10`,
            }}
          >
            <div
              class="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: config.bgColor }}
            >
              <SvgIcon icon={config.icon} size="1.2rem" color={config.color} />
            </div>
            <div class="flex flex-col">
              <span class="text-[12px] font-medium" style={{ color: config.bgColor }}>
                {config.label}
              </span>
              <span class="text-[11px] text-gray-500 truncate max-w-[120px]">
                {props.node.name}
              </span>
            </div>
          </div>

          {/* 连接线 */}
          {!props.isLast && (
            <div class="flex flex-col items-center">
              <div class="w-[2px] h-4 bg-gray-300" />
              <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-gray-300" />
            </div>
          )}
        </div>
      )
    }
  },
})

/**
 * 执行结果分支预览组件
 */
const PreviewBranch = defineComponent({
  name: 'PreviewBranch',
  props: {
    node: {
      type: Object as PropType<any>,
      required: true,
    },
    isLast: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    return () => {
      const config = getNodeConfig('execute_result_branch')
      const successNode = props.node.conditionNodes?.find((n: any) => n.config?.type === 'success')
      const failNode = props.node.conditionNodes?.find((n: any) => n.config?.type === 'fail')

      return (
        <div class="flex flex-col items-center">
          {/* 分支节点 */}
          <div
            class="flex items-center gap-2 px-4 py-2 rounded-lg border min-w-[160px] shadow-sm"
            style={{
              borderColor: config.bgColor,
              backgroundColor: `${config.bgColor}10`,
            }}
          >
            <div
              class="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: config.bgColor }}
            >
              <SvgIcon icon={config.icon} size="1.2rem" color={config.color} />
            </div>
            <div class="flex flex-col">
              <span class="text-[12px] font-medium" style={{ color: config.bgColor }}>
                {config.label}
              </span>
              <span class="text-[11px] text-gray-500">
                {props.node.name}
              </span>
            </div>
          </div>

          {/* 分支线 */}
          <div class="flex items-start gap-8 mt-2">
            {/* 成功分支 */}
            {successNode && (
              <div class="flex flex-col items-center">
                <div class="w-[2px] h-3 bg-green-400" />
                <div class="px-2 py-1 rounded text-[10px] bg-green-50 text-green-600 border border-green-200">
                  成功
                </div>
              </div>
            )}
            {/* 失败分支 */}
            {failNode && (
              <div class="flex flex-col items-center">
                <div class="w-[2px] h-3 bg-red-400" />
                <div class="px-2 py-1 rounded text-[10px] bg-red-50 text-red-600 border border-red-200">
                  失败
                </div>
              </div>
            )}
          </div>

          {/* 连接线 */}
          {!props.isLast && (
            <div class="flex flex-col items-center mt-2">
              <div class="w-[2px] h-4 bg-gray-300" />
              <div class="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-gray-300" />
            </div>
          )}
        </div>
      )
    }
  },
})

/**
 * 流程预览组件
 * 以只读模式展示工作流的节点链
 */
export default defineComponent({
  name: 'FlowPreview',
  props: {
    /** 模板ID */
    templateId: {
      type: String,
      default: '',
    },
    /** 直接传入流程数据 */
    flowData: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    // 获取流程数据
    const flowData = computed(() => {
      if (props.flowData) return props.flowData
      if (props.templateId) return getTemplateFlow(props.templateId)
      return null
    })

    // 递归收集节点
    const collectNodes = (node: any): any[] => {
      if (!node) return []
      const nodes = [node]
      if (node.childNode) {
        nodes.push(...collectNodes(node.childNode))
      }
      return nodes
    }

    // 获取节点列表
    const nodeList = computed(() => {
      if (!flowData.value) return []
      const childNode = flowData.value.childNode || flowData.value
      return collectNodes(childNode)
    })

    return () => {
      if (nodeList.value.length === 0) {
        return (
          <div class="flex items-center justify-center py-8 text-gray-400">
            暂无流程数据
          </div>
        )
      }

      return (
        <div class="flex flex-col items-center py-4 px-2 overflow-auto max-h-[400px]">
          {nodeList.value.map((node: any, index: number) => {
            const isLast = index === nodeList.value.length - 1
            const isBranch = node.type === 'execute_result_branch' || node.type === 'branch'

            if (isBranch) {
              return <PreviewBranch key={node.id} node={node} isLast={isLast} />
            }

            return <PreviewNode key={node.id} node={node} isLast={isLast} />
          })}
        </div>
      )
    }
  },
})
