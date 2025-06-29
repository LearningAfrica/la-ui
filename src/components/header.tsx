import { Menu, Search, User, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { MegaMenu } from '@/components/mega-menu';
import { useTheme } from '@/providers/theme-provider';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
	const pathname = useLocation().pathname;
	// const [showMegaMenu, setShowMegaMenu] = useState(false)
	const { theme, setTheme } = useTheme();

	const isActive = (path: string) => pathname === path;

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark');
	};

	return (
		<header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
			<div className="container flex h-16 items-center justify-between">
				<div className="flex items-center gap-6 md:gap-8 lg:gap-10">
					{/* Mobile Menu */}
					<Sheet>
						<SheetTrigger asChild>
							<Button variant="ghost" size="icon" className="md:hidden">
								<Menu className="h-5 w-5" />
								<span className="sr-only">Toggle menu</span>
							</Button>
						</SheetTrigger>
						<SheetContent side="left" className="w-full max-w-xs">
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
								<Link
									to="/categories"
									className={cn(
										'hover:text-foreground/80',
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
					<Link to="/" className="flex items-center gap-2">
						<span className="text-xl font-bold">LearnHub</span>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden items-center gap-6 md:flex">
						<Link
							to="/"
							className={cn(
								'hover:text-foreground/80 text-sm font-medium transition-colors',
								isActive('/') ? 'text-foreground' : 'text-foreground/60',
							)}
						>
							Home
						</Link>
						<div className="relative">{<MegaMenu />}</div>
						<Link
							to="/categories"
							className={cn(
								'hover:text-foreground/80 text-sm font-medium transition-colors',
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
								'hover:text-foreground/80 text-sm font-medium transition-colors',
								isActive('/instructors')
									? 'text-foreground'
									: 'text-foreground/60',
							)}
						>
							Instructors
						</Link>
					</nav>
				</div>

				{/* Right Side - Search, Cart, User */}
				<div className="flex items-center gap-4">
					<form className="hidden lg:block">
						<div className="relative">
							<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
							<Input
								type="search"
								placeholder="Search courses..."
								className="bg-background w-64 pl-8"
							/>
						</div>
					</form>
					<Button variant="ghost" size="icon" className="text-foreground/60">
						<ShoppingCart className="h-5 w-5" />
						<span className="sr-only">Shopping cart</span>
					</Button>
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
					<Button variant="outline" size="sm" asChild>
						<Link to="/login">
							<User className="mr-2 h-4 w-4" />
							Login
						</Link>
					</Button>
				</div>
			</div>
		</header>
	);
}
