"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MousePointer2, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getLeadQuery } from "@/lib/mock-data/mock-lead-queries";
import { getLeadsByQueryId } from "@/lib/mock-data/mock-leads";
import { getLeadsByQueryIdHandler } from "@/lib/queries/lead-queries";
import type { Lead, LeadQuery } from "@/lib/schema/lead-schema";
import { cn } from "@/lib/utils";
import LeadDetails from "./LeadDetails";
import LeadHeader from "./LeadHeader";
import LeadItem from "./LeadItem";
import LeadQueryDetails from "./LeadQueryDetails";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};

export default function LeadQueryWrapper({
  id,
  role,
}: {
  id: string;
  role: string;
}) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const queryClient = useQueryClient();
  const isDesktop = useMediaQuery("(min-width: 1280px)");

  const leadQueries =
    queryClient.getQueryData<LeadQuery[]>(["leadQueries"]) ?? [];
  const leadQuery = getLeadQuery(id, leadQueries);

  const { data = [] } = useQuery({
    queryKey: ["leads", id],
    queryFn: () => getLeadsByQueryIdHandler(id),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
    enabled: role === "member" && !!leadQuery,
  });

  if (!leadQuery) {
    return (
      <EmptyState
        icon={SearchX}
        headline="No query found"
        message="No query was found for this lead"
      />
    );
  }

  const leads = role === "member" ? data : getLeadsByQueryId(id);

  return (
    <>
      <div
        className={cn(
          "flex flex-col xl:grid min-h-0",
          leads.length > 0 ? "xl:grid-cols-2" : "xl:grid-cols-1",
        )}
      >
        <div className="flex flex-col min-h-0 pt-4">
          <LeadQueryDetails leadQuery={leadQuery} />
          {leads.length === 0 ? (
            <EmptyState
              icon={SearchX}
              headline="No leads found"
              message="No leads have been collected for this query yet"
            />
          ) : (
            <ScrollArea className="min-h-0 w-full">
              <div className="flex flex-col lg:pr-6">
                {leads.map((lead) => (
                  <LeadItem
                    key={lead.id}
                    lead={lead}
                    onClickAction={() => setSelectedLead(lead)}
                  />
                ))}
              </div>
            </ScrollArea>
          )}
        </div>

        <div
          className={cn("p-4 hidden min-h-0", leads.length > 0 && "xl:flex")}
        >
          {selectedLead === null ? (
            <EmptyState
              icon={MousePointer2}
              headline="No lead selected"
              message="Click on a lead name on the left to view its details"
            />
          ) : (
            <div className="flex flex-col w-full">
              <LeadHeader
                lead={selectedLead}
                onCloseAction={() => setSelectedLead(null)}
              />
              <ScrollArea className="min-h-0">
                <LeadDetails lead={selectedLead} />
              </ScrollArea>
            </div>
          )}
        </div>
      </div>

      <Drawer
        open={!isDesktop && selectedLead !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedLead(null);
        }}
      >
        {selectedLead !== null && (
          <DrawerContent className="p-6 h-full">
            <DrawerHeader>
              <DrawerTitle className="py-2">
                {selectedLead.companyName}
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="min-h-0">
              <LeadDetails lead={selectedLead} />
              <div className="pb-1.5">
                <DrawerClose className="w-full bg-foreground text-background rounded-2xl py-2 font-medium">
                  Close
                </DrawerClose>
              </div>
            </ScrollArea>
          </DrawerContent>
        )}
      </Drawer>
    </>
  );
}
