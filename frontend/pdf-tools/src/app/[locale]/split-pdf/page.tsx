'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslations, useLocale } from 'next-intl';
import { PDFDocument } from 'pdf-lib';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import {
  DocumentIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';

interface SplitResult {
  name: string;
  blob: Blob;
}

export default function SplitPDFPage() {
  const t = useTranslations('tools.splitPdf');
  const common = useTranslations('common');
  const locale = useLocale();

  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitMode, setSplitMode] = useState<'all' | 'range'>('all');
  const [pageRange, setPageRange] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<SplitResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const pdfFile = acceptedFiles.find((f) => f.type === 'application/pdf');
    if (!pdfFile) return;

    setFile(pdfFile);
    setResults([]);
    setError(null);

    try {
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
    } catch (err) {
      console.error('Load error:', err);
      setError(common('error'));
    }
  }, [common]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
  });

  const parsePageRange = (range: string, maxPages: number): number[] => {
    const pages: Set<number> = new Set();
    const parts = range.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(Number);
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = Math.max(1, start); i <= Math.min(maxPages, end); i++) {
            pages.add(i);
          }
        }
      } else {
        const num = Number(part);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const splitPDF = async () => {
    if (!file) return;

    setIsProcessing(true);
    setError(null);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const totalPages = pdf.getPageCount();
      const splitResults: SplitResult[] = [];

      if (splitMode === 'all') {
        // Split every page
        for (let i = 0; i < totalPages; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(pdf, [i]);
          newPdf.addPage(page);
          const pdfBytes = await newPdf.save();
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
          splitResults.push({
            name: `page_${i + 1}.pdf`,
            blob,
          });
        }
      } else {
        // Split by range
        const pages = parsePageRange(pageRange, totalPages);
        if (pages.length === 0) {
          setError(locale === 'en' ? 'Invalid page range' : '无效的页面范围');
          setIsProcessing(false);
          return;
        }

        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(
          pdf,
          pages.map((p) => p - 1)
        );
        copiedPages.forEach((page) => newPdf.addPage(page));
        const pdfBytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        splitResults.push({
          name: `pages_${pages.join('_')}.pdf`,
          blob,
        });
      }

      setResults(splitResults);
    } catch (err) {
      console.error('Split error:', err);
      setError(common('error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadResult = (result: SplitResult) => {
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadAll = async () => {
    for (const result of results) {
      downloadResult(result);
      await new Promise((r) => setTimeout(r, 300)); // Small delay between downloads
    }
  };

  const clearAll = () => {
    setFile(null);
    setPageCount(0);
    setResults([]);
    setError(null);
    setPageRange('');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-8 px-6">
        <div className="mx-auto max-w-4xl">
          {/* Title */}
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">✂️</span>
            <h1 className="text-3xl font-bold text-neutral mb-2">{t('title')}</h1>
            <p className="text-gray-600">{t('description')}</p>
          </div>

          {/* Dropzone */}
          {!file && (
            <div
              {...getRootProps()}
              className={`dropzone mb-6 ${isDragActive ? 'dropzone-active' : ''}`}
            >
              <input {...getInputProps()} />
              <DocumentIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                {isDragActive
                  ? locale === 'en' ? 'Drop file here...' : '释放文件...'
                  : common('dropFiles')}
              </p>
              <button type="button" className="btn-primary">
                {common('selectFiles')}
              </button>
            </div>
          )}

          {/* File Info */}
          {file && !results.length && (
            <div className="mb-6">
              <div className="file-item mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📄</span>
                  <div>
                    <p className="font-medium text-neutral">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {pageCount} {locale === 'en' ? 'pages' : '页'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-500 hover:text-red-600"
                >
                  {common('clear')}
                </button>
              </div>

              {/* Split Mode */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 mb-6">
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="splitMode"
                      checked={splitMode === 'all'}
                      onChange={() => setSplitMode('all')}
                      className="w-4 h-4 text-pdf"
                    />
                    <span className="font-medium">{t('splitAll')}</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="splitMode"
                      checked={splitMode === 'range'}
                      onChange={() => setSplitMode('range')}
                      className="w-4 h-4 text-pdf"
                    />
                    <span className="font-medium">{t('splitRange')}</span>
                  </label>

                  {splitMode === 'range' && (
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder={t('pageRange')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pdf/50 focus:border-pdf"
                    />
                  )}
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <div className="text-center">
                <button
                  onClick={splitPDF}
                  disabled={isProcessing}
                  className="btn-primary px-8 py-3 text-lg"
                >
                  {isProcessing ? common('processing') : t('splitButton')}
                </button>
              </div>
            </div>
          )}

          {/* Results */}
          {results.length > 0 && (
            <div className="text-center p-8 bg-green-50 border border-green-200 rounded-xl">
              <span className="text-5xl mb-4 block">✅</span>
              <h3 className="text-xl font-semibold text-green-800 mb-4">
                {t('resultTitle')}
              </h3>

              <div className="mb-6 max-h-64 overflow-y-auto">
                <div className="space-y-2">
                  {results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg"
                    >
                      <span className="text-sm font-medium">{result.name}</span>
                      <button
                        onClick={() => downloadResult(result)}
                        className="text-pdf hover:text-pdf-dark"
                      >
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                {results.length > 1 && (
                  <button
                    onClick={downloadAll}
                    className="btn-primary inline-flex items-center gap-2"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                    {common('downloadAll')}
                  </button>
                )}
                <button onClick={clearAll} className="btn-secondary">
                  {common('clear')}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
