import { SimplificationLevel } from './types';

/**
 * 最大字符数
 */
export const MAX_CHARACTERS = 20000;

/**
 * 默认 API 端点 - 使用主项目后端
 */
export const DEFAULT_API_ENDPOINT = '/api/simplify';

/**
 * 简化等级选项
 */
export const SIMPLIFICATION_LEVELS: { value: SimplificationLevel; label: string; description: string }[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'Minor adjustments for clarity'
  },
  {
    value: 'medium',
    label: 'Medium',
    description: 'Simplify sentences and vocabulary'
  },
  {
    value: 'heavy',
    label: 'Heavy',
    description: 'Rewrite with basic, direct language'
  }
];

/**
 * 导出文件格式
 */
export const EXPORT_FORMATS = ['txt', 'md', 'docx'] as const;

/**
 * API 超时时间（毫秒）
 */
export const API_TIMEOUT = 120000; // 120 seconds (2 minutes)
