"use client";
import { useId, useState } from "react";
import CIcon from "@/components/CIcon";

/** The app's labelled input (components.js Field): label, placeholder, error, optional show/hide password. */
export default function Field({ label, value, onChange, placeholder, type = "text", error, hint, multiline, maxLength, secureToggle, autoFocus, inputMode, autoComplete, onEnter, enterKeyHint, name }) {
  const id = useId();
  const [reveal, setReveal] = useState(false);
  const isPass = type === "password";
  const common = {
    id, name, value, placeholder, maxLength, autoFocus, inputMode, autoComplete, enterKeyHint,
    onChange: (e) => onChange(e.target.value),
    onKeyDown: onEnter ? (e) => { if (e.key === "Enter" && !multiline) { e.preventDefault(); onEnter(); } } : undefined,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error || hint ? `${id}-msg` : undefined,
  };
  return (
    <div className={`field ${error ? "err" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className={`input-wrap ${secureToggle && isPass ? "has-eye" : ""}`}>
        {multiline
          ? <textarea className="textarea" rows={3} {...common} />
          : <input className="input" type={isPass && reveal ? "text" : type} {...common} />}
        {secureToggle && isPass && (
          <button type="button" className="eye" onClick={() => setReveal((r) => !r)} aria-label={reveal ? "Hide password" : "Show password"}>
            <CIcon name={reveal ? "eye-off-outline" : "eye-outline"} size={22} />
          </button>
        )}
      </div>
      {error ? <p className="field-error" id={`${id}-msg`} role="alert">{error}</p> : hint ? <p className="field-hint" id={`${id}-msg`}>{hint}</p> : null}
    </div>
  );
}
