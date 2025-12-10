'use client';

import React from 'react';
import { ControlPanelProps } from './types';
import { SIMPLIFICATION_LEVELS } from './constants';

export const ControlPanel: React.FC<ControlPanelProps> = ({
  keywords,
  level,
  onKeywordsChange,
  onLevelChange,
  onSimplify,
  isLoading,
  labels,
  layout = 'vertical',
}) => {
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
        <h3 className="text-lg font-semibold text-neutral-900">{labels.simplificationSettings || 'Simplification Settings'}</h3>
      </div>

      {/* 主内容区 */}
      <div style={{
        flex: 1,
        marginBottom: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* 关键词输入框 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '8px'
          }}>
            {labels.keywordsLabel || 'Keywords to Preserve (Optional)'}
          </label>
          <textarea
            value={keywords}
            onChange={(e) => onKeywordsChange(e.target.value)}
            placeholder={labels.keywordsPlaceholder}
            disabled={isLoading}
            style={{
              flex: 1,
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              resize: 'none',
              outline: 'none',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: '15px',
              lineHeight: '1.7',
              transition: 'border-color 0.2s, box-shadow 0.2s',
              opacity: isLoading ? 0.5 : 1,
              cursor: isLoading ? 'not-allowed' : 'text',
              overflowY: 'scroll'
            }}
            onFocus={(e) => {
              if (!isLoading) {
                e.currentTarget.style.borderColor = '#4A9C82';
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74, 156, 130, 0.1)';
              }
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* 简化等级选择 */}
        <div>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: 500,
            color: '#374151',
            marginBottom: '8px'
          }}>
            {labels.levelDescription}
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            {SIMPLIFICATION_LEVELS.map((option) => (
              <button
                key={option.value}
                onClick={() => onLevelChange(option.value)}
                disabled={isLoading}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  textAlign: 'center',
                  fontSize: '14px',
                  background: level === option.value ? '#4A9C82' : '#f3f4f6',
                  color: level === option.value ? 'white' : '#374151',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.5 : 1
                }}
                title={option.description}
                onMouseEnter={(e) => {
                  if (!isLoading && level !== option.value) {
                    e.currentTarget.style.background = '#e5e7eb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && level !== option.value) {
                    e.currentTarget.style.background = '#f3f4f6';
                  }
                }}
              >
                {String(labels[`level${option.value.charAt(0).toUpperCase() + option.value.slice(1)}` as 'levelLight' | 'levelMedium' | 'levelHeavy'] || option.label)}
              </button>
            ))}
          </div>
        </div>

        {/* 简化按钮 */}
        <div>
          <button
            onClick={onSimplify}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px 16px',
              background: '#4A9C82',
              color: 'white',
              fontWeight: 500,
              borderRadius: '8px',
              transition: 'background 0.2s',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.5 : 1,
              fontSize: '16px'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#3a7d68';
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = '#4A9C82';
              }
            }}
          >
            {isLoading ? (
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg
                  className="animate-spin"
                  style={{
                    marginLeft: '-4px',
                    marginRight: '12px',
                    height: '20px',
                    width: '20px',
                    color: 'white'
                  }}
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
                {labels.processing}
              </span>
            ) : (
              labels.simplifyButton
            )}
          </button>
        </div>
      </div>

      {/* 底部占位 */}
      <div style={{ height: '24px' }}></div>
    </div>
  );
};
