import Button from "@/components/ui/Button";
import PageIntro from "@/components/ui/PageIntro";

export default function NotFound() {
  return (
    <PageIntro eyebrow="404" title="This page wandered off.">
      <p className="mb-8">The link may be broken, or the page may have moved.</p>
      <Button to="/">Back home</Button>
    </PageIntro>
  );
}
