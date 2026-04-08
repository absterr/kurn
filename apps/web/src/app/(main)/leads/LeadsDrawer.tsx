"use client";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Lead } from "@/lib/types";
import LeadsCard from "./LeadsCard";
import LeadsDetails from "./LeadsDetails";

export default function LeadsDrawer({ lead }: { lead: Lead }) {
  return (
    <Drawer>
      <DrawerTrigger>
        <LeadsCard lead={lead} />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="py-6">
          <DrawerTitle className="font-semibold text-lg">
            {lead.name}
          </DrawerTitle>
        </DrawerHeader>
        <LeadsDetails lead={lead} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
