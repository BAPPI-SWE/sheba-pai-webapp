/** Small inline icons (no icon library to download). Decorative unless `label` is given. */
const PATHS = {
  phone: "M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.6a1 1 0 0 1-.25 1z",
  whatsapp: "M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-3.3-.8a11.6 11.6 0 0 1-4.6-4.1c-.4-.6-1-1.7-1-3.2 0-1.5.8-2.3 1.1-2.6.3-.3.6-.4.8-.4h.6c.2 0 .5 0 .7.6l.9 2.2c.1.2.1.4 0 .6l-.4.6-.4.5c-.2.2-.3.4-.1.7.2.3.8 1.4 1.8 2.2 1.2 1 2.2 1.4 2.5 1.5.3.2.5.1.7-.1l.9-1.1c.2-.3.4-.2.7-.1l2.1 1c.3.2.5.2.6.4.1.1.1.7-.1 1.3z",
  search: "M10.5 3a7.5 7.5 0 0 1 5.96 12.06l4.24 4.23-1.42 1.42-4.23-4.24A7.5 7.5 0 1 1 10.5 3zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11z",
  shield: "M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm-1.2 13.6-3.4-3.4 1.4-1.4 2 2 4.6-4.6 1.4 1.4-6 6z",
  tag: "M3 3h8l10 10-8 8L3 11V3zm4 2.5A1.5 1.5 0 1 0 7 8.5a1.5 1.5 0 0 0 0-3z",
  cash: "M2 6h20v12H2V6zm10 3a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM5 8v2a2 2 0 0 0 2-2H5zm12 0a2 2 0 0 0 2 2V8h-2zM5 14v2h2a2 2 0 0 0-2-2zm14 0a2 2 0 0 0-2 2h2v-2z",
  menu: "M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z",
  close: "M6.4 5 12 10.6 17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6 10.6 12 5 6.4z",
  ambulance: "M2 7h11v3h4l3 3v4h-2a2.5 2.5 0 0 1-5 0H9a2.5 2.5 0 0 1-5 0H2V7zm5 1v2H5v2h2v2h2v-2h2v-2H9V8H7z",
  play: "M4 2.7v18.6c0 .6.6.9 1.1.6l15.4-9.3a.7.7 0 0 0 0-1.2L5.1 2.1C4.6 1.8 4 2.1 4 2.7z",
};

export default function Icon({ name, size = 20, label, style }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" style={style}
      aria-hidden={label ? undefined : true} role={label ? "img" : undefined} aria-label={label}>
      <path d={PATHS[name]} />
    </svg>
  );
}
