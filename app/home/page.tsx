import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { HomeSidebar } from "@/components/layout/home-sidebar";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <main className="flex-1 max-w-2xl mx-auto p-4">
      <div className="space-y-4">
        <h1>Home</h1>
      </div>
    </main>
  );
}
