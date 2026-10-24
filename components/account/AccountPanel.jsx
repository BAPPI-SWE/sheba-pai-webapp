"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CIcon from "@/components/CIcon";
import Field from "@/components/ui/Field";
import Sheet from "@/components/doctors/Sheet";
import { apiFetch } from "@/lib/client/api";
import { clearSession, useSession } from "@/lib/client/session";
import { makeT } from "@/lib/client/text";
import { fmtDate } from "@/lib/datetime";

// tc-keys: delBlock_BAD_PASSWORD delBlock_ACTIVE_REQUEST delBlock_ACTIVE_ORDER delBlock_ACTIVE_JOB delBlock_COMMISSION_DUE delBlock_ACTIVE_DELIVERY delBlock_SHOP_ORDERS

/** Top of the Profile screen: guest → "Log in"; signed in → name, phone, member since. */
export function AccountHeader({ lang }) {
  const tc = makeT(lang);
  const s = useSession();
  const [me, setMe] = useState(null);
  useEffect(() => { if (s.loggedIn) apiFetch("/api/me").then((r) => r.ok && setMe(r.data)); }, [s.loggedIn]);
  if (!s.ready) return <div className="skel" style={{ height: 96, marginBottom: 24 }} />;
  const login = lang === "en" ? "/en/login?next=/en/account" : "/login?next=/account";

  if (!s.loggedIn) {
    return (
      <div className="card card-pad" style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span className="icircle tone-helper" style={{ width: 56, height: 56 }}><CIcon name="person" size={26} color="var(--primary)" /></span>
          <div style={{ flex: 1 }}>
            <strong style={{ fontSize: 18, fontWeight: 800 }}>{tc("activityGuestTitle")}</strong>
            <p className="muted" style={{ fontSize: 14, marginTop: 2, lineHeight: 1.5 }}>{tc("authPhoneSub")}</p>
          </div>
        </div>
        <Link href={login} className="btn-app" style={{ marginTop: 16 }}><CIcon name="log-in-outline" size={19} />{tc("login")}</Link>
      </div>
    );
  }
  const u = me || s.user;
  return (
    <div className="card card-pad" style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
      <span className="icircle tone-helper" style={{ width: 56, height: 56 }}><CIcon name="person" size={26} color="var(--primary)" /></span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong style={{ fontSize: 19, fontWeight: 800, display: "block" }}>{u.name}</strong>
        <p className="muted" style={{ fontSize: 15, marginTop: 2, letterSpacing: .3 }}>{u.phone}</p>
        {me?.createdAt && <p style={{ fontSize: 13, color: "var(--text-light)", marginTop: 2 }}>{tc("profMemberSince")} {fmtDate(me.createdAt, lang)}</p>}
      </div>
    </div>
  );
}

