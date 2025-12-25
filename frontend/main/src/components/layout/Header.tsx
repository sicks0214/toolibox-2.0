'use client';

import { useState, useTransition, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname, useRouter } from '@/lib/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginModal from '@/components/auth/LoginModal';
import RegisterModal from '@/components/auth/RegisterModal';
import {
  Dialog,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { PluginData } from '@/lib/api';

// 分类元数据
const categoryMeta: Record<string, { name: Record<string, string>; categoryId: string }> = {
  pdf: {
    name: { en: 'PDF Tools', zh: 'PDF 工具', es: 'Herramientas PDF' },
    categoryId: 'pdf-tools'
  },
  image: {
    name: { en: 'Image Tools', zh: '图像工具', es: 'Herramientas de imagen' },
    categoryId: 'image-tools'
  }
};

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [plugins, setPlugins] = useState<PluginData[]>([]);
  const [categories, setCategories] = useState<Record<string, PluginData[]>>({});
  const t = useTranslations('header');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();

  // 从 API 获取插件
  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE_URL}/api/plugins?lang=${locale}`);
        const data = await response.json();
        if (data.success) {
          setPlugins(data.data.plugins);
          setCategories(data.data.categories);
        }
      } catch (error) {
        console.error('Failed to fetch plugins:', error);
      }
    };
    fetchPlugins();
  }, [locale]);

  const pdfTools = categories['pdf'] || [];
  const imageTools = categories['image'] || [];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '中文' },
    { code: 'es', name: 'Español' },
  ];

  const switchLanguage = (newLocale: string) => {
    if (newLocale === locale) {
      setIsLanguageMenuOpen(false);
      return;
    }

    setIsLanguageMenuOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const getLocalizedPath = (path: string) => {
    return locale === 'en' ? path : `/${locale}${path}`;
  };

  const getToolPath = (tool: PluginData) => {
    const categoryId = categoryMeta[tool.category]?.categoryId || `${tool.category}-tools`;
    return `/${categoryId}/${tool.slug}`;
  };

  const getCategoryUrl = (categoryId: string) => {
    return getLocalizedPath(`/${categoryId}`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <nav aria-label="Global" className="mx-auto flex max-w-[1920px] items-center justify-between px-6 py-4 lg:px-12">
        <div className="flex lg:flex-1">
          <Link href={getLocalizedPath('/')} className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">🛠️</span>
            <span className="text-xl font-bold text-neutral">TooliBox</span>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-neutral"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-6" />
          </button>
        </div>
        <PopoverGroup className="hidden lg:flex lg:gap-x-10">
          {/* PDF Tools */}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-base font-semibold text-neutral hover:text-primary transition-colors">
              📄 {categoryMeta.pdf.name[locale] || 'PDF Tools'}
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4 grid grid-cols-1 gap-2">
                {pdfTools.length > 0 ? (
                  <>
                    {pdfTools.slice(0, 6).map((tool) => (
                      <Link
                        key={tool.slug}
                        href={getToolPath(tool)}
                        className="flex items-center gap-x-4 rounded-lg p-3 text-sm hover:bg-surface transition-colors"
                      >
                        <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-surface text-xl">
                          {tool.icon}
                        </div>
                        <div className="flex-auto">
                          <div className="font-semibold text-neutral">
                            {tool.title}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-600">{tool.description}</p>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    {locale === 'zh' ? '即将推出更多工具' : locale === 'es' ? 'Más herramientas próximamente' : 'More tools coming soon'}
                  </p>
                )}
                <Link
                  href={getCategoryUrl('pdf-tools')}
                  className="text-center py-2 text-sm font-semibold text-primary hover:text-primary/80"
                >
                  {locale === 'zh' ? '查看所有 PDF 工具 →' : locale === 'es' ? 'Ver todas las herramientas PDF →' : 'View all PDF tools →'}
                </Link>
              </div>
            </PopoverPanel>
          </Popover>

          {/* Image Tools */}
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-base font-semibold text-neutral hover:text-primary transition-colors">
              🖼️ {categoryMeta.image.name[locale] || 'Image Tools'}
              <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-gray-400" />
            </PopoverButton>

            <PopoverPanel
              transition
              className="absolute left-1/2 z-10 mt-3 w-screen max-w-md -translate-x-1/2 rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5 transition data-closed:translate-y-1 data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
            >
              <div className="p-4 grid grid-cols-1 gap-2">
                {imageTools.length > 0 ? (
                  <>
                    {imageTools.slice(0, 6).map((tool) => (
                      <Link
                        key={tool.slug}
                        href={getToolPath(tool)}
                        className="flex items-center gap-x-4 rounded-lg p-3 text-sm hover:bg-surface transition-colors"
                      >
                        <div className="flex size-10 flex-none items-center justify-center rounded-lg bg-surface text-xl">
                          {tool.icon}
                        </div>
                        <div className="flex-auto">
                          <div className="font-semibold text-neutral">
                            {tool.title}
                          </div>
                          <p className="mt-0.5 text-xs text-gray-600">{tool.description}</p>
                        </div>
                      </Link>
                    ))}
                  </>
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    {locale === 'zh' ? '即将推出更多工具' : locale === 'es' ? 'Más herramientas próximamente' : 'More tools coming soon'}
                  </p>
                )}
                <Link
                  href={getCategoryUrl('image-tools')}
                  className="text-center py-2 text-sm font-semibold text-primary hover:text-primary/80"
                >
                  {locale === 'zh' ? '查看所有图像工具 →' : locale === 'es' ? 'Ver todas las herramientas de imagen →' : 'View all Image tools →'}
                </Link>
              </div>
            </PopoverPanel>
          </Popover>

        </PopoverGroup>

        {/* Language Dropdown & User Menu */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-x-4">
          {/* Language Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
              className="flex items-center space-x-2 text-base font-semibold text-neutral hover:text-primary transition-colors"
            >
              <GlobeAltIcon className="size-5" />
              <span>{languages.find((l) => l.code === locale)?.name}</span>
              <ChevronDownIcon
                className={`size-4 transition-transform ${
                  isLanguageMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isLanguageMenuOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsLanguageMenuOpen(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-surface transition-colors ${
                        locale === lang.code
                          ? 'bg-surface text-primary font-semibold'
                          : 'text-neutral'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* User Authentication */}
          {!authLoading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 text-base font-semibold text-neutral hover:text-primary transition-colors"
                  >
                    <UserCircleIcon className="size-6" />
                    <span>{user.username}</span>
                    <ChevronDownIcon
                      className={`size-4 transition-transform ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <div className="px-4 py-2 border-b border-gray-200">
                          <p className="text-sm font-semibold text-neutral">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-neutral hover:bg-surface transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                            router.push('/');
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </>
          )}
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      {/* Register Modal */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />

      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href={getLocalizedPath('/')} className="flex items-center space-x-2">
              <span className="text-2xl">🛠️</span>
              <span className="text-lg font-bold text-neutral">TooliBox</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-neutral"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {/* PDF Tools */}
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold text-neutral hover:bg-surface">
                    📄 {categoryMeta.pdf.name[locale] || 'PDF Tools'}
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {pdfTools.length > 0 ? (
                      pdfTools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={getToolPath(tool)}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-neutral hover:bg-surface"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {tool.icon} {tool.title}
                        </Link>
                      ))
                    ) : (
                      <p className="pl-6 py-2 text-sm text-gray-500">
                        {locale === 'zh' ? '即将推出' : locale === 'es' ? 'Próximamente' : 'Coming soon'}
                      </p>
                    )}
                    <Link
                      href={getCategoryUrl('pdf-tools')}
                      className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-primary hover:bg-surface"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {locale === 'zh' ? '查看全部 →' : locale === 'es' ? 'Ver todo →' : 'View all →'}
                    </Link>
                  </DisclosurePanel>
                </Disclosure>

                {/* Image Tools */}
                <Disclosure as="div" className="-mx-3">
                  <DisclosureButton className="group flex w-full items-center justify-between rounded-lg py-2 pr-3.5 pl-3 text-base font-semibold text-neutral hover:bg-surface">
                    🖼️ {categoryMeta.image.name[locale] || 'Image Tools'}
                    <ChevronDownIcon aria-hidden="true" className="size-5 flex-none group-data-open:rotate-180" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 space-y-2">
                    {imageTools.length > 0 ? (
                      imageTools.map((tool) => (
                        <Link
                          key={tool.slug}
                          href={getToolPath(tool)}
                          className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-neutral hover:bg-surface"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {tool.icon} {tool.title}
                        </Link>
                      ))
                    ) : (
                      <p className="pl-6 py-2 text-sm text-gray-500">
                        {locale === 'zh' ? '即将推出' : locale === 'es' ? 'Próximamente' : 'Coming soon'}
                      </p>
                    )}
                    <Link
                      href={getCategoryUrl('image-tools')}
                      className="block rounded-lg py-2 pr-3 pl-6 text-sm font-semibold text-primary hover:bg-surface"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {locale === 'zh' ? '查看全部 →' : locale === 'es' ? 'Ver todo →' : 'View all →'}
                    </Link>
                  </DisclosurePanel>
                </Disclosure>

              </div>

              {/* Mobile Language Selector */}
              <div className="py-6">
                <div className="-mx-3">
                  <div className="px-3 py-2 text-sm font-medium text-gray-500">Language</div>
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLanguage(lang.code);
                        setMobileMenuOpen(false);
                      }}
                      className={`-mx-3 block w-full text-left rounded-lg px-3 py-2.5 text-base font-semibold ${
                        locale === lang.code
                          ? 'bg-surface text-primary'
                          : 'text-neutral hover:bg-surface'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
