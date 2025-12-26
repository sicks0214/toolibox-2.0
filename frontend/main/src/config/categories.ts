// 分类配置 - 统一管理所有分类元数据
// 新增分类只需在此文件添加配置

export interface CategoryConfig {
  id: string;           // URL 中的分类 ID，如 'pdf-tools'
  apiCategory: string;  // API 返回的分类名，如 'pdf'
  icon: string;
  gradient: string;
  name: Record<string, string>;
  description: Record<string, string>;
}

export const categories: CategoryConfig[] = [
  {
    id: 'pdf-tools',
    apiCategory: 'pdf',
    icon: '📄',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #C92A2A 100%)',
    name: { en: 'PDF Tools', zh: 'PDF 工具', es: 'Herramientas PDF' },
    description: {
      en: 'Merge, compress, split and convert PDF files',
      zh: '合并、压缩、拆分和转换 PDF 文件',
      es: 'Fusionar, comprimir, dividir y convertir archivos PDF'
    }
  },
  {
    id: 'image-tools',
    apiCategory: 'image',
    icon: '🖼️',
    gradient: 'linear-gradient(135deg, #51CF66 0%, #2F9E44 100%)',
    name: { en: 'Image Tools', zh: '图像工具', es: 'Herramientas de imagen' },
    description: {
      en: 'Resize, compress, convert images and remove background',
      zh: '调整尺寸、压缩、转换图像和去除背景',
      es: 'Redimensionar, comprimir, convertir imágenes y eliminar fondo'
    }
  }
];

// 辅助函数
export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find(c => c.id === id);
}

export function getCategoryByApiCategory(apiCategory: string): CategoryConfig | undefined {
  return categories.find(c => c.apiCategory === apiCategory);
}

export function getCategoryName(category: CategoryConfig, locale: string): string {
  return category.name[locale] || category.name['en'];
}

export function getCategoryDescription(category: CategoryConfig, locale: string): string {
  return category.description[locale] || category.description['en'];
}
