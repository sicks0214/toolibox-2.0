import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function CompressPDFPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 py-16 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <span className="text-6xl mb-6 block">🗜️</span>
          <h1 className="text-3xl font-bold text-neutral mb-4">Compress PDF</h1>
          <p className="text-gray-600 mb-8">
            This tool is coming soon. Stay tuned!
          </p>
          <div className="inline-block px-6 py-3 bg-gray-100 text-gray-500 rounded-lg">
            Coming Soon
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
