import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Breadcrumb from '@/components/layout/Breadcrumb';
import TextSimplifier from '@/components/tools/TextSimplifier';
import categories from '@/data/categories.json';

interface PageProps {
  params: {
    locale: string;
  };
}

// 生成页面元数据（SEO）
export async function generateMetadata({
  params: { locale }
}: PageProps) {
  const t = await getTranslations({
    locale,
    namespace: 'tools.text-simplifier'
  });

  return {
    title: `${t('title')} - TooliBox`,
    description: t('subtitle'),
  };
}

export default function TextSimplifierPage({ params }: PageProps) {
  const t = useTranslations('tools.text-simplifier');
  const tCategory = useTranslations('category.breadcrumb');
  const { locale } = params;

  // 获取 text-tools 类目信息
  const category = categories.find(c => c.id === 'text-tools');

  // 国际化文本标签
  const labels = {
    title: t('title'),
    subtitle: t('subtitle'),
    originalText: t('originalText'),
    simplifiedText: t('simplifiedText'),
    originalTextPlaceholder: t('originalTextPlaceholder'),
    simplifiedTextPlaceholder: t('simplifiedTextPlaceholder'),
    simplificationSettings: t('simplificationSettings'),
    keywordsLabel: t('keywordsLabel'),
    keywordsPlaceholder: t('keywordsPlaceholder'),
    simplifyButton: t('simplifyButton'),
    copyButton: t('copyButton'),
    copied: t('copied'),
    exportButton: t('exportButton'),
    exportTxt: t('exportTxt'),
    exportMd: t('exportMd'),
    exportDocx: t('exportDocx'),
    levelLight: t('levelLight'),
    levelMedium: t('levelMedium'),
    levelHeavy: t('levelHeavy'),
    levelDescription: t('levelDescription'),
    processing: t('processing'),
    error: t('error'),
    success: t('success'),
    charCount: t('charCount'),
    words: t('words'),
    characters: t('characters'),
    clear: t('clear'),
    uploadFile: t('uploadFile'),
    textExceedsLimit: t('textExceedsLimit'),
    poweredBy: t('poweredBy'),
    // Features section
    features: {
      title: t('features.title'),
      ai: t('features.ai'),
      aiDesc: t('features.aiDesc'),
      keywords: t('features.keywords'),
      keywordsDesc: t('features.keywordsDesc'),
      levels: t('features.levels'),
      levelsDesc: t('features.levelsDesc'),
      export: t('features.export'),
      exportDesc: t('features.exportDesc'),
    },
    // Input & Export section
    inputExport: {
      title: t('inputExport.title'),
      inputTitle: t('inputExport.inputTitle'),
      inputItems: t.raw('inputExport.inputItems') as string[],
      exportTitle: t('inputExport.exportTitle'),
      exportItems: t.raw('inputExport.exportItems') as string[],
    },
    // How It Works section
    howItWorks: {
      title: t('howItWorks.title'),
      step1: t('howItWorks.step1'),
      step1Desc: t('howItWorks.step1Desc'),
      step2: t('howItWorks.step2'),
      step2Desc: t('howItWorks.step2Desc'),
      step3: t('howItWorks.step3'),
      step3Desc: t('howItWorks.step3Desc'),
      step4: t('howItWorks.step4'),
      step4Desc: t('howItWorks.step4Desc'),
    },
    // Perfect For section
    perfectFor: {
      title: t('perfectFor.title'),
      students: t('perfectFor.students'),
      studentsDesc: t('perfectFor.studentsDesc'),
      creators: t('perfectFor.creators'),
      creatorsDesc: t('perfectFor.creatorsDesc'),
      professionals: t('perfectFor.professionals'),
      professionalsDesc: t('perfectFor.professionalsDesc'),
      learners: t('perfectFor.learners'),
      learnersDesc: t('perfectFor.learnersDesc'),
      writers: t('perfectFor.writers'),
      writersDesc: t('perfectFor.writersDesc'),
      teams: t('perfectFor.teams'),
      teamsDesc: t('perfectFor.teamsDesc'),
    },
    // CTA section
    cta: {
      title: t('cta.title'),
      subtitle: t('cta.subtitle'),
      button: t('cta.button'),
      stats: {
        characters: t('cta.stats.characters'),
        levels: t('cta.stats.levels'),
        formats: t('cta.stats.formats'),
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb
            items={[
              { label: tCategory('home'), href: '/' },
              {
                label: category?.name[locale as 'en' | 'zh'] || 'Text Tools',
                href: `/category/text-tools`,
              },
              { label: labels.title },
            ]}
          />
        </div>
        <TextSimplifier labels={labels} />
      </main>
      <Footer />
    </div>
  );
}
