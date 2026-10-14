import { notFound } from "next/navigation";

// Any unknown address inside the site → the branded not-found page (with header and footer).
export const dynamicParams = true;
export default function CatchAll() { notFound(); }
