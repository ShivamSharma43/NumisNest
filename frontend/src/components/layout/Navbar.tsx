import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Heart, Moon, Sun, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import numisnestLogo from '@/assets/numisnest-logo.png';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/coins', label: 'Coins' },
  { href: '/articles', label: 'Articles' },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    typeof window !== 'undefined' ? document.documentElement.classList.contains('dark') : false
  );
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const toggleDarkMode = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved === 'dark' || (!saved && prefersDark);
    setIsDark(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setIsMobileMenuOpen(false); }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled
        ? 'bg-background/80 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-black/5'
        : 'bg-transparent'
    }`}>
      {/* Subtle gradient line at top */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ rotate: 10, scale: 1.1 }} transition={{ type: 'spring', stiffness: 300 }}>
              <img src={numisnestLogo} alt="NumisNest" className="w-9 h-9 object-contain drop-shadow-sm" />
            </motion.div>
            <span className="font-serif text-xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
              NumisNest
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link key={link.href} to={link.href} className="relative px-4 py-2 group">
                  <span className={`font-medium text-sm transition-colors duration-200 ${
                    isActive ? 'text-primary' : 'text-foreground/80 group-hover:text-foreground'
                  }`}>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side controls */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}
              className="w-9 h-9 rounded-full hover:bg-primary/10 hover:text-primary transition-all duration-200">
              <motion.div key={isDark ? 'sun' : 'moon'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.2 }}>
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.div>
            </Button>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2.5 px-3 h-9 rounded-full hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-all duration-200">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{user?.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl border-border/50 shadow-xl">
                  <div className="px-3 py-2 border-b border-border/50">
                    <p className="text-xs text-muted-foreground">Signed in as</p>
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="mt-1">
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                      <Heart className="w-4 h-4" />Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="w-4 h-4" />Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" asChild className="rounded-full">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild className="rounded-full px-4 shadow-sm shadow-primary/20">
                  <Link to="/register">Get Started</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-foreground hover:text-primary hover:bg-primary/10 transition-all duration-200">
            <AnimatePresence mode="wait">
              <motion.div key={isMobileMenuOpen ? 'close' : 'open'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border/50">
            <div className="container mx-auto px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    location.pathname === link.href
                      ? 'bg-primary/10 text-primary'
                      : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                  }`}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-3 border-t border-border/50 space-y-2">
                <button onClick={toggleDarkMode}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-foreground/80 hover:bg-muted transition-all">
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                {isAuthenticated ? (
                  <>
                    <Link to="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-foreground/80 hover:bg-muted">
                      <User className="w-4 h-4" />Profile & Wishlist
                    </Link>
                    <button onClick={logout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10">
                      <LogOut className="w-4 h-4" />Sign Out
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2 px-4">
                    <Button variant="outline" asChild className="flex-1 rounded-full"><Link to="/login">Sign In</Link></Button>
                    <Button asChild className="flex-1 rounded-full"><Link to="/register">Register</Link></Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
