import fs from 'fs';
import path from 'path';

export interface PluginConfig {
  slug: string;
  category: string;
  apiPath: string;
  order: number;
}

export interface PluginUI {
  title: Record<string, string>;
  description: Record<string, string>;
  h1: Record<string, string>;
  icon: string;
  faq: Record<string, Array<{ question: string; answer: string }>>;
  categoryName?: Record<string, string>;
  [key: string]: any;
}

export interface PluginSchema {
  upload: {
    multiple: boolean;
    maxFiles: number;
    types: string[];
    maxSize: number;
  };
  options: Array<{
    name: string;
    type: string;
    label: Record<string, string>;
    [key: string]: any;
  }>;
  submitText: Record<string, string>;
  outputType: string;
}

export interface Plugin {
  config: PluginConfig;
  ui: PluginUI;
  schema: PluginSchema;
  handler: any;
  dirName: string;
}

const PLUGINS_DIR = path.join(__dirname, '../plugins');

export function loadPlugins(): Plugin[] {
  const plugins: Plugin[] = [];

  if (!fs.existsSync(PLUGINS_DIR)) {
    console.warn('Plugins directory not found:', PLUGINS_DIR);
    return plugins;
  }

  const dirs = fs.readdirSync(PLUGINS_DIR);

  for (const dir of dirs) {
    const pluginPath = path.join(PLUGINS_DIR, dir);

    if (!fs.statSync(pluginPath).isDirectory()) continue;

    try {
      const configPath = path.join(pluginPath, 'plugin.json');
      const uiPath = path.join(pluginPath, 'ui.json');
      const schemaPath = path.join(pluginPath, 'schema.json');
      const handlerPath = path.join(pluginPath, 'handler');

      if (!fs.existsSync(configPath)) {
        console.warn(`Missing plugin.json in ${dir}`);
        continue;
      }

      const config: PluginConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      const ui: PluginUI = fs.existsSync(uiPath)
        ? JSON.parse(fs.readFileSync(uiPath, 'utf-8'))
        : {};
      const schema: PluginSchema = fs.existsSync(schemaPath)
        ? JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))
        : {};

      let handler = null;
      try {
        handler = require(handlerPath).default;
      } catch (e) {
        console.warn(`No handler found for ${dir}`);
      }

      plugins.push({
        config,
        ui,
        schema,
        handler,
        dirName: dir
      });

      console.log(`✅ Loaded plugin: ${dir}`);
    } catch (error) {
      console.error(`Failed to load plugin ${dir}:`, error);
    }
  }

  return plugins.sort((a, b) => {
    if (a.config.category !== b.config.category) {
      return a.config.category.localeCompare(b.config.category);
    }
    return a.config.order - b.config.order;
  });
}

export function getPluginBySlug(plugins: Plugin[], slug: string): Plugin | undefined {
  return plugins.find(p => p.config.slug === slug);
}

export function getPluginsByCategory(plugins: Plugin[], category: string): Plugin[] {
  return plugins.filter(p => p.config.category === category);
}

function extractLocaleValue(value: any, lang: string): any {
  if (!value) return value;

  if (typeof value === 'object' && !Array.isArray(value)) {
    // Check if this object has language keys
    if (value[lang] !== undefined) {
      console.log(`[extractLocaleValue] Found ${lang} key, extracting:`, value[lang]);
      return extractLocaleValue(value[lang], lang);
    }
    if (value['en'] !== undefined) {
      console.log(`[extractLocaleValue] No ${lang} key, falling back to 'en':`, value['en']);
      return extractLocaleValue(value['en'], lang);
    }
    // Otherwise, recursively process all keys
    const result: any = {};
    for (const key in value) {
      result[key] = extractLocaleValue(value[key], lang);
    }
    return result;
  }

  if (Array.isArray(value)) {
    return value.map(item => extractLocaleValue(item, lang));
  }

  return value;
}

export function formatPluginForAPI(plugin: Plugin, lang: string = 'en') {
  const { config, ui, schema } = plugin;

  const processedUi: any = {};
  for (const key in ui) {
    processedUi[key] = extractLocaleValue(ui[key], lang);
  }

  return {
    slug: config.slug,
    category: config.category,
    apiPath: config.apiPath,
    order: config.order,
    ...processedUi,
    icon: ui.icon || '🔧',
    schema: {
      ...schema,
      submitText: schema.submitText?.[lang] || schema.submitText?.['en'] || 'Submit',
      options: schema.options?.map(opt => ({
        ...opt,
        label: opt.label?.[lang] || opt.label?.['en'] || opt.name,
        choices: opt.choices?.map((choice: any) => ({
          value: choice.value,
          label: choice.label?.[lang] || choice.label?.['en'] || choice.value
        }))
      })) || []
    }
  };
}
