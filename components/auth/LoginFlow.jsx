"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import CIcon from "@/components/CIcon";
import Field from "@/components/ui/Field";
import site from "@/site.config";
import { apiFetch, getPublicSettings, normalizePhone } from "@/lib/client/api";
import { saveSession, useSession } from "@/lib/client/session";
import { makeT } from "@/lib/client/text";

// tc-keys: authPartnerSub_helper authPartnerSub_rider authPartnerSub_shop authErrNoAccount authErrWrongPassword authErrTooMany authErrShortPassword authErrPhoneTaken
const ERR = { NO_ACCOUNT: "authErrNoAccount", WRONG_PASSWORD: "authErrWrongPassword", TOO_MANY_ATTEMPTS: "authErrTooMany", BAD_PHONE: "fcErrPhone", SHORT_PASSWORD: "authErrShortPassword", PHONE_TAKEN: "authErrPhoneTaken", BAD_NAME: "fcErrName" };

/** Only same-site paths are allowed as "come back to" targets. */
function safeNext(n, lang) {
  if (n && n.startsWith("/") && !n.startsWith("//")) return n;
  return lang === "en" ? "/en" : "/";
}

/**
 * The app's LoginScreen, step for step:
 *   phone → registered: password · new: name + password (signed in at once) · partner: use the app
 *   SMS codes (when switched on in the backend) for new accounts and "forgot password".
 */
