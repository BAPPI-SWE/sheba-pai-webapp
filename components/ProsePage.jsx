import { dict } from "@/lib/dict";

/** A plain reading page: tinted heading band + one column of text. */
export default function ProsePage({ lang, doc, showUpdated = true, children }) {
  const t = dict(lang);
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>{doc.title}</h1>
          {doc.intro && <p>{doc.intro}</p>}
          {showUpdated && <p className="updated">{t.updated}: {doc.updated}</p>}
        </div>
      </section>
      <div className="wrap">
        <article className="prose">
          {doc.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              {(s.p || []).map((p, i) => <p key={i}>{p}</p>)}
              {s.list && <ul>{s.list.map((li, i) => <li key={i}>{li}</li>)}</ul>}
              {(s.after || []).map((p, i) => <p key={`a${i}`}>{p}</p>)}
            </section>
          ))}
          {children}
        </article>
      </div>
    </>
  );
}
