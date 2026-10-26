/** Bande rose qui défile en biais sous le bandeau d'accueil. */
export function Defile({ mots }: { mots: string[] }) {
  if (!mots.length) return null
  const serie = (cache: boolean) => (
    <div aria-hidden={cache || undefined} className="kk-display flex items-center gap-7 pr-7 text-[clamp(24px,2.6vw,32px)] whitespace-nowrap text-encre">
      {mots.map((m, i) => (
        <span key={i} className="contents">
          <span>{m.toUpperCase()}</span>
          <span aria-hidden="true">✦</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className="relative z-[3] -mt-[26px] -ml-[2%] w-[104%] -rotate-[1.6deg] overflow-hidden border-y-[3px] border-encre bg-rose py-3.5">
      <div className="flex w-max animate-marquee">
        {serie(false)}
        {serie(true)}
      </div>
    </div>
  )
}
