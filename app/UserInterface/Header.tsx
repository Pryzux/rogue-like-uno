type HeaderProps = {
  currentStatus?: string
  nextRoundStatus?: string
}

export default function Header({ currentStatus = '', nextRoundStatus = '' }: HeaderProps) {
  return (
    <div className="mb-2 flex items-center gap-2 sm:gap-4 archivo-black-regular">
      <div className="inline-flex items-center gap-1 sm:gap-3 border border-white/20 rounded-xl drop-shadow-lg bg-white/40 px-3 sm:px-5 py-2 sm:py-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold leading-none tracking-tight">
          <span className="text-neutral-900"> </span>
          <span className="bg-gradient-to-r from-rose-500 via-amber-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
            Rogue-Like UNO
          </span>
        </h1>
        <span className="ml-1 sm:ml-2 rounded-full bg-neutral-900/90 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold text-white">
          v0.2
        </span>
      </div>
      <div className='ml-auto inline-flex'>
        {currentStatus &&
          <span className="border border-white/20 rounded-xl drop-shadow-lg bg-white/40 px-2 sm:px-3 py-2 sm:py-3 text-xl sm:text-3xl font-extrabold leading-none tracking-tight whitespace-nowrap">
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">Round </span>
            <span className="bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
              {currentStatus.replace('Round ', '')}
            </span>
          </span>
        }
      </div>
    </div>
  )
}