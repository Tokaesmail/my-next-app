'use client'
import { useTheme } from '../themeProviders/themeProvider';
import { HiSun, HiMoon } from 'react-icons/hi';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-700 transition-colors duration-200"
        aria-label="Toggle theme"
        disabled
      >
        <HiMoon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <HiMoon className="w-5 h-5 text-gray-700 dark:text-gray-200" />
      ) : (
        <HiSun className="w-5 h-5 text-yellow-500" />
      )}
    </button>
  );
}