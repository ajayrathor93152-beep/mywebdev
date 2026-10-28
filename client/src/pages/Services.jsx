import CtaBand from "@/components/home/CtaBand";
import Faq from "@/components/services/Faq";
import Included from "@/components/services/Included";
import Process from "@/components/services/Process";
import ServiceStack, { ServiceJumpLinks } from "@/components/services/ServiceStack";
import PageIntro from "@/components/ui/PageIntro";

export default function Services() {
  return (
    <>
      <PageIntro
        eyebrow="Services"
        title={
          <>
            Everything you need to own your corner of the{" "}
            <em className="font-serif font-normal italic text-volt-ink">internet.</em>
          </>
        }
      >
        <p>
          Five ways we help businesses look sharper, load faster and sell more — each one designed
          and built from scratch, never from a template.
        </p>
        <ServiceJumpLinks />
      </PageIntro>

      <ServiceStack />
      <Process />
      <Included />
      <Faq />
      <CtaBand />
    </>
  );
}
