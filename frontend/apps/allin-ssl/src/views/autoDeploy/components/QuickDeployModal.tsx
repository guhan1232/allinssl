import {
  NCard,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NSpace,
  NAlert,
  NDivider,
  NIcon,
  NSpin,
} from 'naive-ui'
import { useStore } from '@autoDeploy/useStore'
import { $t } from '@locales/index'
import { getAccessAllList } from '@/api/access'
import { addWorkflow } from '@/api/workflow'
import { generateQuickDeployFlow } from '@components/flowChart/mock/templates'
import { ApiProjectConfig } from '@config/data'
import SvgIcon from '@components/svgIcon'
import { useMessage } from '@baota/naive-ui/hooks'
import { useError } from '@baota/hooks/error'

import type { QuickDeployConfig } from '@components/flowChart/mock/templates'

/**
 * DNS服务商选项（从ApiProjectConfig中筛选type包含dns的）
 */
const getDnsProviderOptions = () => {
  return Object.entries(ApiProjectConfig)
    .filter(([_, config]) => config.type?.includes('dns'))
    .map(([key, config]) => ({
      label: config.name,
      value: key,
      icon: config.icon,
    }))
    .sort((a, b) => (ApiProjectConfig[a.value]?.sort || 0) - (ApiProjectConfig[b.value]?.sort || 0))
}

/**
 * 部署目标选项（从ApiProjectConfig中筛选type包含host的）
 */
const getDeployTargetOptions = () => {
  return Object.entries(ApiProjectConfig)
    .filter(([_, config]) => config.type?.includes('host'))
    .map(([key, config]) => ({
      label: config.name,
      value: key,
      icon: config.icon,
    }))
    .sort((a, b) => (ApiProjectConfig[a.value]?.sort || 0) - (ApiProjectConfig[b.value]?.sort || 0))
}

/**
 * 快速部署弹窗组件
 * 用户输入域名、DNS服务商、部署目标，自动生成并创建工作流
 */
