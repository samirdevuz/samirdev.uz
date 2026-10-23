import type { ReactNode } from 'react'

// One content section: a small label on the left, the content on the right.
export function Block({ id, label, children }: { id?: string; label: string; children: ReactNode }) {
  return (
    <section className="block" id={id}>
      <div className="container block__grid">
        <h2 className="block__label reveal">{label}</h2>
        <div className="block__body">{children}</div>
      </div>
    </section>
  )
}
