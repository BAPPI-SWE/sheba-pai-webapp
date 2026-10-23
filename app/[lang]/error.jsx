"use client";
import CIcon from "@/components/CIcon";

/** The app's ErrorState — shown if the server could not be reached. */
export default function Error({ reset }) {
  const en = typeof window !== "undefined" && window.location.pathname.startsWith("/en");
  return (
    <div className="body">
      <div className="empty">
        <span className="icircle tone-danger" style={{ width: 72, height: 72 }}><CIcon name="cloud-offline-outline" size={32} /></span>
        <h2>{en ? "Couldn't load this page" : "পেজটি লোড করা যায়নি"}</h2>
        <p>{en ? "Check your internet connection and try again." : "ইন্টারনেট সংযোগ দেখে আবার চেষ্টা করুন।"}</p>
        <button className="btn btn-primary" onClick={() => reset()}>{en ? "Try again" : "আবার চেষ্টা করুন"}</button>
      </div>
    </div>
  );
}
