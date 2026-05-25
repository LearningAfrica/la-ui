import { useMyInquiries } from "@/features/inquiries/inquiry-queries";

export default function PersonalInquiriesPage() {
  const { data, isLoading } = useMyInquiries();
  const inquiries = data?.data ?? [];

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <header>
        <p className="la-eyebrow">Inquiries</p>
        <h2 className="font-display text-la-ink mt-1 text-2xl font-medium tracking-tight">
          Your inquiries
        </h2>
        <p className="text-la-muted mt-1 text-[13px]">
          Organization onboarding requests you&apos;ve submitted.
        </p>
      </header>

      {isLoading ? (
        <div className="text-la-muted text-[12px]">Loading…</div>
      ) : inquiries.length === 0 ? (
        <div className="border-la-rule text-la-muted rounded border border-dashed p-6 text-center text-[13px]">
          You haven&apos;t submitted any inquiries yet.
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {inquiries.map((inquiry) => (
            <li
              key={inquiry.id}
              className="border-la-rule bg-la-paper rounded border px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-display text-la-ink text-[14px] font-semibold">
                  {inquiry.company_name}
                </div>
                <span className="text-la-muted text-[12px] capitalize">
                  {inquiry.status}
                </span>
              </div>
              <p className="text-la-muted mt-1 text-[12px]">
                {inquiry.company_category} · {inquiry.company_size}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
