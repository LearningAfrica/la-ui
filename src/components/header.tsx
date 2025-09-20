import { Menu, Search, User, ShoppingCart, ChevronDown, ChevronRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MegaMenu } from '@/components/mega-menu';
import { useTheme } from '@/providers/theme-provider';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

type HeaderNavItem = {
  label: string;
  href: string;
  external?: boolean;
};

type HeaderAction = {
  label: string;
  href: string;
  external?: boolean;
};

export interface HeaderProps {
  variant?: 'default' | 'marketing';
  navItems?: HeaderNavItem[];
  cta?: HeaderAction;
  secondaryAction?: HeaderAction | null;
  className?: string;
}

export function Header({
  variant = 'default',
  navItems,
  cta,
  secondaryAction,
  className,
}: HeaderProps = {}) {
  const pathname = useLocation().pathname;
  const { theme, setTheme } = useTheme();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  const auth = useAuth();

  const isMarketing = variant === 'marketing';
  const marketingNavItems = navItems ?? [
    { label: 'About', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Testimonials', href: '#testimonials' },
  ];
  const marketingPrimaryAction = cta ?? { label: 'Start Inquiry', href: '/inquiry' };
  const defaultMarketingSecondary = auth.is_authenticated
    ? { label: 'Dashboard', href: '/dashboard' }
    : { label: 'Login', href: '/login' };
  const marketingSecondaryAction = secondaryAction === null
    ? null
    : (secondaryAction ?? defaultMarketingSecondary);

  const renderLink = (
    link: HeaderNavItem | HeaderAction,
    linkClassName?: string,
    key?: string,
  ) => {
    const { href, label, external } = link;

    if (external) {
      return (
        <a
          key={key ?? href}
          href={href}
          target="_blank"
          rel="noreferrer"
          className={linkClassName}
        >
          {label}
        </a>
      );
    }

    if (href.startsWith('#')) {
      return (
        <a key={key ?? href} href={href} className={linkClassName}>
          {label}
        </a>
      );
    }

    return (
      <Link key={key ?? href} to={href} className={linkClassName}>
        {label}
      </Link>
    );
  };

  return (
    <header
      className={cn(
        'bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur',
        className,
      )}
    >
      <div className="container mx-auto px-4 flex h-16 items-center justify-between gap-4">
        {/* Left Section - Logo and Mobile Menu */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs p-6">
              {isMarketing ? (
                <nav className="grid gap-5 text-lg font-medium">
                  {marketingNavItems.map((item) =>
                    renderLink(
                      item,
                      'text-foreground/70 transition-colors hover:text-foreground',
                      `${item.href}-${item.label}`,
                    )
                  )}
                  {marketingSecondaryAction &&
                    renderLink(
                      marketingSecondaryAction,
                      'text-foreground/70 transition-colors hover:text-foreground',
                      `${marketingSecondaryAction.href}-${marketingSecondaryAction.label}`,
                    )}
                  {renderLink(
                    marketingPrimaryAction,
                    'text-primary font-semibold transition-colors hover:text-primary/80',
                    `${marketingPrimaryAction.href}-${marketingPrimaryAction.label}`,
                  )}
                </nav>
              ) : (
                <nav className="grid gap-6 text-lg font-medium">
                  <Link
                    to="/"
                    className={cn(
                      'hover:text-foreground/80',
                      isActive('/') ? 'text-foreground' : 'text-foreground/60',
                    )}
                  >
                    Home
                  </Link>
                  <Link
                    to="/courses"
                    className={cn(
                      'hover:text-foreground/80',
                      isActive('/courses')
                        ? 'text-foreground'
                        : 'text-foreground/60',
                    )}
                  >
                    Courses
                  </Link>

                  {/* Collapsible Categories Section */}
                  <div className="border-t border-border pt-4">
                    <button
                      onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                      className="flex items-center justify-between w-full hover:text-foreground/80 text-left"
                    >
                      <span className={cn(
                        isActive('/categories') ? 'text-foreground' : 'text-foreground/60'
                      )}>
                        Categories
                      </span>
                      {isCategoriesOpen ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>

                    {isCategoriesOpen && (
                      <div className="mt-3 space-y-2 pl-4">
                        <Link
                          to="/categories"
                          className={cn(
                            'block hover:text-foreground/80 text-base',
                            isActive('/categories')
                              ? 'text-foreground'
                              : 'text-foreground/60',
                          )}
                        >
                          All Categories
                        </Link>
                        <Link
                          to="/categories/web-development"
                          className="block hover:text-foreground/80 text-base text-foreground/60"
                        >
                          Web Development
                        </Link>
                        <Link
                          to="/categories/mobile-development"
                          className="block hover:text-foreground/80 text-base text-foreground/60"
                        >
                          Mobile Development
                        </Link>
                        <Link
                          to="/categories/data-science"
                          className="block hover:text-foreground/80 text-base text-foreground/60"
                        >
                          Data Science
                        </Link>
                        <Link
                          to="/categories/design"
                          className="block hover:text-foreground/80 text-base text-foreground/60"
                        >
                          Design
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/instructors"
                    className={cn(
                      'hover:text-foreground/80',
                      isActive('/instructors')
                        ? 'text-foreground'
                        : 'text-foreground/60',
                    )}
                  >
                    Instructors
                  </Link>
                  <Link
                    to="/about"
                    className={cn(
                      'hover:text-foreground/80',
                      isActive('/about')
                        ? 'text-foreground'
                        : 'text-foreground/60',
                    )}
                  >
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className={cn(
                      'hover:text-foreground/80',
                      isActive('/contact')
                        ? 'text-foreground'
                        : 'text-foreground/60',
                    )}
                  >
                    Contact
                  </Link>
                </nav>
              )}
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <picture>
              <source
                srcSet="https://avatars.githubusercontent.com/u/150797856?s=200&v=4"
                type="image/webp"
              />
              <img
                src="https://avatars.githubusercontent.com/u/150797856?s=200&v=4"
                alt="Learning Africa Logo"
                className="h-8 w-8 rounded-full"
                width={32}
                height={32}
              />
            </picture>
            <span className="font-bold text-sm sm:text-base md:text-xl truncate">Learning Africa</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className={cn(
              'hidden xl:flex items-center',
              isMarketing ? 'gap-8 ml-6' : 'gap-6 ml-8',
            )}
          >
            {isMarketing
              ? marketingNavItems.map((item) => {
                  const navClass = cn(
                    'text-sm font-medium transition-colors whitespace-nowrap',
                    item.href.startsWith('#')
                      ? 'text-foreground/70 hover:text-foreground'
                      : isActive(item.href)
                        ? 'text-foreground'
                        : 'text-foreground/60 hover:text-foreground',
                  );

                  return renderLink(
                    item,
                    navClass,
                    `desktop-${item.href}-${item.label}`,
                  );
                })
              : (
                <>
                  <Link
                    to="/"
                    className={cn(
                      'hover:text-foreground/80 text-sm font-medium transition-colors whitespace-nowrap',
                      isActive('/') ? 'text-foreground' : 'text-foreground/60',
                    )}
                  >
                    Home
                  </Link>
                  <div className="relative">
                    <MegaMenu />
                  </div>
                  <Link
                    to="/categories"
                    className={cn(
                      'hover:text-foreground/80 text-sm font-medium transition-colors whitespace-nowrap',
                      isActive('/categories')
                        ? 'text-foreground'
                        : 'text-foreground/60',
                    )}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/instructors"
                    className={cn(
                      'hover:text-foreground/80 text-sm font-medium transition-colors whitespace-nowrap',
                      isActive('/instructors')
                        ? 'text-foreground'
                        : 'text-foreground/60',
                    )}
                  >
                    Instructors
                  </Link>
                </>
                )}
          </nav>
        </div>

        {/* Center Section - Search (Desktop) */}
        {!isMarketing && (
          <div className="hidden xl:block flex-1 max-w-md mx-8">
            <form>
              <div className="relative">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="bg-background w-full pl-8"
                />
              </div>
            </form>
          </div>
        )}

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!isMarketing && (
            <>
              {/* Search (Mobile/Tablet) */}
              <Button variant="ghost" size="icon" className="xl:hidden">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="icon" className="text-foreground/60">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Shopping cart</span>
              </Button>
            </>
          )}

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="text-foreground/60"
          >
            <span className="sr-only">Toggle theme</span>
            {theme === 'dark' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                />
              </svg>
            )}
          </Button>

          {isMarketing ? (
            <>
              {marketingSecondaryAction && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden sm:inline-flex text-sm font-medium text-foreground/70 hover:text-foreground"
                >
                  {renderLink(
                    marketingSecondaryAction,
                    undefined,
                    `secondary-${marketingSecondaryAction.href}-${marketingSecondaryAction.label}`,
                  )}
                </Button>
              )}
              <Button
                size="sm"
                asChild
                className="hidden sm:inline-flex bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {renderLink(
                  marketingPrimaryAction,
                  undefined,
                  `cta-${marketingPrimaryAction.href}-${marketingPrimaryAction.label}`,
                )}
              </Button>
              <Button variant="default" size="icon" asChild className="sm:hidden">
                {renderLink(
                  marketingPrimaryAction,
                  undefined,
                  `cta-mobile-${marketingPrimaryAction.href}-${marketingPrimaryAction.label}`,
                )}
              </Button>
            </>
          ) : (
            <>
              {auth.is_authenticated ? (
                <>
                  <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">Dashboard</span>
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => auth.logout()}
                    className="hidden sm:inline-flex gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="sm:hidden"
                    onClick={() => auth.logout()}
                    aria-label="Log out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" asChild className="hidden sm:flex">
                    <Link to="/login" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span className="hidden md:inline">Login</span>
                    </Link>
                  </Button>
                  <Button variant="outline" size="icon" asChild className="sm:hidden">
                    <Link to="/login" aria-label="Login">
                      <User className="h-4 w-4" />
                    </Link>
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