export default function LoginFlow({ lang }) {
  const tc = makeT(lang);
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"), lang);
  const session = useSession();

  const [step, setStep] = useState("phone"); // phone | password | signup | otp | reset | partner
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [otpFor, setOtpFor] = useState(null); // "signup" | "reset"
  const [error, setError] = useState(null);
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [otpRequired, setOtpRequired] = useState(false);
  const [support, setSupport] = useState(site.phone);

  useEffect(() => {
    apiFetch("/api/auth/config").then((r) => setOtpRequired(!!r.data?.otpRequired)).catch(() => {});
    getPublicSettings().then((s) => setSupport(s.careContactNumber || s.emergencyContactNumber || site.phone));
  }, []);

  // Already signed in (another tab, or coming back) → straight on.
  useEffect(() => { if (session.ready && session.loggedIn && session.user?.role === "patient" && step === "phone") router.replace(next); }, [session.ready, session.loggedIn]); // eslint-disable-line

  const errText = (d, fb = "failed") => (d && ERR[d.code] ? tc(ERR[d.code]) : d?.error || tc(fb));
  const done = (d) => { saveSession(d); router.replace(next); };
  function backToPhone() { setStep("phone"); setPassword(""); setCode(""); setError(null); setInfo(null); }

  async function run(fn) {
    setLoading(true); setError(null);
    try { await fn(); } catch { setError(tc("connectionFailed")); } finally { setLoading(false); }
  }

  const checkPhone = () => {
    const n = normalizePhone(phone);
    if (!n) { setError(tc("fcErrPhone")); return; }
    run(async () => {
      const r = await apiFetch("/api/auth/check-phone", { method: "POST", body: { phone: n } });
      if (!r.ok) { setError(errText(r.data)); return; }
      setPhone(n);
      if (r.data.status === "new") { setAccount(null); setStep("signup"); return; }
      setAccount(r.data);
      setStep(r.data.role === "patient" ? "password" : "partner");
    });
  };

  const login = () => {
    if (!password) { setError(tc("authErrEnterPassword")); return; }
    run(async () => {
      const r = await apiFetch("/api/auth/login", { method: "POST", body: { phone, password } });
      if (!r.ok) { setError(errText(r.data, "loginFailed")); return; }
      if (r.data.user.role !== "patient") { setAccount({ role: r.data.user.role }); setStep("partner"); return; }
      done(r.data);
    });
  };

  const sendCode = (purpose) => run(async () => {
    const r = await apiFetch("/api/auth/send-otp", { method: "POST", body: { phone } });
    if (!r.ok) { setError(r.data?.error || tc("failed")); return; }
    setOtpFor(purpose); setCode(""); setInfo(`${tc("otpSentTo")} ${phone}`); setStep(purpose === "reset" ? "reset" : "otp");
  });

  const signup = () => {
    if (name.trim().length < 2) { setError(tc("fcErrName")); return; }
    if (password.length < 6) { setError(tc("authErrShortPassword")); return; }
    if (otpRequired) { sendCode("signup"); return; }
    createAccount();
  };
  const createAccount = () => run(async () => {
    const r = await apiFetch("/api/auth/signup", { method: "POST", body: { name: name.trim(), phone, password, role: "patient" } });
    if (!r.ok) {
      if (r.data?.code === "PHONE_TAKEN") { setAccount({ role: "patient" }); setStep("password"); }
      setError(errText(r.data, "signupFailed")); return;
    }
    done(r.data); // signed in straight away — no second login
  });

  const verifyThen = () => {
    if (code.length !== 6) { setError(tc("otpEnterSixDigits")); return; }
    if (otpFor === "reset" && password.length < 6) { setError(tc("authErrShortPassword")); return; }
    run(async () => {
      const v = await apiFetch("/api/auth/verify-otp", { method: "POST", body: { phone, otp: code } });
      if (!v.ok) { setError(v.data?.error || tc("failed")); return; }
      if (otpFor === "signup") {
        const r = await apiFetch("/api/auth/signup", { method: "POST", body: { name: name.trim(), phone, password, role: "patient" } });
        if (!r.ok) { setError(errText(r.data, "signupFailed")); return; }
        done(r.data);
      } else {
        const r = await apiFetch("/api/auth/reset-password", { method: "POST", body: { phone, newPassword: password } });
        if (!r.ok) { setError(errText(r.data)); return; }
        done(r.data);
      }
    });
  };

  const forgot = () => {
    if (otpRequired) { setPassword(""); sendCode("reset"); return; }
    setStep("forgot"); setError(null);
  };

  const heading = {
    phone: tc("authPhoneTitle"),
    password: account?.name ? tc("authWelcomeBack", { name: account.name }) : tc("authEnterPassword"),
    signup: tc("authCreateTitle"), otp: tc("otpTitle"), reset: tc("authForgotTitle"), forgot: tc("authForgotTitle"),
    partner: tc("authPartnerTitle"),
  }[step];
  const sub = {
    phone: tc("authPhoneSub"), password: tc("authPasswordSub"), signup: tc("authCreateSub"),
    otp: info, reset: info, forgot: tc("authForgotCallMsg"),
    partner: account?.role ? tc(`authPartnerSub_${account.role}`) : "",
  }[step];

  const legal = (
    <p className="consent">
      {tc("legalConsentPrefix")}{" "}
      <Link href={lang === "en" ? "/en/terms" : "/terms"}>{tc("legalTerms")}</Link>{` ${tc("legalAnd")} `}
      <Link href={lang === "en" ? "/en/privacy" : "/privacy"}>{tc("legalPrivacy")}</Link>{tc("legalSuffix")}
    </p>
  );

  return (
    <div className="auth">
      <div className="auth-head">
        <img src="/img/logo.png" alt="" width={68} height={68} />
        <h1>{heading}</h1>
        {!!sub && <p>{sub}</p>}
      </div>

      {step !== "phone" && (
        <button type="button" className="phone-chip" onClick={backToPhone}>
          <CIcon name="call-outline" size={16} /><b>{phone}</b><span>{tc("authChange")}</span>
        </button>
      )}

      <form onSubmit={(e) => { e.preventDefault(); ({ phone: checkPhone, password: login, signup, otp: verifyThen, reset: verifyThen })[step]?.(); }} noValidate>
        {step === "phone" && (
          <>
            <Field label={tc("phone")} value={phone} onChange={(v) => { setPhone(v); setError(null); }} placeholder="01XXXXXXXXX"
              type="tel" inputMode="tel" autoComplete="tel" autoFocus error={error} enterKeyHint="next" />
            <button className="btn-app" disabled={loading}><CIcon name="arrow-forward" size={19} />{loading ? "···" : tc("continueBtn")}</button>
            <p className="small-note">{tc("authPhoneHint")}</p>
          </>
        )}

        {step === "password" && (
          <>
            <Field label={tc("password")} value={password} onChange={(v) => { setPassword(v); setError(null); }} placeholder={tc("passwordHint")}
              type="password" secureToggle autoFocus autoComplete="current-password" error={error} enterKeyHint="go" />
            <button className="btn-app" disabled={loading}><CIcon name="log-in-outline" size={19} />{loading ? "···" : tc("login")}</button>
            <button type="button" className="text-link" onClick={forgot}>{tc("authForgot")}</button>
          </>
        )}

        {step === "signup" && (
          <>
            <Field label={tc("fullName")} value={name} onChange={(v) => { setName(v); setError(null); }} placeholder={tc("fullNameHint")} autoFocus autoComplete="name" />
            <Field label={tc("authNewPassword")} value={password} onChange={(v) => { setPassword(v); setError(null); }} placeholder={tc("authPasswordMin")}
              type="password" secureToggle autoComplete="new-password" error={error} enterKeyHint="go" />
            <button className="btn-app" disabled={loading}><CIcon name="person-add-outline" size={19} />{loading ? "···" : otpRequired ? tc("continueBtn") : tc("authCreateBtn")}</button>
            {legal}
          </>
        )}

        {(step === "otp" || step === "reset") && (
          <>
            <input className="otp-input" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(null); }}
              placeholder="––––––" inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus aria-label={tc("otpTitle")} />
            {step === "reset" && (
              <Field label={tc("authNewPassword")} value={password} onChange={setPassword} placeholder={tc("authPasswordMin")} type="password" secureToggle autoComplete="new-password" />
            )}
            {error && <p className="field-error" role="alert" style={{ textAlign: "center", marginBottom: 12 }}>{error}</p>}
            <button className="btn-app" disabled={loading}>{loading ? "···" : step === "reset" ? tc("authResetBtn") : tc("otpVerifyBtn")}</button>
            <button type="button" className="text-link" onClick={() => sendCode(otpFor)}>{tc("otpResendBtn")}</button>
          </>
        )}
      </form>

      {step === "forgot" && (
        <>
          <a href={`tel:${support}`} className="btn-app"><CIcon name="call" size={19} />{tc("careCallUs")}</a>
          <button type="button" className="text-link" onClick={() => setStep("password")}>{tc("webBack")}</button>
        </>
      )}

      {step === "partner" && (
        <>
          <div className="note-card"><CIcon name="information-circle" size={22} /><span>{tc("webPartnerApp")}</span></div>
          <a href={site.playStoreUrl} className="btn-app helper" target="_blank" rel="noopener">{tc("webGetApp")}</a>
          <button type="button" className="text-link" onClick={backToPhone}>{tc("authOtherNumber")}</button>
        </>
      )}
    </div>
  );
}
