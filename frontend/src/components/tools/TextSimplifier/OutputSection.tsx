'use client';

import React, { useState } from 'react';
import { OutputSectionProps } from './types';
import { countCharacters, countWords } from './utils';

export const OutputSection: React.FC<OutputSectionProps> = ({
  value,
  isLoading,
  onCopy,
  onExport,
  placeholder,
  labels,
}) => {
  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleCopy = async () => {
    onCopy();
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
  };

  const handleExport = (format: 'txt' | 'md' | 'docx') => {
    onExport(format);
    setShowExportMenu(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* 标题栏 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '40px',
        marginBottom: '16px'
      }}>
        <h3 className="text-lg font-semibold text-neutral-900">{labels.simplifiedText || 'Simplified Text'}</h3>

        {value && !isLoading && (
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary transition-colors"
            >
              {showCopySuccess ? (labels.copied || 'Copied!') : labels.copyButton}
            </button>

            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:border-primary hover:text-primary transition-colors"
              >
                {labels.exportButton}
              </button>

              {showExportMenu && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  marginTop: '8px',
                  width: '192px',
                  background: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  border: '1px solid #e5e7eb',
                  zIndex: 10
                }}>
                  <button
                    onClick={() => handleExport('txt')}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: '#374151',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px 8px 0 0',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {labels.exportTxt}
                  </button>
                  <button
                    onClick={() => handleExport('md')}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: '#374151',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {labels.exportMd}
                  </button>
                  <button
                    onClick={() => handleExport('docx')}
                    style={{
                      display: 'block',
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 16px',
                      fontSize: '14px',
                      color: '#374151',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '0 0 8px 8px',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {labels.exportDocx}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 主内容区 - 使用固定高度和强制滚动 */}
      <div style={{
        flex: 1,
        marginBottom: '16px',
        overflow: 'hidden'
      }}>
        {isLoading ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            background: '#f9fafb',
            borderRadius: '8px',
            border: '1px solid #d1d5db'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#6b7280' }}>
              <svg
                className="animate-spin h-12 w-12 text-primary mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p style={{ fontSize: '18px', fontWeight: 500 }}>{labels.processing}</p>
            </div>
          </div>
        ) : (
          <div style={{
            height: '100%',
            overflowY: 'scroll',
            overflowX: 'hidden',
            background: 'white',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            padding: '12px 16px',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap'
          }}>
            {value ? (
              <div style={{
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#111827',
                fontSize: '15px',
                lineHeight: '1.7'
              }}>
                {value}
              </div>
            ) : (
              <p style={{ color: '#9ca3af' }}>{placeholder}</p>
            )}
          </div>
        )}
      </div>

      {/* 底部统计信息 */}
      <div style={{
        height: '24px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        fontSize: '14px'
      }}>
        {value && !isLoading ? (
          <div style={{ color: '#6b7280' }}>
            <span style={{ fontWeight: 500 }}>{countWords(value)}</span> {labels.words || 'words'}
            {' • '}
            <span style={{ fontWeight: 500 }}>{countCharacters(value)}</span> {labels.characters || 'characters'}
          </div>
        ) : null}
      </div>
    </div>
  );
};
