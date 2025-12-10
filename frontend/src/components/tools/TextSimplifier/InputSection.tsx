'use client';

import React from 'react';
import { InputSectionProps } from './types';
import { countCharacters, countWords } from './utils';

export const InputSection: React.FC<InputSectionProps> = ({
  value,
  onChange,
  onClear,
  maxCharacters,
  placeholder,
  labels,
}) => {
  const charCount = countCharacters(value);
  const wordCount = countWords(value);
  const isOverLimit = charCount > maxCharacters;

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
        <h3 className="text-lg font-semibold text-neutral-900">{labels.originalText || 'Original Text'}</h3>
        <button
          onClick={onClear}
          disabled={!value}
          style={{
            padding: '6px 12px',
            fontSize: '14px',
            color: !value ? '#d1d5db' : '#6b7280',
            background: 'transparent',
            border: !value ? '1px solid #e5e7eb' : '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: !value ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            opacity: !value ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (value) {
              e.currentTarget.style.color = '#dc2626';
              e.currentTarget.style.borderColor = '#dc2626';
            }
          }}
          onMouseLeave={(e) => {
            if (value) {
              e.currentTarget.style.color = '#6b7280';
              e.currentTarget.style.borderColor = '#d1d5db';
            }
          }}
        >
          {labels.clear}
        </button>
      </div>

      {/* 主内容区 - 文本输入框 */}
      <div style={{
        flex: 1,
        marginBottom: '16px'
      }}>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '100%',
            padding: '12px 16px',
            border: isOverLimit ? '1px solid #ef4444' : '1px solid #d1d5db',
            borderRadius: '8px',
            resize: 'none',
            outline: 'none',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '15px',
            lineHeight: '1.7',
            transition: 'border-color 0.2s, box-shadow 0.2s',
            overflowY: 'scroll'
          }}
          onFocus={(e) => {
            if (!isOverLimit) {
              e.currentTarget.style.borderColor = '#4A9C82';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 156, 130, 0.1)';
            } else {
              e.currentTarget.style.borderColor = '#ef4444';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = isOverLimit ? '#ef4444' : '#d1d5db';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* 底部统计信息 */}
      <div style={{
        height: '24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '14px'
      }}>
        <div style={{ color: '#6b7280' }}>
          <span style={{ fontWeight: 500 }}>{wordCount}</span> {labels.words || 'words'}
          {' • '}
          <span style={{
            fontWeight: 500,
            color: isOverLimit ? '#dc2626' : '#6b7280'
          }}>
            {charCount}
          </span>
          {' / '}
          <span>{maxCharacters}</span> {labels.charCount}
        </div>

        {isOverLimit && (
          <span style={{
            color: '#dc2626',
            fontSize: '14px',
            fontWeight: 500
          }}>
            {labels.textExceedsLimit || 'Text exceeds maximum length!'}
          </span>
        )}
      </div>
    </div>
  );
};
