import { Button } from './ui/button'

interface ElegantActionButtonProps {
  onClick: () => void
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

const ElegantActionButton = ({ onClick, children, variant = 'primary' }: ElegantActionButtonProps) => {
  const variantStyles = {
    primary: 'from-slate-900/80 via-slate-800/70 to-slate-900/80 hover:from-slate-800/90 hover:via-slate-700/80 hover:to-slate-800/90 border-slate-600/30 hover:border-slate-500/40',
    secondary: 'from-blue-900/60 via-blue-800/50 to-blue-900/60 hover:from-blue-800/70 hover:via-blue-700/60 hover:to-blue-800/70 border-blue-600/30 hover:border-blue-500/40',
    danger: 'from-red-900/60 via-red-800/50 to-red-900/60 hover:from-red-800/70 hover:via-red-700/60 hover:to-red-800/70 border-red-600/30 hover:border-red-500/40'
  }

  return (
    <Button
      onClick={onClick}
      className={`
        w-full py-3 bg-gradient-to-r ${variantStyles[variant]}
        text-white border rounded-xl backdrop-blur-xl shadow-xl
        transition-all duration-300 font-light tracking-wide
        hover:shadow-2xl transform hover:scale-[1.02]
      `}
    >
      {children}
    </Button>
  )
}

export default ElegantActionButton
export type { ElegantActionButtonProps }