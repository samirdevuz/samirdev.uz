export function SectionHead({ num, label }: { num: string; label: string }) {
  return (
    <p className="sec-head reveal">
      <span className="num">[{num}]</span>
      <span>{label}</span>
    </p>
  )
}
