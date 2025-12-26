'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Loader2, Download } from 'lucide-react';
import { PluginData, submitToolRequest } from '@/lib/api';

interface SchemaRendererProps {
  plugin: PluginData;
  locale: string;
}

export default function SchemaRenderer({ plugin, locale }: SchemaRendererProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [options, setOptions] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { schema, apiPath } = plugin;

  // 初始化默认值
  useState(() => {
    const defaults: Record<string, any> = {};
    schema.options?.forEach((opt) => {
      if (opt.default !== undefined) {
        defaults[opt.name] = opt.default;
      }
    });
    setOptions(defaults);
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (schema.upload.multiple) {
      setFiles((prev) => [...prev, ...acceptedFiles].slice(0, schema.upload.maxFiles));
    } else {
      setFiles(acceptedFiles.slice(0, 1));
    }
    setError(null);
  }, [schema.upload.multiple, schema.upload.maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: getAcceptTypes(schema.upload.types),
    maxSize: schema.upload.maxSize,
    multiple: schema.upload.multiple
  });

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOptionChange = (name: string, value: any) => {
    setOptions((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      setError(locale === 'zh' ? '请先上传文件' : locale === 'es' ? 'Por favor sube un archivo primero' : 'Please upload a file first');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      if (schema.upload.multiple) {
        files.forEach((file) => formData.append('files', file));
      } else {
        formData.append('file', files[0]);
      }

      Object.entries(options).forEach(([key, value]) => {
        formData.append(key, String(value));
      });

      const blob = await submitToolRequest(apiPath, formData);

      // 下载文件
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = getOutputFilename(plugin);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // 清空文件
      setFiles([]);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 文件上传区域 */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">
          {isDragActive
            ? (locale === 'zh' ? '放开以上传文件' : locale === 'es' ? 'Suelta para subir' : 'Drop to upload')
            : (locale === 'zh' ? '拖拽文件到此处，或点击选择' : locale === 'es' ? 'Arrastra archivos aquí o haz clic para seleccionar' : 'Drag files here or click to select')}
        </p>
        <p className="text-sm text-gray-400 mt-2">
          {schema.upload.multiple
            ? `${locale === 'zh' ? '最多' : locale === 'es' ? 'Máximo' : 'Max'} ${schema.upload.maxFiles} ${locale === 'zh' ? '个文件' : locale === 'es' ? 'archivos' : 'files'}`
            : ''}
        </p>
      </div>

      {/* 已选文件列表 */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <span className="text-sm text-gray-700 truncate">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500"
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 选项区域 */}
      {schema.options && schema.options.length > 0 && (
        <div className="space-y-4">
          {schema.options.map((opt) => (
            <div key={opt.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {opt.label}
              </label>
              {renderOptionInput(opt, options[opt.name], (value) => handleOptionChange(opt.name, value))}
            </div>
          ))}
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* 提交按钮 */}
      <button
        onClick={handleSubmit}
        disabled={loading || files.length === 0}
        className="w-full py-3 px-6 bg-primary text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            {locale === 'zh' ? '处理中...' : locale === 'es' ? 'Procesando...' : 'Processing...'}
          </>
        ) : (
          <>
            <Download className="w-5 h-5" />
            {schema.submitText}
          </>
        )}
      </button>
    </div>
  );
}

function getAcceptTypes(types: string[]): Record<string, string[]> {
  const accept: Record<string, string[]> = {};

  types.forEach((type) => {
    if (type === 'pdf') {
      accept['application/pdf'] = ['.pdf'];
    } else if (type.startsWith('image/')) {
      accept[type] = [];
    } else if (type === 'image') {
      accept['image/*'] = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
    }
  });

  return accept;
}

function getOutputFilename(plugin: PluginData): string {
  const { schema, slug } = plugin;
  const ext = schema.outputType === 'zip' ? 'zip' : slug.includes('pdf') ? 'pdf' : 'png';
  return `${slug}-result.${ext}`;
}

function renderOptionInput(
  opt: PluginData['schema']['options'][0],
  value: any,
  onChange: (value: any) => void
) {
  switch (opt.type) {
    case 'checkbox':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <span className="text-sm text-gray-700">{opt.checkboxLabel || opt.label}</span>
        </label>
      );

    case 'number':
      return (
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={opt.placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      );

    case 'select':
      return (
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="">--</option>
          {opt.choices?.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
      );

    case 'range':
      return (
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={opt.min || 0}
            max={opt.max || 100}
            value={value || opt.default || 50}
            onChange={(e) => onChange(Number(e.target.value))}
            className="flex-1"
          />
          <span className="text-sm text-gray-600 w-12 text-right">{value || opt.default || 50}%</span>
        </div>
      );

    default:
      return (
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={opt.placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      );
  }
}
