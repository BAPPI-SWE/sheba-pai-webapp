import Screen from "@/components/Screen";
import { dict } from "@/lib/dict";
import { href } from "@/lib/i18n";

/** A reading page in the app's look: screen header, then one card per section. */
export default function ProsePage({ lang, doc, showUpdated = true, children }) {
  const t = dict(lang);
  return (
    <Screen title={doc.title} back={href(lang, "/account")} backLabel={t.backHome}>
      <div className="narrow">
        {doc.intro && <p className="lead">{doc.intro}</p>}
        {showUpdated && <p className="updated">{t.updated}: {doc.updated}</p>}
        {doc.sections.map((s) => (
          <section key={s.h} className="prose-card">
            <h2>{s.h}</h2>
            {(s.p || []).map((p, i) => <p key={i}>{p}</p>)}
            {s.list && <ul>{s.list.map((li, i) => <li key={i}>{li}</li>)}</ul>}
            {(s.after || []).map((p, i) => <p key={`a${i}`} style={{ marginTop: 10 }}>{p}</p>)}
          </section>
        ))}
        {children}
      </div>
    </Screen>
  );
}
