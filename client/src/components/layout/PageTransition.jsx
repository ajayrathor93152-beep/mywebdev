import { motion } from "motion/react";
import { pageTransition } from "@/lib/motion";

export default function PageTransition({ children }) {
  return (
    <motion.main id="main" {...pageTransition}>
      {children}
    </motion.main>
  );
}
