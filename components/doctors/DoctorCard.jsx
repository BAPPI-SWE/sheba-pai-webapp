import Link from "next/link";
import CIcon from "@/components/CIcon";
import CallButton from "./CallButton";
import { href } from "@/lib/i18n";
import { doctorName, specialtyName, placeLabel, initials } from "@/lib/doctors";

/** Number in the page language: ৳১৫০০ / ৳1500 — the app shows plain digits too. */
const money = (n) => `৳${n}`;

export function DoctorAvatar({ doctor, size = 56 }) {
  return (
    <span className="avatar-fb" style={{ width: size, height: size, fontSize: size * 0.34 }}>
      {doctor.photoUrl
        ? <img src={doctor.photoUrl} alt="" width={size} height={size} loading="lazy" />
        : initials(doctor.name)}
    </span>
  );
}

/** Same card as the app's DoctorCard: who, where, when, fees, call. */
export default function DoctorCard({ doctor: d, lang, L, showSpecialty = false, headingLevel = 3 }) {
  const H = `h${headingLevel}`;
  const where = [d.area, placeLabel(d.district, lang)].filter(Boolean).join(", ");
  const schedule = [d.visitingDays, d.visitingHours].filter(Boolean).join(" · ");
  const name = doctorName(d, lang);
  const url = href(lang, `/doctor/${d.slug}`);
  return (
    <article className="dcard" style={{ position: "relative" }}>
      <div className="dcard-top">
        <DoctorAvatar doctor={d} size={58} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <H className="dname"><Link href={url} className="stretch">{name}</Link></H>
          {!!d.degrees && <p className="ddeg">{d.degrees}</p>}
          {showSpecialty && d.specialty && <p className="dspec">{specialtyName(d.specialty, lang)}</p>}
          {!!(d.designation || d.workplace) && <p className="dwork">{[d.designation, d.workplace].filter(Boolean).join(", ")}</p>}
        </div>
      </div>
      {(d.chamberName || where || schedule) && (
        <div className="dinfo">
          {!!(d.chamberName || where) && (
            <p className="dline"><CIcon name="location-outline" size={15} /><span>{[d.chamberName, where].filter(Boolean).join(" — ")}</span></p>
          )}
          {!!schedule && <p className="dline"><CIcon name="time-outline" size={15} /><span>{schedule}</span></p>}
        </div>
      )}
      <div className="dfoot">
        <div className="dfees">
          {(d.newPatientFee != null || d.followUpFee != null) && (
            <span>
              {d.newPatientFee != null && <>{L.docNewPatient} <b>{money(d.newPatientFee)}</b></>}
              {d.followUpFee != null && <>{d.newPatientFee != null ? "  ·  " : ""}{L.docFollowUp} <b>{money(d.followUpFee)}</b></>}
            </span>
          )}
          {d.onlineConsultation && <span className="pill-badge online"><CIcon name="videocam" size={11} />{L.docOnlineAvailable}</span>}
        </div>
        <span style={{ position: "relative", zIndex: 2 }}>
          <CallButton phones={d.phones} title={name} sub={d.chamberName} label={L.docCall} L={L} />
        </span>
      </div>
    </article>
  );
}
