import { NCard, NSpace, NFormItem, NRadio, NIcon, NButton, NGrid, NGi, NDrawer, NDrawerContent } from 'naive-ui'
import { useStore } from '@autoDeploy/useStore'
import { useAddWorkflowController } from '@autoDeploy/useController'
import { $t } from '@locales/index'
import SvgIcon from '@components/svgIcon'
import FlowPreview from '@components/flowChart/FlowPreview'

/**
 * 模板图标映射
 */
const templateIcons: Record<string, string> = {
  Server: 'resources-local',
  Cloud: 'resources-alicloud',
  Dashboard: 'resources-btpanel',
  Certificate: 'cert-letsencrypt',
  Settings: 'resources-plugin',
}

/**
 * 模板分类颜色映射
 */
const categoryColors: Record<string, { bg: string; border: string; icon: string }> = {
  server: { bg: 'rgba(59, 130, 246, 0.08)', border: '#3b82f6', icon: '#3b82f6' },
  cloud: { bg: 'rgba(139, 92, 246, 0.08)', border: '#8b5cf6', icon: '#8b5cf6' },
  panel: { bg: 'rgba(16, 185, 129, 0.08)', border: '#10b981', icon: '#10b981' },
  basic: { bg: 'rgba(245, 158, 11, 0.08)', border: '#f59e0b', icon: '#f59e0b' },
  advanced: { bg: 'rgba(107, 114, 128, 0.08)', border: '#6b7280', icon: '#6b7280' },
}

/**
 * 添加工作流模态框组件
 * 显示预定义模板卡片网格，用户选择后创建工作流
 */
export default defineComponent({
  name: 'AddWorkflowModal',
  setup() {
    const { workflowTemplateOptions, workflowFormData } = useStore()
    const { AddWorkflowForm } = useAddWorkflowController()

    // 预览状态
    const showPreview = ref(false)
    const previewTemplateId = ref('')

    // 打开预览
    const handlePreview = (e: MouseEvent, templateId: string) => {
      e.stopPropagation()
      previewTemplateId.value = templateId
      showPreview.value = true
    }

    return () => (
      <NCard bordered={false} class="shadow-none" content-class="!p-[10px]">
        <AddWorkflowForm
          labelPlacement="top"
          labelWidth={100}
          v-slots={{
            template: () => {
              return (
                <NFormItem label={$t('t_0_1745474945127')} required>
                  <div class="w-full">
                    <NGrid cols={2} xGap={12} yGap={12} responsive="screen">
                      {workflowTemplateOptions.value.map((item) => {
                        const colors = categoryColors[item.category] || categoryColors.advanced
                        const isSelected = workflowFormData.value.templateType === item.value
                        return (
                          <NGi key={item.value}>
                            <div
                              class="cursor-pointer transition-all duration-200"
                              onClick={() => {
                                workflowFormData.value.templateType = item.value
                              }}
                            >
                              <NCard
                                class="rounded-xl border-1 transition-all duration-200"
                                style={{
                                  borderColor: isSelected ? colors.border : 'var(--n-border-color)',
                                  backgroundColor: isSelected ? colors.bg : 'transparent',
                                  boxShadow: isSelected ? `0 0 0 1px ${colors.border}` : 'none',
                                }}
                                hoverable
                                content-class="!p-[16px]"
                              >
                                <div class="flex items-start gap-3">
                                  <div
                                    class="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
                                    style={{ backgroundColor: colors.bg }}
                                  >
                                    <SvgIcon
                                      icon={templateIcons[item.icon] || 'setting'}
                                      size="1.8rem"
                                      style={{ color: colors.icon }}
                                    />
                                  </div>
                                  <div class="flex-1 min-w-0">
                                    <div class="font-semibold text-[14px] mb-1 flex items-center justify-between">
                                      <span>{item.label}</span>
                                      <NRadio
                                        checked={isSelected}
                                        style={{ color: isSelected ? colors.border : undefined }}
                                      />
                                    </div>
                                    <div class="text-[12px] text-gray-500 leading-relaxed mb-2">
                                      {item.description}
                                    </div>
                                    {/* 预览按钮 */}
                                    {item.value !== 'advanced' && (
                                      <NButton
                                        text
                                        type="primary"
                                        size="tiny"
                                        onClick={(e: MouseEvent) => handlePreview(e, item.value)}
                                        class="!text-[11px]"
                                      >
                                        查看流程
                                      </NButton>
                                    )}
                                  </div>
                                </div>
                              </NCard>
                            </div>
                          </NGi>
                        )
                      })}
                    </NGrid>
                  </div>
                </NFormItem>
              )
            },
          }}
        />

        {/* 流程预览抽屉 */}
        <NDrawer
          v-model:show={showPreview.value}
          placement="right"
          width={360}
        >
          <NDrawerContent title="流程预览" closable>
            <FlowPreview templateId={previewTemplateId.value} />
          </NDrawerContent>
        </NDrawer>
      </NCard>
    )
  },
})
