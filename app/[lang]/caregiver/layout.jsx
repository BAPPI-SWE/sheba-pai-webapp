import RequestHost from "@/components/care/RequestHost";

/** Every caregiver page can open the name + phone request sheet. */
export default async function CaregiverLayout({ children, params }) {
  const { lang } = await params;
  return (<>{children}<RequestHost lang={lang} /></>);
}
