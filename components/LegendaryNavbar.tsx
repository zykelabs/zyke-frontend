"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSpring, animated } from "react-spring";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { signOut, useSession } from "next-auth/react";
import {
  Zap,
  LayoutDashboard,
  Sparkles,
  MessageCircle,
  BarChart2,
  Settings,
  User,
  CreditCard,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Custom Hook: useScrollDirection
const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState("up");

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const updateScrollDirection = () => {
      const scrollY = window.pageYOffset;
      const direction = scrollY > lastScrollY ? "down" : "up";
      if (
        direction !== scrollDirection &&
        (scrollY - lastScrollY > 10 || scrollY - lastScrollY < -10)
      ) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener("scroll", updateScrollDirection);
    return () => {
      window.removeEventListener("scroll", updateScrollDirection);
    };
  }, [scrollDirection]);

  return scrollDirection;
};

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { name: "Ideas", icon: Sparkles, href: "/ideas" },
  { name: "Chatbot", icon: MessageCircle, href: "/chatbot" },
  { name: "Analytics", icon: BarChart2, href: "/analytics" },
  { name: "Settings", icon: Settings, href: "/settings" },
];

export default function LegendaryNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const scrollDirection = useScrollDirection();
  const { data: session } = useSession();

  const navAnimation = useSpring({
    transform:
      scrollDirection === "down" ? "translateY(-100%)" : "translateY(0%)",
    config: { tension: 300, friction: 20 },
  });

  const logoProps = useSpring({
    loop: { reverse: true },
    from: { rotateY: 0 },
    to: { rotateY: 360 },
    config: { duration: 3000 },
  });

  return (
    <animated.nav
      style={navAnimation}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <animated.div style={logoProps}>
              <Zap className="w-8 h-8 text-primary" />
            </animated.div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              Zyke
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <item.icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Avatar>
                    <AvatarImage
                      src={
                        session?.user?.image || "https://github.com/shadcn.png"
                      }
                      alt={session?.user?.name || "@shadcn"}
                    />
                    <AvatarFallback>
                      {session?.user?.name
                        ? session.user.name.charAt(0).toUpperCase()
                        : "SC"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 max-w-xs">
                <DropdownMenuItem
                  asChild
                  className="whitespace-normal break-words"
                >
                  <Link
                    href="/brandprofile"
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Brand Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="whitespace-normal break-words"
                >
                  <Link href="/credits" className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4" />
                    <span>Credits</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  asChild
                  className="whitespace-normal break-words"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => signOut({ callbackUrl: "/signin" })}
                    className="w-full flex items-center space-x-2 text-red-600 hover:bg-red-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log out</span>
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-t border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-muted-foreground hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </animated.nav>
  );
}
