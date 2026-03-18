
import { motion, useReducedMotion } from "framer-motion";
import { ImageIcon, FolderSync, Search, Code } from "lucide-react";

export default function TechMarquee() {
  const shouldReduceMotion = useReducedMotion();

  const technologies = [
    {
      text: "PictoAI",
      icon: <ImageIcon className="inline-block ml-1 text-green-500" />,
    },
    {
      text: "SmartSort",
      icon: <FolderSync className="inline-block ml-1 text-yellow-500" />,
    },
    {
      text: "QuickView",
      icon: <Search className="inline-block ml-1 text-green-500" />,
    },
    {
      text: "CodeAI",
      icon: <Code className="inline-block ml-1 text-yellow-500" />,
    }
  ];

  const duplicatedTechnologies = Array(16).fill(technologies).flat();

  return (
    <div className="relative w-full overflow-hidden 
      bg-white 
      dark:bg-black
      py-4 
      dark:shadow-[0_0_50px_rgba(255,255,255,0.1)]
      transition-shadow duration-500">
      <motion.div
        className="flex w-max items-center"
        initial={shouldReduceMotion ? undefined : { x: "-50%" }}
animate={shouldReduceMotion ? { x: 0 } : { x: "0%" }}
transition={
  shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 45,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      }
}
      >
        {duplicatedTechnologies.map((tech, index) => (
          <div
            key={index}
            className="flex-shrink-0 flex items-center text-gray-600 dark:text-gray-300 text-xs font-medium"
          >
            <motion.span
              className="flex items-center 
                bg-gray-100 dark:bg-white/5
                hover:bg-gray-200 dark:hover:bg-white/10
                px-3 py-1 
                rounded-full 
                transition-all duration-300
                border border-gray-200 dark:border-white/10
                shadow-sm"
              whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.95 }}
            >
              {tech.text}
              <span className="ml-2 opacity-70">
                {tech.icon}
              </span>
            </motion.span>
            <span className="mx-6 text-gray-300 dark:text-gray-600">•</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}