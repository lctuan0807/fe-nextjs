import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function SidebarUser() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <div className="grid flex-1 text-left text-sm leading-tight">
            <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-full text-sm">
              Login
            </button>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