export default defineComponent({
  name: 'QuickDeployModal',
  emits: ['close'],
  setup(_props, { emit }) {
    const message = useMessage()
    const { handleError } = useError()
    const { fetchWorkflowList } = useStore()

    // 表单数据
    const formData = ref<QuickDeployConfig>({
      domains: '',
      dnsProvider: '',
      dnsProviderId: '',
      deployTarget: '',
      deployProviderId: '',
      ca: 'letsencrypt',
      email: '',
    })

    // 加载状态
    const loading = ref(false)

    // DNS服务商选项
    const dnsProviderOptions = getDnsProviderOptions()

    // 部署目标选项
    const deployTargetOptions = getDeployTargetOptions()

    // ACME账户选项
    const acmeOptions = [
      { label: "Let's Encrypt", value: 'letsencrypt' },
      { label: 'ZeroSSL', value: 'zerossl' },
      { label: 'Buypass', value: 'buypass' },
      { label: 'Google', value: 'google' },
      { label: 'SSL.com', value: 'sslcom' },
    ]

    // 已配置的授权列表（用于获取provider_id）
    const accessList = ref<any[]>([])
    const accessLoading = ref(false)

    // 获取已配置的授权列表
    const fetchAccessList = async () => {
      accessLoading.value = true
      try {
        const res = await getAccessAllList().fetch()
        if (res.data) {
          accessList.value = res.data as any[]
        }
      } catch (error) {
        handleError(error)
      } finally {
        accessLoading.value = false
      }
    }

    // 获取选中DNS服务商的授权ID选项
    const dnsAccessOptions = computed(() => {
      if (!formData.value.dnsProvider) return []
      return accessList.value
        .filter((item: any) => item.type === formData.value.dnsProvider)
        .map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
    })

    // 获取选中部署目标的授权ID选项
    const deployAccessOptions = computed(() => {
      if (!formData.value.deployTarget) return []
      // 获取部署目标对应的provider类型
      const targetConfig = ApiProjectConfig[formData.value.deployTarget]
      if (!targetConfig) return []

      // 对于localhost，不需要授权
      if (formData.value.deployTarget === 'localhost') return []

      // 对于其他部署目标，查找对应的授权
      const providerKey = formData.value.deployTarget.split('-')[0] || formData.value.deployTarget
      return accessList.value
        .filter((item: any) => {
          return item.type === providerKey || item.type === formData.value.deployTarget
        })
        .map((item: any) => ({
          label: item.name,
          value: item.id,
        }))
    })

    // 表单验证
    const isValid = computed(() => {
      return (
        formData.value.domains.trim() !== '' &&
        formData.value.dnsProvider !== '' &&
        formData.value.deployTarget !== ''
      )
    })

    // 提交快速部署
    const handleSubmit = async () => {
      if (!isValid.value) {
        message.error('请填写必填项')
        return
      }

      loading.value = true
      try {
        // 生成工作流数据
        const flowData = generateQuickDeployFlow(formData.value)

        // 调用API创建工作流
        const { message: msg, fetch } = addWorkflow({
          name: flowData.name,
          content: JSON.stringify(flowData.childNode),
          exec_type: 'auto',
          active: '1',
        })
        msg.value = true
        await fetch()

        message.success('快速部署工作流创建成功')
        emit('close')
      } catch (error) {
        handleError(error)
      } finally {
        loading.value = false
      }
    }

    // 挂载时获取授权列表
    onMounted(() => {
      fetchAccessList()
    })

    return () => (
      <NCard
        bordered={false}
        class="shadow-none"
        content-class="!p-[16px]"
      >
        <NSpin show={loading.value}>
          <div class="space-y-4">
            {/* 域名输入 */}
            <NFormItem label="域名" required>
              <NInput
                v-model:value={formData.value.domains}
                placeholder="输入域名，多个域名用逗号分隔，如: example.com,www.example.com"
                type="textarea"
                rows={2}
              />
            </NFormItem>

            {/* DNS服务商 */}
            <NFormItem label="DNS服务商" required>
              <NSelect
                v-model:value={formData.value.dnsProvider}
                options={dnsProviderOptions}
                placeholder="选择DNS服务商"
                filterable
                renderLabel={(option: any) => (
                  <div class="flex items-center gap-2">
                    <SvgIcon icon={`resources-${option.icon || 'cloudflare'}`} size="1.6rem" />
                    <span>{option.label}</span>
                  </div>
                )}
              />
            </NFormItem>

            {/* DNS授权 */}
            {dnsAccessOptions.value.length > 0 && (
              <NFormItem label="DNS授权">
                <NSelect
                  v-model:value={formData.value.dnsProviderId}
                  options={dnsAccessOptions.value}
                  placeholder="选择已配置的DNS授权（可选）"
                  clearable
                />
              </NFormItem>
            )}

            {dnsAccessOptions.value.length === 0 && formData.value.dnsProvider && (
              <NAlert type="warning" class="mb-3">
                未找到已配置的 {ApiProjectConfig[formData.value.dnsProvider]?.name || ''} 授权，请先在"API授权"页面添加授权
              </NAlert>
            )}

            <NDivider class="!my-3" />

            {/* 部署目标 */}
            <NFormItem label="部署目标" required>
              <NSelect
                v-model:value={formData.value.deployTarget}
                options={deployTargetOptions}
                placeholder="选择部署目标"
                filterable
                renderLabel={(option: any) => (
                  <div class="flex items-center gap-2">
                    <SvgIcon icon={`resources-${option.icon || 'local'}`} size="1.6rem" />
                    <span>{option.label}</span>
                  </div>
                )}
              />
            </NFormItem>

            {/* 部署授权 */}
            {deployAccessOptions.value.length > 0 && (
              <NFormItem label="部署授权">
                <NSelect
                  v-model:value={formData.value.deployProviderId}
                  options={deployAccessOptions.value}
                  placeholder="选择已配置的部署授权（可选）"
                  clearable
                />
              </NFormItem>
            )}

            {deployAccessOptions.value.length === 0 &&
              formData.value.deployTarget &&
              formData.value.deployTarget !== 'localhost' && (
                <NAlert type="warning" class="mb-3">
                  未找到已配置的 {ApiProjectConfig[formData.value.deployTarget]?.name || ''} 授权，请先在"API授权"页面添加授权
                </NAlert>
              )}

            <NDivider class="!my-3" />

            {/* ACME账户 */}
            <NFormItem label="ACME账户">
              <NSelect
                v-model:value={formData.value.ca}
                options={acmeOptions}
                placeholder="选择ACME账户"
              />
            </NFormItem>

            {/* 邮箱 */}
            <NFormItem label="邮箱">
              <NInput
                v-model:value={formData.value.email}
                placeholder="输入邮箱（可选，用于ACME账户注册）"
              />
            </NFormItem>

            {/* 操作按钮 */}
            <div class="flex justify-end gap-3 pt-2">
              <NButton onClick={() => emit('close')}>
                取消
              </NButton>
              <NButton
                type="primary"
                disabled={!isValid.value}
                loading={loading.value}
                onClick={handleSubmit}
              >
                创建工作流
              </NButton>
            </div>
          </div>
        </NSpin>
      </NCard>
    )
  },
})
