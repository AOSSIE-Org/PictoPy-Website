import type React from "react";
import { FaDiscord } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="relative min-h-[420px] bg-white dark:bg-black text-black dark:text-white overflow-hidden border-t border-black/10 dark:border-white/10 transition-colors duration-500">

      {/* Soft radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />

      {/* Big Background Text */}
      <h1
        className="
        absolute
        bottom-[-80px]
        left-1/2
        -translate-x-1/2
        text-[260px]
        font-extrabold
        tracking-tight
        bg-gradient-to-t
        from-black/10
        dark:from-white/10
        to-transparent
        bg-clip-text
        text-transparent
        select-none
        pointer-events-none
        whitespace-nowrap
      "
      >
        PictoPy
      </h1>

      <div className="relative container mx-auto px-6 pt-20 pb-12 flex flex-col justify-between h-full">

        {/* Top Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Logo */}
          <p className="text-2xl font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 hover:scale-105 transition-transform duration-300">
            PictoPy
          </p>

          {/* Discord Link */}
          <a
            href="https://discord.com/channels/1022871757289422898/1311271974630330388"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-green-400 hover:opacity-80 transition-all duration-300"
          >
            <FaDiscord className="text-yellow-400 dark:text-green-400 text-lg transition-transform duration-300 hover:scale-110" />
            Made with love by AOSSIE team
          </a>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-black/20 dark:via-white/20 to-transparent" />

        {/* Bottom Copyright */}
        <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} PictoPy. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
