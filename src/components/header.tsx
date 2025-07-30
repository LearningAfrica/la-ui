import { Menu, Search, User, ShoppingCart, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MegaMenu } from '@/components/mega-menu';
import { useTheme } from '@/providers/theme-provider';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { useState } from 'react';

export function Header() {
  const pathname = useLocation().pathname;
  const { theme, setTheme } = useTheme();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };
  const auth = useAuth();

  return (
    <header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
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
          <nav className="hidden xl:flex items-center gap-6 ml-8">
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
          </nav>
        </div>

        {/* Center Section - Search (Desktop) */}
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

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
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

          {/* Auth Button */}
          <Button variant="outline" size="sm" asChild className="hidden sm:flex">
            {auth.is_authenticated ? (
              <>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => auth.logout()}
                  className="hidden"
                >
                  Logout
                </Button>
                <Link to="/dashboard" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span className="hidden md:inline">Dashboard</span>
                </Link>
              </>
            ) : (
              <Link to="/login">
                <User className="mr-2 h-4 w-4" />
                <span className="hidden md:inline">Login</span>
              </Link>
            )}
          </Button>

          {/* Mobile Auth Button */}
          <Button variant="outline" size="icon" asChild className="sm:hidden">
            {auth.is_authenticated ? (
              <Link to="/dashboard">
                <User className="h-4 w-4" />
                <span className="sr-only">Dashboard</span>
              </Link>
            ) : (
              <Link to="/login">
                <User className="h-4 w-4" />
                <span className="sr-only">Login</span>
              </Link>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
