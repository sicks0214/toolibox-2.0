'use client';

import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { TextSimplifierProps, DEFAULT_LABELS, SimplificationLevel, SimplifyResponse } from './types';
import { MAX_CHARACTERS, DEFAULT_API_ENDPOINT } from './constants';
import {
  copyToClipboard,
  exportAsTxt,
  exportAsMarkdown,
  exportAsDocx,
} from './utils';
import { ControlPanel } from './ControlPanel';
import { InputSection } from './InputSection';
import { OutputSection } from './OutputSection';
import {
  Sparkles,
  Shield,
  Zap,
  Globe,
  FileType,
  Upload,
  Download,
  ArrowRight,
  Layers,
  Users,
  BookOpen,
  Lightbulb,
  BarChart3,
  MessageSquare,
  FileText,
  ArrowRightCircle
} from 'lucide-react';

const TextSimplifier: React.FC<TextSimplifierProps> = ({
  labels,
  apiEndpoint = DEFAULT_API_ENDPOINT,
  maxCharacters = MAX_CHARACTERS,
  theme = 'light',
}) => {
  // 合并标签
  const mergedLabels = useMemo(() => ({
    ...DEFAULT_LABELS,
    ...labels,
  }), [labels]);

  // 状态管理
  const [originalText, setOriginalText] = useState('');
  const [simplifiedText, setSimplifiedText] = useState('');
  const [keywords, setKeywords] = useState('');
  const [level, setLevel] = useState<SimplificationLevel>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 处理简化
  const handleSimplify = async () => {
    // 验证输入
    if (!originalText.trim()) {
      setError('Please enter text to simplify');
      return;
    }

    if (originalText.length > maxCharacters) {
      setError(`Text exceeds maximum length of ${maxCharacters} characters`);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const request = {
        text: originalText,
        keywords: keywords.trim() || undefined,
        level,
      };

      const response = await axios.post<SimplifyResponse>(apiEndpoint, request, {
        timeout: 120000, // 120 seconds (2 minutes) - 增加到2分钟以处理长文本
      });

      if (response.data.success && response.data.data) {
        setSimplifiedText(response.data.data.simplifiedText);
      } else {
        setError(response.data.error?.message || 'Failed to simplify text');
      }
    } catch (err: any) {
      console.error('Simplify error:', err);
      if (err.code === 'ECONNABORTED') {
        setError('Request timeout. Please try again.');
      } else if (err.response) {
        setError(err.response.data?.error?.message || 'Server error occurred');
      } else if (err.request) {
        setError('No response from server. Please check your connection.');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 清空原文
  const handleClear = () => {
    setOriginalText('');
    setSimplifiedText('');
    setError(null);
  };

  // 复制到剪贴板
  const handleCopy = async () => {
    const success = await copyToClipboard(simplifiedText);
    if (!success) {
      setError('Failed to copy to clipboard');
    }
  };

  // 导出
  const handleExport = async (format: 'txt' | 'md' | 'docx') => {
    try {
      const timestamp = new Date().toISOString().split('T')[0];

      switch (format) {
        case 'txt':
          exportAsTxt(simplifiedText, `simplified-text-${timestamp}.txt`);
          break;
        case 'md':
          exportAsMarkdown(
            originalText,
            simplifiedText,
            `simplified-text-${timestamp}.md`
          );
          break;
        case 'docx':
          await exportAsDocx(
            originalText,
            simplifiedText,
            `simplified-text-${timestamp}.docx`
          );
          break;
      }
    } catch (err) {
      console.error('Export error:', err);
      setError('Failed to export file');
    }
  };

  // 判断右侧显示什么：控制面板 或 输出结果
  const showOutput = simplifiedText || isLoading;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* 标题 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-neutral-900 mb-2">
          {mergedLabels.title}
        </h1>
        <p className="text-lg text-gray-600">
          {mergedLabels.subtitle}
        </p>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="font-medium">{mergedLabels.error}</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-4 text-red-700 hover:text-red-900"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* 主布局：左右对称布局，统一高度 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：输入框 - 使用固定高度 */}
        <div className="bg-white rounded-lg shadow-md p-6 h-[600px]">
          <InputSection
            value={originalText}
            onChange={setOriginalText}
            onClear={handleClear}
            maxCharacters={maxCharacters}
            placeholder={mergedLabels.originalTextPlaceholder || ''}
            labels={mergedLabels}
          />
        </div>

        {/* 右侧：控制面板 或 输出结果 - 使用固定高度 */}
        <div className="bg-white rounded-lg shadow-md p-6 h-[600px]">
          {!showOutput ? (
            /* 显示控制面板 */
            <ControlPanel
              keywords={keywords}
              level={level}
              onKeywordsChange={setKeywords}
              onLevelChange={setLevel}
              onSimplify={handleSimplify}
              isLoading={isLoading}
              labels={mergedLabels}
              layout="vertical"
            />
          ) : (
            /* 显示输出结果 */
            <OutputSection
              value={simplifiedText}
              isLoading={isLoading}
              onCopy={handleCopy}
              onExport={handleExport}
              placeholder={mergedLabels.simplifiedTextPlaceholder || ''}
              labels={mergedLabels}
            />
          )}
        </div>
      </div>

      {/* 底部说明 */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>{(mergedLabels.poweredBy || 'Powered by DeepSeek AI • Maximum {max} characters').replace('{max}', maxCharacters.toLocaleString())}</p>
      </div>

      {/* Section 5: Features Showcase */}
      <div className="mt-12 bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
          {mergedLabels.features?.title || 'Powerful Features'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-blue-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{mergedLabels.features?.ai || 'DeepSeek AI'}</h4>
            <p className="text-sm text-gray-600">
              {mergedLabels.features?.aiDesc || 'Powered by DeepSeek AI with intelligent text analysis and processing'}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-green-100 to-green-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{mergedLabels.features?.keywords || 'Preserve Keywords'}</h4>
            <p className="text-sm text-gray-600">
              {mergedLabels.features?.keywordsDesc || 'Specify keywords to keep intact during simplification'}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-cyan-100 to-cyan-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-cyan-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{mergedLabels.features?.levels || 'Three Levels'}</h4>
            <p className="text-sm text-gray-600">
              {mergedLabels.features?.levelsDesc || 'Light (80-90%), Medium (60-70%), or Heavy (40-50%) simplification'}
            </p>
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-br from-orange-100 to-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-orange-600" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">{mergedLabels.features?.export || 'Export Formats'}</h4>
            <p className="text-sm text-gray-600">
              {mergedLabels.features?.exportDesc || 'Export as TXT, MD, or DOCX files with one click'}
            </p>
          </div>
        </div>
      </div>

      {/* Section 6: Supported Formats */}
      <div className="mt-8 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl shadow-md p-8 border border-blue-100">
        <div className="flex items-center justify-center gap-3 mb-8">
          <FileType className="w-7 h-7 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">
            {mergedLabels.inputExport?.title || 'Input & Export Options'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-green-600" />
              {mergedLabels.inputExport?.inputTitle || 'Text Input'}
            </h4>
            <ul className="space-y-3">
              {(mergedLabels.inputExport?.inputItems || ['Manual paste or type (up to 20,000 characters)', 'Preserves original formatting', 'Real-time character count', 'Instant validation']).map((format) => (
                <li key={format} className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  {format}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Download className="w-5 h-5 text-blue-600" />
              {mergedLabels.inputExport?.exportTitle || 'Export Options'}
            </h4>
            <ul className="space-y-3">
              {(mergedLabels.inputExport?.exportItems || ['Plain Text (.txt)', 'Markdown (.md)', 'Word Document (.docx)', 'Copy to Clipboard']).map((format) => (
                <li key={format} className="flex items-center gap-3 text-gray-700">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  {format}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section 7: How It Works */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Layers className="w-7 h-7 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-900">
            {mergedLabels.howItWorks?.title || 'How It Works'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              step: '1',
              title: mergedLabels.howItWorks?.step1 || 'Paste Text',
              description: mergedLabels.howItWorks?.step1Desc || 'Enter or paste your text into the input area'
            },
            {
              step: '2',
              title: mergedLabels.howItWorks?.step2 || 'Set Options',
              description: mergedLabels.howItWorks?.step2Desc || 'Add keywords and choose simplification level'
            },
            {
              step: '3',
              title: mergedLabels.howItWorks?.step3 || 'Simplify',
              description: mergedLabels.howItWorks?.step3Desc || 'Click the button and let AI process your text'
            },
            {
              step: '4',
              title: mergedLabels.howItWorks?.step4 || 'Export',
              description: mergedLabels.howItWorks?.step4Desc || 'Copy or download the simplified result'
            }
          ].map((item, idx) => (
            <div key={idx} className="relative">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 text-center border border-green-100">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full flex items-center justify-center font-bold mx-auto mb-3">
                  {item.step}
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              {idx < 3 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 text-green-500">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 8: Perfect For */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <div className="flex items-center justify-center gap-3 mb-8">
          <Users className="w-7 h-7 text-orange-600" />
          <h3 className="text-2xl font-bold text-gray-900">
            {mergedLabels.perfectFor?.title || 'Perfect For'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              title: mergedLabels.perfectFor?.students || 'Students',
              description: mergedLabels.perfectFor?.studentsDesc || 'Simplify complex academic papers and course materials for better understanding'
            },
            {
              icon: Lightbulb,
              title: mergedLabels.perfectFor?.creators || 'Content Creators',
              description: mergedLabels.perfectFor?.creatorsDesc || 'Improve readability and SEO by making content accessible to wider audiences'
            },
            {
              icon: BarChart3,
              title: mergedLabels.perfectFor?.professionals || 'Professionals',
              description: mergedLabels.perfectFor?.professionalsDesc || 'Create clear documentation and reports for business communication'
            },
            {
              icon: MessageSquare,
              title: mergedLabels.perfectFor?.learners || 'Language Learners',
              description: mergedLabels.perfectFor?.learnersDesc || 'Break down complex sentences to improve language comprehension'
            },
            {
              icon: FileText,
              title: mergedLabels.perfectFor?.writers || 'Technical Writers',
              description: mergedLabels.perfectFor?.writersDesc || 'Make technical documentation more approachable for general audiences'
            },
            {
              icon: Sparkles,
              title: mergedLabels.perfectFor?.teams || 'Content Teams',
              description: mergedLabels.perfectFor?.teamsDesc || 'Streamline content creation workflow with AI-assisted simplification'
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-lg p-6 border border-orange-100 hover:shadow-lg transition-shadow">
                <Icon className="w-8 h-8 text-orange-600 mb-3" />
                <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 9: Getting Started */}
      <div className="mt-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg p-8 md:p-12">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            {mergedLabels.cta?.title || 'Ready to Simplify Your Text?'}
          </h3>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            {mergedLabels.cta?.subtitle || 'Start transforming complex content into clear, accessible language in seconds. No sign-up required.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg">
              {mergedLabels.cta?.button || 'Get Started Now'}
              <ArrowRightCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-white">
            <div>
              <p className="text-3xl font-bold">20,000</p>
              <p className="text-sm text-blue-100">{mergedLabels.cta?.stats?.characters || 'Characters Supported'}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-blue-100">{mergedLabels.cta?.stats?.levels || 'Simplification Levels'}</p>
            </div>
            <div>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-blue-100">{mergedLabels.cta?.stats?.formats || 'Export Formats'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextSimplifier;
