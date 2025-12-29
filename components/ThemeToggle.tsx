
import React, { useEffect, useState } from 'react';

const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 rounded-full bg-blue-100 dark:bg-slate-800 text-blue-600 dark:text-blue-300 transition-colors"
      aria-label="Toggle Theme"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
};

export default ThemeToggle;
