import ArrowRight from "~icons/lucide/arrow-right";
import Mail from "~icons/lucide/mail";
import MailOpen from "~icons/lucide/mail-open";
import Plus from "~icons/lucide/plus";
import { Link } from "react-router";

import { useMyInquiries } from "@/features/inquiries/inquiry-queries";
import { useMyInvites } from "@/features/invites/invites-queries";
import { useMyOrganizations } from "@/features/organizations/organization-queries";
import { useAuthStore } from "@/stores/auth/auth-hooks";
import { generateSEOTags } from "@/lib/utils/seo";

export function meta() {
  return [
    ...generateSEOTags({
      title: "Dashboard | Learning Africa",
      description:
        "Your invitations, inquiries, and organizations on Learning Africa.",
      url: "/dashboard",
      image: "/og.png",
      noIndex: true,
    }),
  ];
}

export default function PersonalHome() {
  const { user } = useAuthStore();
  const { data: orgsData } = useMyOrganizations();
  const { data: invitesData } = useMyInvites();
  const { data: inquiriesData } = useMyInquiries();

  const orgs = orgsData ?? [];
  const invites = invitesData?.data ?? [];
  const inquiries = inquiriesData?.data ?? [];

  const firstName = user?.first_name?.trim() || "there";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <WelcomeCard firstName={firstName} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Stat
          label="Organizations"
          value={orgs.length}
          hint="You're a member"
        />
        <Stat
          label="Pending invitations"
          value={invites.length}
          hint="Action awaiting"
        />
        <Stat
          label="Open inquiries"
          value={inquiries.length}
          hint="Recent requests"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section
          eyebrow="Invitations"
          title="Pending invitations"
          to="/dashboard/invitations"
          actionLabel="View all"
        >
          {invites.length === 0 ? (
            <EmptyHint
              icon={<MailOpen className="size-4" />}
              text="No invitations waiting for you."
            />
          ) : (
            <ul className="space-y-2">
              {invites.slice(0, 3).map((invite) => (
                <li
                  key={invite.id}
                  className="border-la-rule bg-la-paper flex items-center justify-between gap-3 rounded border px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-la-forest text-la-paper font-display grid size-8 shrink-0 place-items-center rounded text-[12px] font-semibold">
                      <Mail className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-la-ink truncate text-[13px] font-semibold">
                        {invite.email}
                      </div>
                      <div className="text-la-muted truncate text-[11px]">
                        {invite.role}
                      </div>
                    </div>
                  </div>
                  <span className="text-la-muted text-[11px]">
                    {invite.is_used ? "Accepted" : "Pending"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section
          eyebrow="Organizations"
          title="My organizations"
          to="/dashboard/orgs"
          actionLabel="Manage"
        >
          {orgs.length === 0 ? (
            <div className="space-y-3">
              <EmptyHint
                icon={<Plus className="size-4" />}
                text="You haven't joined an organization yet."
              />
              <Link
                to="/inquiry"
                prefetch="intent"
                className="border-la-rule bg-la-paper hover:bg-la-forest hover:text-la-paper font-display text-la-ink flex items-center justify-between gap-3 rounded border px-3 py-2 text-[13px] font-semibold transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Mail className="size-4" />
                  Request access
                </span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          ) : (
            <ul className="space-y-2">
              {orgs.slice(0, 3).map((org) => (
                <li
                  key={org.id}
                  className="border-la-rule bg-la-paper flex items-center justify-between gap-3 rounded border px-3 py-2"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="bg-la-forest text-la-paper font-display grid size-8 shrink-0 place-items-center rounded text-[12px] font-semibold">
                      {org.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="font-display text-la-ink truncate text-[13px] font-semibold">
                        {org.name}
                      </div>
                      <div className="text-la-muted truncate text-[11px]">
                        {org.role}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="text-la-muted size-4 shrink-0" />
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}

function WelcomeCard({ firstName }: { firstName: string }) {
  return (
    <section className="bg-la-forest text-la-paper rounded p-6">
      <p className="font-display text-la-paper/80 text-[10px] font-medium tracking-[0.2em] uppercase">
        Welcome back
      </p>
      <h2 className="font-display mt-1 text-2xl font-medium tracking-tight">
        Hi {firstName} — here&apos;s where things stand.
      </h2>
      <p className="mt-2 max-w-xl text-[13px] opacity-80">
        Track invitations, browse the organizations you&apos;re a member of, and
        jump into the workspace you&apos;re working in today.
      </p>
    </section>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="border-la-rule bg-la-paper flex flex-col gap-1 rounded border p-5">
      <p className="la-eyebrow">{label}</p>
      <div className="font-display text-la-ink text-3xl font-medium tracking-tight">
        {value}
      </div>
      <p className="text-la-muted text-[12px]">{hint}</p>
    </div>
  );
}

function Section({
  eyebrow,
  title,
  to,
  actionLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  to: string;
  actionLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-la-rule bg-la-paper rounded border p-5">
      <header className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="la-eyebrow">{eyebrow}</p>
          <h3 className="font-display text-la-ink mt-0.5 text-[18px] font-medium tracking-tight">
            {title}
          </h3>
        </div>
        <Link
          to={to}
          prefetch="intent"
          className="font-display text-la-forest hover:text-la-forest-deep text-[12px] font-medium"
        >
          {actionLabel} →
        </Link>
      </header>
      {children}
    </section>
  );
}

function EmptyHint({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="border-la-rule text-la-muted flex items-center gap-2 rounded border border-dashed px-3 py-4 text-[12px]">
      <span aria-hidden>{icon}</span>
      <span>{text}</span>
    </div>
  );
}
