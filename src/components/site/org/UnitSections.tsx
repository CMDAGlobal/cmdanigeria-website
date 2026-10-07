import {
  ExternalLink,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
} from "lucide-react";

import { Reveal, Section, SectionHead } from "@/components/site/primitives";
import type { ContactInfo, PostRecord, ResourceItem, SocialLinks } from "@/sanity/types";
import { NewsCard } from "./cards";

type IconComponent = typeof Mail;

const SOCIAL: Array<{ key: keyof SocialLinks; label: string; icon: IconComponent }> = [
  { key: "instagram", label: "Instagram", icon: Instagram },
  { key: "facebook", label: "Facebook", icon: Facebook },
  { key: "x", label: "X", icon: Twitter },
  { key: "whatsapp", label: "WhatsApp", icon: MessageCircle },
];

const KIND_LABEL: Record<string, string> = {
  document: "Document",
  form: "Form",
  video: "Video",
  tool: "Tool",
  other: "Resource",
};

const filled = (value?: string | null): value is string =>
  typeof value === "string" && value.trim().length > 0;

function Detail({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: IconComponent;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <div className="flex items-start gap-4">
      <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-cmda-green/10 text-cmda-green">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 break-words text-base text-foreground">{value}</p>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="group block rounded-xl transition hover:bg-cmda-green/5">
      {body}
    </a>
  ) : (
    body
  );
}

export function ContactSection({
  contact,
  social,
}: {
  contact?: ContactInfo | null | undefined;
  social?: SocialLinks | null | undefined;
}) {
  const email = contact?.email;
  const phone = contact?.phone;
  const address = contact?.address;
  const socials = SOCIAL.filter((entry) => filled(social?.[entry.key]));
  if (!filled(email) && !filled(phone) && !filled(address) && socials.length === 0) return null;

  return (
    <Section className="paper" id="contact">
      <SectionHead eyebrow="Contact" title="Get in touch" />
      <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {filled(email) && (
          <Detail icon={Mail} label="Email" value={email} href={`mailto:${email}`} />
        )}
        {filled(phone) && <Detail icon={Phone} label="Phone" value={phone} href={`tel:${phone}`} />}
        {filled(address) && <Detail icon={MapPin} label="Address" value={address} />}
      </div>
      {socials.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-3">
          {socials.map(({ key, label, icon: Icon }) => (
            <a
              key={key}
              href={social?.[key] ?? ""}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition hover:border-cmda-green hover:text-cmda-green"
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </a>
          ))}
        </div>
      )}
    </Section>
  );
}

export function ResourcesSection({
  resources,
  title = "Resources",
  tone = "bg-muted",
}: {
  resources?: ResourceItem[] | null | undefined;
  title?: string;
  tone?: string;
}) {
  const items = (resources ?? []).filter((item) => filled(item?.title));
  if (items.length === 0) return null;

  return (
    <Section className={tone} id="resources">
      <SectionHead eyebrow="Resources" title={title} />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const card = (
            <div className="flex h-full flex-col rounded-xl border border-border bg-background p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                <span className="rounded-full bg-cmda-green/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cmda-green">
                  {KIND_LABEL[item.kind ?? ""] ?? "Resource"}
                </span>
              </div>
              {filled(item.description) && (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>
              )}
              {filled(item.url) && (
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-cmda-green">
                  Open <ExternalLink className="size-4" aria-hidden="true" />
                </span>
              )}
            </div>
          );
          return filled(item.url) ? (
            <a
              key={`${item.title}-${index}`}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="block transition hover:-translate-y-1"
            >
              {card}
            </a>
          ) : (
            <div key={`${item.title}-${index}`}>{card}</div>
          );
        })}
      </div>
    </Section>
  );
}

export function NewsSection({
  news,
  title = "Latest news",
}: {
  news?: PostRecord[] | null | undefined;
  title?: string;
}) {
  const items = (news ?? []).slice(0, 6);
  if (items.length === 0) return null;

  return (
    <Section className="paper" id="news">
      <SectionHead eyebrow="News" title={title} />
      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((post, index) => (
          <Reveal key={`${post._id}-${index}`}>
            <NewsCard post={post} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
