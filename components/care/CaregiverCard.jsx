import Link from "next/link";
import CIcon from "@/components/CIcon";
import { CaregiverAvatar, TierBadge, Pill } from "./bits";
import { CallLink, WaLink, RequestButton } from "./Actions";
import { href } from "@/lib/i18n";
import { careIcon, categoryName, districtsText, formatTaka, yearsText } from "@/lib/care";

// tc-keys: careFrom carePriceOnCall careFeatured careBusyNow careNewToPlatform careTier_nurse careTier_trained careTier_attendant careUnit_day8 careUnit_day12 careUnit_night12 careUnit_live24 careUnit_shift12 careUnit_month careUnit_visit careCallShort careMessageShort careBook careWaAboutCaregiver
// cicon-keys: checkmark-circle sparkles time-outline location-outline star call logo-whatsapp calendar

/** The app's CaregiverCard: who, where, from what price — and call / message / book. */
export default function CaregiverCard({ caregiver: c, lang, tx }) {
  const cats = c.categories || [];
  const wa = tx("careWaAboutCaregiver").replace("{name}", c.name).replace("{code}", c.code);
  return (
    <article className="cg-card">
      <div className="cg-card-top">
        <CaregiverAvatar caregiver={c} size={64} showDot />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 className="cg-name">
            <Link href={href(lang, `/caregiver/profile/${c.code}`)} className="stretch">{c.name}</Link>
            <CIcon name="checkmark-circle" size={17} color="var(--primary)" />
          </h3>
          <div className="cg-pills">
            <TierBadge tier={c.tier} tx={tx} />
            {c.featured && <Pill label={tx("careFeatured")} tone="accent" icon="sparkles" />}
            {!c.available && <Pill label={tx("careBusyNow")} tone="muted" icon="time-outline" />}
          </div>
          <p className="cg-meta">
            {c.ratingCount > 0 && <><CIcon name="star" size={13} color="#F59E0B" /><b>{c.ratingAvg.toFixed(1)}</b><span>({c.ratingCount})</span><i>·</i></>}
            <span>{yearsText(tx, lang, c.yearsExperience)}</span>
          </p>
        </div>
      </div>
      <div className="cg-info">
        <CIcon name="location-outline" size={15} color="var(--primary)" />
        <span className="cg-info-text">{districtsText(c.districts, lang)}</span>
        <span className="cg-price">
          {c.fromPrice != null
            ? <><small>{tx("careFrom")} </small>{formatTaka(c.fromPrice)}<small> {tx(`careUnit_${c.fromUnit}`)}</small></>
            : <small>{tx("carePriceOnCall")}</small>}
        </span>
      </div>
      {cats.length > 0 && (
        <div className="cg-cats">
          {cats.slice(0, 2).map((cat) => (
            <span key={cat._id} className="cg-cat"><img src={careIcon(cat.iconKey)} alt="" width={16} height={16} />{categoryName(cat, lang)}</span>
          ))}
          {cats.length > 2 && <span className="cg-cat">+{cats.length - 2}</span>}
        </div>
      )}
      <div className="cg-foot">
        <CallLink className="cg-fbtn call"><CIcon name="call" size={16} />{tx("careCallShort")}</CallLink>
        <WaLink message={wa} className="cg-fbtn wa"><CIcon name="logo-whatsapp" size={17} />{tx("careMessageShort")}</WaLink>
        <RequestButton target={{ caregiver: { code: c.code, name: c.name } }} className="cg-fbtn book"><CIcon name="calendar" size={15} />{tx("careBook")}</RequestButton>
      </div>
    </article>
  );
}
