export default function SectionHeader({ kicker, title, sub, align = 'start' }: { kicker: string; title: string; sub?: string; align?: 'start' | 'center' }) {
  return (
    <div className={align === 'center' ? 'mx-auto mb-10 max-w-2xl text-center' : 'mb-10 max-w-2xl'}>
      <span className="font-inter text-xs font-bold uppercase tracking-[0.18em] text-safari-600">{kicker}</span>
      <h2 className="mt-2 font-poppins text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">{title}</h2>
      {sub && <p className="mt-3 font-inter text-base leading-relaxed text-muted-foreground">{sub}</p>}
    </div>
  );
}
