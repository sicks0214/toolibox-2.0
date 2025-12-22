'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  DocumentIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function MergePDFPage() {
  const t = useTranslations('tools.mergePdf');
  const common = useTranslations('common');
  const locale = useLocale();

  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const pdfFiles = acceptedFiles
      .filter((file) => file.type === 'application/pdf')
      .map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
        size: file.size,
      }));
    setFiles((prev) => [...prev, ...pdfFiles]);
    setResult(null);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
  });

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const mergePDFs = async () => {
    if (files.length < 2) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 创建FormData并添加文件
      const formData = new FormData();
      files.forEach(({ file }) => {
        formData.append('files', file);
      });

      // 调用后端API
      const response = await fetch('/api/pdf/merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to merge PDFs');
      }

      // 获取返回的PDF文件
      const blob = await response.blob();
      setResult(blob);
    } catch (err) {
      console.error('Merge error:', err);
      setError(common('error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = () => {
    if (!result) return;
    const url = URL.createObjectURL(result);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Title */}
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">📄</span>
            <h1 className="text-3xl font-bold text-neutral mb-2">{t('title')}</h1>
            <p className="text-gray-600">{t('description')}</p>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`dropzone mb-6 ${isDragActive ? 'dropzone-active' : ''}`}
          >
            <input {...getInputProps()} />
            <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {isDragActive
                ? locale === 'en' ? 'Drop files here...' : '释放文件...'
                : common('dropFiles')}
            </p>
            <button type="button" className="btn-primary">
              {common('selectFiles')}
            </button>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-600">{t('instruction')}</p>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  {common('clear')}
                </button>
              </div>

              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={file.id} className="file-item">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📄</span>
                      <div>
                        <p className="font-medium text-neutral truncate max-w-xs">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => moveFile(index, 'up')}
                        disabled={index === 0}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowsUpDownIcon className="h-4 w-4 rotate-180" />
                      </button>
                      <button
                        onClick={() => moveFile(index, 'down')}
                        disabled={index === files.length - 1}
                        className="p-1.5 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ArrowsUpDownIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          {/* Action Button */}
          {files.length >= 2 && !result && (
            <div className="text-center">
              <button
                onClick={mergePDFs}
                disabled={isProcessing}
                className="btn-primary px-8 py-3 text-lg"
              >
                {isProcessing ? common('processing') : t('mergeButton')}
              </button>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="text-center p-8 bg-green-50 border border-green-200 rounded-xl">
              <span className="text-5xl mb-4 block">✅</span>
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                {t('resultTitle')}
              </h3>
              <button
                onClick={downloadResult}
                className="btn-primary inline-flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                {common('download')}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