/** Signed-in only: change password, log out, delete account. */
export function AccountActions({ lang }) {
  const tc = makeT(lang);
  const s = useSession();
  const router = useRouter();
  const [sheet, setSheet] = useState(null); // "password" | "delete"
  const [cur, setCur] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(null); const [busy, setBusy] = useState(false); const [msg, setMsg] = useState(null);
  if (!s.ready || !s.loggedIn) return null;
  const close = () => { setSheet(null); setCur(""); setPw(""); setErr(null); };
  const home = lang === "en" ? "/en" : "/";

  async function changePassword() {
    if (pw.length < 6) { setErr(tc("authErrShortPassword")); return; }
    setBusy(true); setErr(null);
    const r = await apiFetch("/api/me/password", { method: "POST", body: { currentPassword: cur, newPassword: pw } }).catch(() => null);
    setBusy(false);
    if (!r) { setErr(tc("connectionFailed")); return; }
    if (!r.ok) { setErr(r.data?.code === "WRONG_PASSWORD" ? tc("authErrWrongPassword") : r.data?.error || tc("failed")); return; }
    close(); setMsg(tc("webPasswordChanged")); setTimeout(() => setMsg(null), 2500);
  }
  async function deleteAccount() {
    if (!cur) { setErr(tc("delPasswordRequired")); return; }
    if (!window.confirm(tc("webDeleteConfirm"))) return;
    setBusy(true); setErr(null);
    const r = await apiFetch("/api/me", { method: "DELETE", body: { password: cur } }).catch(() => null);
    setBusy(false);
    if (!r) { setErr(tc("connectionFailed")); return; }
    if (!r.ok) { const k = r.data?.code; setErr(k ? tc(`delBlock_${k}`, { amount: r.data.amount ?? "" }) : r.data?.error || tc("delFailed")); return; }
    clearSession(); close(); router.replace(home);
  }
  function logout() { if (window.confirm(tc("webLogoutConfirm"))) { clearSession(); router.replace(home); } }

  return (
    <>
      <h2 className="section-title sp">{tc("webMyAccount")}</h2>
      <ul className="glist">
        <li><button type="button" className="grow" onClick={() => setSheet("password")}>
          <span className="icircle tone-primary" style={{ width: 40, height: 40 }}><CIcon name="key-outline" size={19} /></span>
          <span className="grow-main"><span className="grow-title">{tc("authChangeTitle")}</span></span>
          <CIcon name="chevron-forward" size={18} color="var(--border-strong)" />
        </button></li>
        <li><button type="button" className="grow" onClick={logout}>
          <span className="icircle tone-warning" style={{ width: 40, height: 40 }}><CIcon name="log-out-outline" size={19} /></span>
          <span className="grow-main"><span className="grow-title">{tc("logout")}</span></span>
          <CIcon name="chevron-forward" size={18} color="var(--border-strong)" />
        </button></li>
        <li><button type="button" className="grow" onClick={() => setSheet("delete")}>
          <span className="icircle tone-danger" style={{ width: 40, height: 40 }}><CIcon name="trash-outline" size={19} /></span>
          <span className="grow-main"><span className="grow-title" style={{ color: "var(--danger)" }}>{tc("delTitle")}</span></span>
          <CIcon name="chevron-forward" size={18} color="var(--border-strong)" />
        </button></li>
      </ul>

      <Sheet open={sheet === "password"} onClose={close} label={tc("authChangeTitle")}>
        <h2 style={{ marginBottom: 16 }}>{tc("authChangeTitle")}</h2>
        <form onSubmit={(e) => { e.preventDefault(); changePassword(); }}>
          <Field label={tc("webCurrentPassword")} value={cur} onChange={setCur} type="password" secureToggle autoComplete="current-password" autoFocus />
          <Field label={tc("authNewPassword")} value={pw} onChange={setPw} type="password" secureToggle placeholder={tc("authPasswordMin")} autoComplete="new-password" error={err} />
          <button className="btn-app" disabled={busy}>{busy ? "···" : tc("webSave")}</button>
        </form>
      </Sheet>

      <Sheet open={sheet === "delete"} onClose={close} label={tc("delTitle")}>
        <h2>{tc("delTitle")}</h2>
        <p className="sheet-sub" style={{ lineHeight: 1.5 }}>{tc("delLead")}</p>
        <div className="note-card" style={{ background: "var(--danger-soft)", color: "var(--danger)" }}><CIcon name="information-circle" size={20} /><span>{tc("delCannotUndo")}</span></div>
        <form onSubmit={(e) => { e.preventDefault(); deleteAccount(); }}>
          <Field label={tc("delPasswordLabel")} value={cur} onChange={setCur} type="password" secureToggle autoComplete="current-password" error={err} />
          <button className="btn-app" style={{ background: "var(--danger)" }} disabled={busy}>{busy ? "···" : tc("delButton")}</button>
          <button type="button" className="text-link" onClick={close}>{tc("delKeepAccount")}</button>
        </form>
      </Sheet>
      {msg && <div className="toast" role="status">{msg}</div>}
    </>
  );
}
