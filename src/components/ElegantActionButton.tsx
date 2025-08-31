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
    danger: 'from-slate-100/80 via-slate-50/70 to-slate-100/80 hover:from-slate-200/90 hover:via-slate-100/80 hover:to-slate-200/90 border-slate-300/40 hover:border-slate-400/50 text-slate-800 hover:text-slate-900'
  }

  return (
    <Button
      onClick={onClick}
      className={`
        w-full py-3 bg-gradient-to-r ${variantStyles[variant]}
        ${variant === 'danger' ? '' : 'text-white'} border rounded-xl backdrop-blur-xl shadow-xl
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