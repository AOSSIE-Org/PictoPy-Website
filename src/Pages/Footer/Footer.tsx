import type React from "react";
import { motion } from "framer-motion";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";
import { ExternalLink } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-black text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      {/* Main grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1 — PictoPy brand */}
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-green-500 mb-3">
              PictoPy
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              A privacy-first, AI-powered desktop gallery application built with
              Tauri, React, and Rust — keeping your data entirely on your
              device.
            </p>
            <a
              href="https://github.com/AOSSIE-Org/PictoPy"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-500 hover:text-green-500 transition-colors duration-200"
            >
              <FaGithub className="text-base" />
              View on GitHub
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>

          {/* Column 2 — About AOSSIE */}
          <motion.div
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-1"
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              About AOSSIE
            </h4>
            <p className="text-sm leading-relaxed mb-3">
              <span className="font-semibold text-gray-900 dark:text-white">
                Australian Open Source Software Innovation and Education
                (AOSSIE)
              </span>{" "}
              is an Australian not-for-profit umbrella organisation for
              open-source projects. AOSSIE mentors students and contributors
              through programs like Google Summer of Code and Outreachy,
              fostering innovation in open-source software across the globe.
            </p>
            <a
              href="https://aossie.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-yellow-500 hover:text-green-500 transition-colors duration-200"
            >
              aossie.org
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>

          {/* Column 3 — Quick Links */}
          <motion.div
            custom={2}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                {
                  label: "Documentation",
                  href: "https://aossie-org.github.io/PictoPy/",
                },
                {
                  label: "Releases",
                  href: "https://github.com/AOSSIE-Org/PictoPy/releases",
                },
                {
                  label: "Issue Tracker",
                  href: "https://github.com/AOSSIE-Org/PictoPy/issues",
                },
                {
                  label: "Contributing Guide",
                  href: "https://github.com/AOSSIE-Org/PictoPy/blob/main/CONTRIBUTING.md",
                },
                {
                  label: "AOSSIE Projects",
                  href: "https://aossie.org/#projects",
                },
                {
                  label: "Google Summer of Code",
                  href: "https://summerofcode.withgoogle.com/",
                },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-yellow-500 dark:hover:text-green-400 transition-colors duration-200"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 4 — Community */}
          <motion.div
            custom={3}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
          >
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Community
            </h4>
            <p className="text-sm leading-relaxed mb-4">
              Join our community to report bugs, request features, chat with
              contributors, and follow AOSSIE's open-source journey.
            </p>
            <div className="flex flex-col gap-3">
              <a
                href="https://discord.com/channels/1022871757289422898/1311271974630330388"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-yellow-500 dark:hover:text-green-400 transition-colors duration-200"
              >
                <FaDiscord className="text-lg text-indigo-500" />
                Discord Server
              </a>
              <a
                href="https://github.com/AOSSIE-Org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-yellow-500 dark:hover:text-green-400 transition-colors duration-200"
              >
                <FaGithub className="text-lg" />
                AOSSIE on GitHub
              </a>
              <a
                href="https://twitter.com/aossie_org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium hover:text-yellow-500 dark:hover:text-green-400 transition-colors duration-200"
              >
                <FaTwitter className="text-lg text-sky-500" />
                @aossie_org
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 dark:text-gray-500">
          <p>
            {`© ${year} `}
            <a
              href="https://aossie.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-500 transition-colors duration-200"
            >
              {"AOSSIE"}
            </a>
            {
              ". PictoPy is open-source software released under the MIT License."
            }
          </p>
          <p className="flex items-center gap-1">
            {"Made with ♥ by the "}
            <a
              href="https://aossie.org"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 font-medium text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-green-500 hover:opacity-80 transition-opacity duration-200"
            >
              {"AOSSIE Team"}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
