import type { GlobalThemeOverrides } from 'naive-ui'

/**
 * AllinSSL 自定义暗色主题配置
 * 蓝紫渐变风格
 */
export const allinSslDarkThemeOverrides: GlobalThemeOverrides = {
  common: {
    bodyColor: "#0f172a", // 页面主体背景色
    cardColor: "#1e293b", // 卡片背景色
    modalColor: "#1e293b", // 弹出框背景色
    hoverColor: "#1e293b", // 悬停背景色
    errorColor: "#ef4444",
    successColor: "#10b981",
    primaryColor: "#818cf8",
    primaryColorHover: "#a5b4fc",
    primaryColorPressed: "#6366f1",
  },
  Card: {
    color: "#1e293b",
    closeIconColor: "#f1f5f9",
  },
  Modal: {
    color: "#1e293b",
    closeIconColor: "#f1f5f9",
    borderColorHover: "#1e293b",
  },
  Layout: {
    color: "#0f172a",
    headerColor: "#1e293b", // 头部背景色
    siderColor: "#1e293b", // 侧边栏背景色
    siderBorderColor: "transparent", // 侧边栏边框颜色
    headerBorderColor: "1px solid #334155", // 头部边框颜色
    textColor: "transparent", // 头部文字颜色
    footerColor: "#0f172a", // 底部背景色
  },
  DataTable: {
    thColor: "#1e293b", // 表格表头背景色
    tdColor: "#1e293b",
    tdColorHover: "#0f172a",
    thColorModal: "#1e293b", // 弹窗内表格表头背景色
    borderColorModal: "#334155",
    loadingColor: "transparent",
    borderColor: "transparent",
  },

  Tag: {
    color: "transparent",
    colorInfo: "transparent",
    border: "1px solid #f1f5f9",
    borderError: "1px solid #ef4444",
    colorError: "#ef4444",
    borderSuccess: "1px solid #10b981",
    textColorSuccess: "#10b981",
    borderWarning: "1px solid #f59e0b",
    textColorWarning: "#f59e0b",
    borderInfo: "1px solid #3b82f6",
    textColorInfo: "#3b82f6",
  },
  // 侧边栏菜单激活项样式
  Menu: {
    itemColorHover: "#1e293b",
    itemColorActive: "#0f172a",
    itemColorActiveHover: "#0f172a",
    itemTextColorActive: "#818cf8",
    itemTextColorActiveHover: "#a5b4fc",
    itemIconColorActive: "#818cf8",
    itemIconColorActiveHover: "#a5b4fc",
    arrowColorActive: "transparent",
    itemTextColorChildActive: "#818cf8",
    itemTextColorChildActiveHover: "#a5b4fc",
  },
  Pagination: {
    itemTextColorHover: "#818cf8",
    itemTextColorPressed: "#818cf8",
    itemTextColorActive: "#fff",
    itemColorActive: "#6366f1",
    itemColorActiveHover: "#6366f1",
    itemBorderActive: "1px solid transparent",
    itemBorder: "1px solid transparent",
    itemBorderRadius: "6px",
    itemColor: "#1e293b",
    itemColorHover: "#1e293b",
    buttonIconColorHover: "#818cf8",
    buttonIconColorPressed: "#818cf8",
    buttonBorder: "transparent",
    buttonBorderHover: "transparent",
    buttonColorPressed: "#1e293b",
    buttonBorderPressed: "transparent",
    buttonColorHover: "#1e293b",
    buttonColor: "#1e293b",
  },
  Tabs: {
    tabTextColorHover: "#f1f5f9",
    tabTextColorActive: "#f1f5f9",
    tabColorSegment: "#0f172a",
  },
  InternalSelection: {
    border: "1px solid #334155",
    borderHover: "1px solid #475569",
    borderActive: "1px solid #818cf8",
    borderFocus: "1px solid #475569",
    colorActive: "#1e293b",
    boxShadowHover: "transparent",
    boxShadowActive: "transparent",
    boxShadowFocus: "transparent",
    caretColor: "#f1f5f9",
    logoColor: "#818cf8",
  },
  InternalSelectMenu: {
    color: "#1e293b",
    optionColorPending: "#0f172a",
    optionColorActivePending: "#0f172a",
    optionTextColorHover: "#f1f5f9",
    optionTextColorActive: "#818cf8",
    optionTextColorPressed: "#f1f5f9",
    optionCheckColor: "#f1f5f9",
  },
  Button: {
    textColorPrimary: "#fff",
    colorPrimary: "#6366f1",
    colorFocusPrimary: "#818cf8",
    colorDisabledPrimary: "#334155",
    colorPressedPrimary: "#4f46e5",
    borderPrimary: "1px solid #6366f1",
    borderRadiusPrimary: "8px",
    colorHoverPrimary: "#818cf8",
    borderHoverPrimary: "1px solid #818cf8",
    borderPressedPrimary: "1px solid #4f46e5",
    borderFocusPrimary: "1px solid #818cf8",
    borderDisabledPrimary: "1px solid #334155",

    colorDefault: "#f1f5f9",
    textColorDefault: "#f1f5f9",
    textColorHover: "#818cf8",
    borderHover: "1px solid #6366f1",
    borderFocus: "1px solid #818cf8",
    borderPressed: "1px solid #818cf8",
    colorFocus: "transparent",
    textColorFocus: "#818cf8",
    rippleColor: "#818cf8",
    rippleColorPrimary: "#4f46e5",
    textColorPressed: "#818cf8",
    colorPressed: "transparent",
    borderRadius: "8px",
  },
  Input: {
    logoColor: "#818cf8",
    color: "#0f172a",
    colorHover: "transparent",
    border: "1px solid #334155",
    colorFocus: "#0f172a",
    borderFocus: "1px solid #818cf8",
    borderHover: "1px solid #475569",
    iconColor: "#818cf8",
    borderHoverError: "1px solid var(--n-error-primary-color)",
    borderFocusError: "1px solid var(--n-error-primary-color)",
    caretColor: "#f1f5f9",
    boxShadowFocus: "transparent",
  },
  Switch: {
    railColorActive: "#6366f1",
    boxShadowFocus: "0 0 8px 0 rgba(99, 102, 241, 0.3)",
  },
  Dialog: {
    color: "#0f172a",
    titleTextColor: "#f1f5f9",
    closeIconColor: "#f1f5f9",
    textColor: "#94a3b8",
    iconColor: "transparent",
  },
  Dropdown: {
    color: "#1e293b",
  },
  Checkbox: {
    borderChecked: "1px solid #6366f1",
    colorChecked: "#6366f1",
  },
  Popover: {
    color: "#1e293b",
    textColor: "#f1f5f9",
  },
}

/**
 * AllinSSL 自定义亮色主题配置
 */
export const allinSslLightThemeOverrides: GlobalThemeOverrides = {
  // 亮色主题暂不需要覆盖
}
