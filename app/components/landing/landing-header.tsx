import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/theme-provider";
import { Menu, X, Moon, Sun, Monitor } from "lucide-react";
import { useAuthStore } from "@/stores/auth/auth-store";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Contact", href: "#contact" },
];

export function LandingHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getThemeIcon = () => {
    if (theme === "light") return <Sun className="size-4" />;
    if (theme === "dark") return <Moon className="size-4" />;
    return <Monitor className="size-4" />;
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/95 shadow-md backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between lg:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="text-primary flex items-center space-x-2 text-xl font-bold lg:text-2xl"
          >
            <img
              src="/logo.png"
              alt="Learning Africa Logo"
              className="h-8 w-8"
            />
            <span className="hidden sm:inline">Learning Africa</span>
            <span className="sm:hidden">LA</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={(e) => {
                  if (item.href.startsWith("#")) {
                    e.preventDefault();
                    handleNavClick(item.href);
                  }
                }}
                className="text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center space-x-2 lg:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </Button>
            {isAuthenticated ? (
              <Button asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {getThemeIcon()}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="border-t py-4 lg:hidden">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (item.href.startsWith("#")) {
                      e.preventDefault();
                    }
                    handleNavClick(item.href);
                  }}
                  className="text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="mt-4 space-y-2 border-t pt-4">
                {isAuthenticated ? (
                  <Button className="w-full" asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" className="w-full" asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/register">Get Started</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
