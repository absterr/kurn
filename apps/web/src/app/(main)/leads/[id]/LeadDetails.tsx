"use client";
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  Send,
  Stethoscope,
  Wifi,
  WifiOff,
} from "lucide-react";
import type { Lead } from "./mockLeads";

export default function LeadDetails({ lead }: { lead: Lead }) {
  return (
    <div className="flex flex-col">
      <ContactInfo lead={lead} />

      {lead.auditDiagnosis.length > 0 && (
        <div className="flex flex-col gap-4 py-6 border-t">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Stethoscope className="size-3.5" />
            Audit Diagnosis
          </p>
          <ul className="flex flex-col gap-2">
            {lead.auditDiagnosis.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 size-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {lead.emailDraft && (
        <div className="flex flex-col gap-4 py-6 border-t">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Send className="size-3.5" />
            Email Draft
          </p>
          <div className="rounded-md border bg-muted/30 p-3 flex flex-col gap-2">
            <p className="text-xs font-medium text-muted-foreground">Subject</p>
            <p className="text-sm font-medium">{lead.emailDraft.subject}</p>
            <div className="py-1">
              <hr />
            </div>
            <p className="text-xs font-medium text-muted-foreground">Body</p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">
              {lead.emailDraft.body}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

const ContactInfo = ({ lead }: { lead: Lead }) => (
  <div className="flex flex-col gap-4 pb-6">
    <h4 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
      Contact
    </h4>

    {lead.address && (
      <Row icon={<MapPin className="size-3.5" />} label="Address">
        <a
          href={lead.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm hover:underline text-foreground"
        >
          {lead.address}
        </a>
      </Row>
    )}

    {lead.phone && (
      <Row icon={<Phone className="size-3.5" />} label="Phone">
        <a href={`tel:${lead.phone}`} className="text-sm hover:underline">
          {lead.phone}
        </a>
      </Row>
    )}

    <Row icon={<Globe className="size-3.5" />} label="Website">
      {lead.website ? (
        <div className="flex items-center gap-2">
          <a
            href={lead.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm truncate hover:underline"
          >
            {lead.website}
          </a>
          {lead.websiteReachable === true && (
            <Wifi className="size-3.5 text-emerald-500 shrink-0" />
          )}
          {lead.websiteReachable === false && (
            <WifiOff className="size-3.5 text-destructive shrink-0" />
          )}
        </div>
      ) : (
        <span className="text-sm text-muted-foreground">No website</span>
      )}
    </Row>

    {lead.emails && lead.emails.length > 0 && (
      <Row icon={<Mail className="size-3.5" />} label="Emails">
        <div className="flex flex-col gap-1">
          {lead.emails.map((email) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="text-sm hover:underline"
            >
              {email}
            </a>
          ))}
        </div>
      </Row>
    )}
  </div>
);

const Row = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-2.5">
    <span className="mt-px text-muted-foreground shrink-0">{icon}</span>
    <div className="flex flex-col gap-0.5 min-w-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      {children}
    </div>
  </div>
);
