type HeaderProps = {
  currentStatus?: string
  nextRoundStatus?: string
}

export default function Header({currentStatus = '', nextRoundStatus = ''}: HeaderProps) {
  return (
    <div className="mb-2 flex items-center archivo-black-regular ">
      <div className="inline-flex items-center gap-3 border border-neutral-200/70 glass-lite px-5 py-3 shadow-lg backdrop-blur-md">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight">
          <span className="text-neutral-900">Rogue-Like </span>
          <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
            UNO
          </span>
        </h1>
        <span className="ml-2 rounded-full bg-neutral-900/90 px-2 py-0.5 text-xs font-semibold text-white">
          v0.1
        </span>  
      </div>
      <div className='ml-auto inline-flex'>
        {currentStatus &&
          <span className="glass-lite p-3 font-medium">{currentStatus}</span>
        }
      </div>
    </div>
  )
}