/**
 * 简化等级
 */
export type SimplificationLevel = 'light' | 'medium' | 'heavy';

/**
 * API 请求接口
 */
export interface SimplifyRequest {
  text: string;              // 原文（必需）
  keywords?: string;         // 关键词，逗号分隔（可选）
  level: SimplificationLevel; // 简化等级
  language?: 'en' | 'zh';    // 语言（可选）
}

/**
 * API 响应接口
 */
export interface SimplifyResponse {
  success: boolean;
  data?: {
    originalText: string;
    simplifiedText: string;
    level: string;
    keywords: string[];
    timestamp: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

/**
 * API 错误接口
 */
export interface ApiError {
  code: string;
  message: string;
}

/**
 * 组件文本标签接口
 */
export interface TextSimplifierLabels {
  title?: string;
  subtitle?: string;
  originalText?: string;
  simplifiedText?: string;
  originalTextPlaceholder?: string;
  simplifiedTextPlaceholder?: string;
  simplificationSettings?: string;
  keywordsLabel?: string;
  keywordsPlaceholder?: string;
  simplifyButton?: string;
  copyButton?: string;
  copied?: string;
  exportButton?: string;
  exportTxt?: string;
  exportMd?: string;
  exportDocx?: string;
  levelLight?: string;
  levelMedium?: string;
  levelHeavy?: string;
  levelDescription?: string;
  processing?: string;
  error?: string;
  success?: string;
  charCount?: string;
  words?: string;
  characters?: string;
  clear?: string;
  uploadFile?: string;
  textExceedsLimit?: string;
  poweredBy?: string;
  // Features section
  features?: {
    title?: string;
    ai?: string;
    aiDesc?: string;
    keywords?: string;
    keywordsDesc?: string;
    levels?: string;
    levelsDesc?: string;
    export?: string;
    exportDesc?: string;
  };
  // Input & Export section
  inputExport?: {
    title?: string;
    inputTitle?: string;
    inputItems?: string[];
    exportTitle?: string;
    exportItems?: string[];
  };
  // How It Works section
  howItWorks?: {
    title?: string;
    step1?: string;
    step1Desc?: string;
    step2?: string;
    step2Desc?: string;
    step3?: string;
    step3Desc?: string;
    step4?: string;
    step4Desc?: string;
  };
  // Perfect For section
  perfectFor?: {
    title?: string;
    students?: string;
    studentsDesc?: string;
    creators?: string;
    creatorsDesc?: string;
    professionals?: string;
    professionalsDesc?: string;
    learners?: string;
    learnersDesc?: string;
    writers?: string;
    writersDesc?: string;
    teams?: string;
    teamsDesc?: string;
  };
  // CTA section
  cta?: {
    title?: string;
    subtitle?: string;
    button?: string;
    stats?: {
      characters?: string;
      levels?: string;
      formats?: string;
    };
  };
}

/**
 * 默认标签（英文）
 */
export const DEFAULT_LABELS: TextSimplifierLabels = {
  title: 'AI Text Simplifier',
  subtitle: 'Simplify complex text with AI-powered assistance',
  originalText: 'Original Text',
  simplifiedText: 'Simplified Text',
  originalTextPlaceholder: 'Enter or paste your text here (up to 20,000 characters)...',
  simplifiedTextPlaceholder: 'Simplified text will appear here...',
  simplificationSettings: 'Simplification Settings',
  keywordsLabel: 'Keywords to Preserve (Optional)',
  keywordsPlaceholder: 'Keywords to preserve (comma-separated, optional)',
  simplifyButton: 'Simplify Text',
  copyButton: 'Copy',
  copied: 'Copied!',
  exportButton: 'Export',
  exportTxt: 'Export as TXT',
  exportMd: 'Export as MD',
  exportDocx: 'Export as DOCX',
  levelLight: 'Light',
  levelMedium: 'Medium',
  levelHeavy: 'Heavy',
  levelDescription: 'Simplification Level',
  processing: 'Processing...',
  error: 'An error occurred',
  success: 'Simplified successfully!',
  charCount: 'characters',
  words: 'words',
  characters: 'characters',
  clear: 'Clear',
  uploadFile: 'Upload File',
  textExceedsLimit: 'Text exceeds maximum length!',
  poweredBy: 'Powered by DeepSeek AI • Maximum {max} characters',
  features: {
    title: 'Powerful Features',
    ai: 'DeepSeek AI',
    aiDesc: 'Powered by DeepSeek AI with intelligent text analysis and processing',
    keywords: 'Preserve Keywords',
    keywordsDesc: 'Specify keywords to keep intact during simplification',
    levels: 'Three Levels',
    levelsDesc: 'Light (80-90%), Medium (60-70%), or Heavy (40-50%) simplification',
    export: 'Export Formats',
    exportDesc: 'Export as TXT, MD, or DOCX files with one click',
  },
  inputExport: {
    title: 'Input & Export Options',
    inputTitle: 'Text Input',
    inputItems: ['Manual paste or type (up to 20,000 characters)', 'Preserves original formatting', 'Real-time character count', 'Instant validation'],
    exportTitle: 'Export Options',
    exportItems: ['Plain Text (.txt)', 'Markdown (.md)', 'Word Document (.docx)', 'Copy to Clipboard'],
  },
  howItWorks: {
    title: 'How It Works',
    step1: 'Paste Text',
    step1Desc: 'Enter or paste your text into the input area',
    step2: 'Set Options',
    step2Desc: 'Add keywords and choose simplification level',
    step3: 'Simplify',
    step3Desc: 'Click the button and let AI process your text',
    step4: 'Export',
    step4Desc: 'Copy or download the simplified result',
  },
  perfectFor: {
    title: 'Perfect For',
    students: 'Students',
    studentsDesc: 'Simplify complex academic papers and course materials for better understanding',
    creators: 'Content Creators',
    creatorsDesc: 'Improve readability and SEO by making content accessible to wider audiences',
    professionals: 'Professionals',
    professionalsDesc: 'Create clear documentation and reports for business communication',
    learners: 'Language Learners',
    learnersDesc: 'Break down complex sentences to improve language comprehension',
    writers: 'Technical Writers',
    writersDesc: 'Make technical documentation more approachable for general audiences',
    teams: 'Content Teams',
    teamsDesc: 'Streamline content creation workflow with AI-assisted simplification',
  },
  cta: {
    title: 'Ready to Simplify Your Text?',
    subtitle: 'Start transforming complex content into clear, accessible language in seconds. No sign-up required.',
    button: 'Get Started Now',
    stats: {
      characters: 'Characters Supported',
      levels: 'Simplification Levels',
      formats: 'Export Formats',
    },
  },
};

/**
 * 主组件 Props
 */
export interface TextSimplifierProps {
  /**
   * 国际化文本标签（可选）
   * 外部开发时使用默认英文，接入时传入翻译文本
   */
  labels?: TextSimplifierLabels;

  /**
   * 后端 API 配置
   */
  apiEndpoint?: string;  // 默认: '/api/simplify'

  /**
   * 其他配置
   */
  maxCharacters?: number;  // 默认: 20000
  theme?: 'light' | 'dark';
}

/**
 * ControlPanel Props
 */
export interface ControlPanelProps {
  keywords: string;
  level: SimplificationLevel;
  onKeywordsChange: (keywords: string) => void;
  onLevelChange: (level: SimplificationLevel) => void;
  onSimplify: () => void;
  isLoading: boolean;
  labels: TextSimplifierLabels;
  layout?: 'horizontal' | 'vertical'; // 布局模式
}

/**
 * InputSection Props
 */
export interface InputSectionProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  maxCharacters: number;
  placeholder: string;
  labels: TextSimplifierLabels;
}

/**
 * OutputSection Props
 */
export interface OutputSectionProps {
  value: string;
  isLoading: boolean;
  onCopy: () => void;
  onExport: (format: 'txt' | 'md' | 'docx') => void;
  placeholder: string;
  labels: TextSimplifierLabels;
}
