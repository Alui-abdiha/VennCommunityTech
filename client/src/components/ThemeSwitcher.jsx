import { Sun, Moon, Palette } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const items = [
    { key: "light", icon: <Sun size={16} /> },
    { key: "dark-blue", icon: <Moon size={16} /> },
    { key: "dark-purple", icon: <Palette size={16} /> },
  ];

  return (
    <div className="flex items-center gap-1 rounded-2xl border soft-border card-bg p-1">
      {items.map((item) => {
        const active = theme === item.key;

        return (
          <button
            key={item.key}
            onClick={() => setTheme(item.key)}
            className={[
              "h-9 w-9 flex items-center justify-center rounded-xl transition",
              active
                ? "brand-gradient text-white shadow-sm"
                : "text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]/40",
            ].join(" ")}
          >
            {item.icon}
          </button>
        );
      })}
    </div>
  );
}