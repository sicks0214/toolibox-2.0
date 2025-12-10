import express, { Request, Response } from 'express';
import axios from 'axios';

const router = express.Router();

// DeepSeek API配置
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const MAX_CHARACTERS = 20000;

// 类型定义
type SimplificationLevel = 'light' | 'medium' | 'heavy';

interface SimplifyRequestBody {
  text: string;
  keywords?: string;
  level?: SimplificationLevel;
}

interface SimplifyResult {
  originalText: string;
  simplifiedText: string;
  level: SimplificationLevel;
  keywords: string[];
  timestamp: number;
}

/**
 * 构建不同等级的详细提示词
 */
function buildPrompt(text: string, keywords: string | undefined, level: SimplificationLevel): string {
  const keywordsPart = keywords
    ? `\n- 必须保留以下关键词（原样使用，不可改写）：${keywords}`
    : '';

  // 为每个等级设计独立的详细提示词
  const prompts: Record<SimplificationLevel, string> = {
    light: `你是一位专业的文本编辑助手。请对以下文本进行轻度简化：

【简化要求 - Light 等级】
1. 保持原文的所有核心内容和细节
2. 仅修正明显的冗余表达和重复内容
3. 优化句子结构，使其更流畅易读
4. 保留专业术语和技术词汇
5. 保持原文的语气和风格${keywordsPart}
6. 输出长度应为原文的 80-90%
7. 确保语法正确，标点规范

【输出要求】
- 只输出简化后的文本，不要添加任何解释、说明或标记

【原文】
${text}`,

    medium: `你是一位专业的文本简化专家。请对以下文本进行中度简化：

【简化要求 - Medium 等级】
1. 保持核心信息和主要论点
2. 将复杂句式拆分为多个简单句
3. 用常见词汇替换生僻词和复杂表达
4. 删除次要的修饰语和冗余细节
5. 适当简化专业术语（必要时保留）${keywordsPart}
6. 输出长度应为原文的 60-70%
7. 保持逻辑清晰，语言自然

【输出要求】
- 只输出简化后的文本，不要添加任何解释、说明或标记

【原文】
${text}`,

    heavy: `你是一位面向普通读者的文本改写专家。请对以下文本进行深度简化：

【简化要求 - Heavy 等级】
1. 提取最核心的关键信息和结论
2. 使用小学高年级学生能理解的词汇
3. 每句话只表达一个简单的意思
4. 用日常用语替换所有专业术语（除非是关键词）
5. 删除所有非必要的修饰、例子和细节${keywordsPart}
6. 输出长度应为原文的 40-50%
7. 像对话一样自然、直接、易懂

【输出要求】
- 只输出简化后的文本，不要添加任何解释、说明或标记

【原文】
${text}`
  };

  return prompts[level] || prompts.medium;
}

/**
 * 调用DeepSeek API
 */
async function callDeepSeekAPI(
  text: string,
  keywords: string | undefined,
  level: SimplificationLevel
): Promise<SimplifyResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DeepSeek API key is not configured');
  }

  const prompt = buildPrompt(text, keywords, level);

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: 'You are a professional text simplification assistant. You simplify text according to specific level requirements while preserving key information and specified keywords. Always respond in the same language as the input text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000, // 120 seconds (2 minutes) - 增加到2分钟以处理长文本
      }
    );

    const simplifiedText = response.data.choices[0]?.message?.content?.trim();

    if (!simplifiedText) {
      throw new Error('No simplified text received from API');
    }

    return {
      originalText: text,
      simplifiedText,
      level,
      keywords: keywords ? keywords.split(',').map((k: string) => k.trim()).filter(Boolean) : [],
      timestamp: Date.now(),
    };
  } catch (error: any) {
    console.error('DeepSeek API error:', error.response?.data || error.message);

    if (error.response) {
      // API返回错误
      throw new Error(error.response.data?.error?.message || 'DeepSeek API error');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout');
    } else {
      throw new Error('Failed to connect to DeepSeek API');
    }
  }
}

/**
 * POST /api/simplify
 * 简化文本
 */
router.post('/simplify', async (req: Request<{}, {}, SimplifyRequestBody>, res: Response) => {
  try {
    const { text, keywords, level = 'medium' } = req.body;

    // 输入验证
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: 'Text is required and must be a string'
        }
      });
    }

    if (text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMPTY_TEXT',
          message: 'Text cannot be empty'
        }
      });
    }

    if (text.length > MAX_CHARACTERS) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'TEXT_TOO_LONG',
          message: `Text exceeds maximum length of ${MAX_CHARACTERS} characters`
        }
      });
    }

    if (!['light', 'medium', 'heavy'].includes(level)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_LEVEL',
          message: 'Level must be one of: light, medium, heavy'
        }
      });
    }

    // 调用DeepSeek API
    const result = await callDeepSeekAPI(text, keywords, level as SimplificationLevel);

    // 返回成功响应
    res.json({
      success: true,
      data: result
    });

  } catch (error: any) {
    console.error('Simplify endpoint error:', error);

    // 返回错误响应
    res.status(500).json({
      success: false,
      error: {
        code: 'API_ERROR',
        message: error.message || 'An error occurred while simplifying text'
      }
    });
  }
});

export default router;
