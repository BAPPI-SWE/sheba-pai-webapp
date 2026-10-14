import Icon from "@/components/Icon";
import site from "@/site.config";
import { dict } from "@/lib/dict";
import { pageMeta } from "@/lib/seo";

export async function generateMetadata({ params }) {
  const { lang } = await params;
  const t = dict(lang);
  return pageMeta({ lang, path: "/contact", title: t.contactTitle, description: t.contactSub });
}

export default async function Contact({ params }) {
  const { lang } = await params;
  const t = dict(lang);
  const map = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address.en)}`;
  return (
    <>
      <section className="page-head">
        <div className="wrap">
          <h1>{t.contactTitle}</h1>
          <p>{t.contactSub}</p>
        </div>
      </section>
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-card">
            <h2><Icon name="phone" size={16} />{t.contactPhone}</h2>
            <a href={`tel:${site.phone}`}>{site.phoneDisplay[lang]}</a>
          </div>
          <div className="contact-card">
            <h2><Icon name="whatsapp" size={16} />{t.contactWa}</h2>
            <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener">{site.phoneDisplay[lang]}</a>
          </div>
          <div className="contact-card">
            <h2>{t.contactEmail}</h2>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <div className="contact-card">
            <h2>{t.contactHours}</h2>
            <p>{site.hours[lang]}</p>
          </div>
          <div className="contact-card contact-wide">
            <h2>{t.contactAddress}</h2>
            <a href={map} target="_blank" rel="noopener">{site.address[lang]}</a>
          </div>
        </div>
      </div>
    </>
  );
}
