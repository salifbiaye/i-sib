"use client"

import { toast as sonnerToast } from "sonner"
import { motion } from "framer-motion"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  type LucideIcon
} from "lucide-react"

// Configuration des types de toast
const toastConfig = {
  success: {
    icon: CheckCircle2,
    bgClass: "bg-emerald-50/50 dark:bg-emerald-950/20",
    borderClass: "border-emerald-200/30 dark:border-emerald-800/30",
    iconBgClass: "bg-emerald-100 dark:bg-emerald-900/50",
    iconColorClass: "text-emerald-600 dark:text-emerald-400",
    textColorClass: "text-emerald-800 dark:text-emerald-200"
  },
  error: {
    icon: XCircle,
    bgClass: "bg-red-50/50 dark:bg-red-950/20",
    borderClass: "border-red-200/30 dark:border-red-800/30",
    iconBgClass: "bg-red-100 dark:bg-red-900/50",
    iconColorClass: "text-red-600 dark:text-red-400",
    textColorClass: "text-red-800 dark:text-red-200"
  },
  warning: {
    icon: AlertCircle,
    bgClass: "bg-orange-50/50 dark:bg-orange-950/20",
    borderClass: "border-orange-200/30 dark:border-orange-800/30",
    iconBgClass: "bg-orange-100 dark:bg-orange-900/50",
    iconColorClass: "text-orange-600 dark:text-orange-400",
    textColorClass: "text-orange-800 dark:text-orange-200"
  },
  info: {
    icon: Info,
    bgClass: "bg-blue-50/50 dark:bg-blue-950/20",
    borderClass: "border-blue-200/30 dark:border-blue-800/30",
    iconBgClass: "bg-blue-100 dark:bg-blue-900/50",
    iconColorClass: "text-blue-600 dark:text-blue-400",
    textColorClass: "text-blue-800 dark:text-blue-200"
  }
}

// Composant Toast animé
function AnimatedToast({
  type,
  message
}: {
  type: keyof typeof toastConfig
  message: string
}) {
  const config = toastConfig[type]
  const IconComponent = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      className="w-full max-w-md mx-auto flex justify-center"
    >
      <div className={`
        relative overflow-hidden rounded-lg border p-4 shadow-sm
        ${config.bgClass} ${config.borderClass}
      `}>
        <div className="flex items-center justify-center gap-3">
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
            }}
          >
            <div className={`rounded-full p-1 ${config.iconBgClass}`}>
              <IconComponent className={`h-4 w-4 ${config.iconColorClass}`} />
            </div>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className={`text-sm font-medium ${config.textColorClass}`}
          >
            {message}
          </motion.p>
        </div>

        {/* Effet shimmer */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
      </div>
    </motion.div>
  )
}

// Fonctions utilitaires pour déclencher les toasts
export const toast = {
  success: (message: string) => {
    sonnerToast.custom(() => (
      <AnimatedToast type="success" message={message} />
    ))
  },

  error: (message: string) => {
    sonnerToast.custom(() => (
      <AnimatedToast type="error" message={message} />
    ))
  },

  warning: (message: string) => {
    sonnerToast.custom(() => (
      <AnimatedToast type="warning" message={message} />
    ))
  },

  info: (message: string) => {
    sonnerToast.custom(() => (
      <AnimatedToast type="info" message={message} />
    ))
  }
}

// Export du composant pour affichage direct si besoin
export { AnimatedToast }