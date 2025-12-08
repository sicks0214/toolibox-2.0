import { getTranslations } from 'next-intl/server';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CategoryCard from '@/components/home/CategoryCard';
import ToolShowcase from '@/components/home/ToolShowcase';
import categories from '@/data/categories.json';
import tools from '@/data/tools.json';

export default async function HomePage() {
  const t = await getTranslations('home');

  // 计算每个类目的工具数量
  const categoriesWithCount = categories.map((category) => ({
    ...category,
    toolCount: tools.filter((tool) => tool.categoryId === category.id).length,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Hero />

        {/* Categories Section */}
        <section className="container mx-auto px-12 md:px-16 lg:px-24 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {categoriesWithCount
              .sort((a, b) => a.order - b.order)
              .map((category) => (
                <CategoryCard key={category.id} {...category} />
              ))}
          </div>
        </section>

        {/* Tool Showcase - Text Tools */}
        <ToolShowcase categoryId="text-tools" tools={tools} maxItems={6} />

        {/* Tool Showcase - File Tools */}
        <ToolShowcase categoryId="file-tools" tools={tools} maxItems={6} />

        {/* Tool Showcase - Image Tools */}
        <ToolShowcase categoryId="image-tools" tools={tools} maxItems={6} />

        {/* Tool Showcase - Generate Tools */}
        <ToolShowcase categoryId="generate-tools" tools={tools} maxItems={6} />

        {/* Tool Showcase - Developer Tools */}
        <ToolShowcase categoryId="developer-tools" tools={tools} maxItems={6} />
      </main>
      <Footer />
    </div>
  );
}
