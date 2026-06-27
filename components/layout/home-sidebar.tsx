import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { Compass, Headphones, Home, Keyboard, Mouse, Tv } from "lucide-react";
import Link from "next/link";
import { SidebarUser } from "./sidebar-user";

const data = {
  navMain: [
    {
      title: "",
      items: [
        {
          title: "Home",
          icon: <Home size={20} />,
          url: "#",
        },
        {
          title: "Popular",
          icon: <Compass size={20} />,
          url: "#",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      items: [
        {
          title: "Monitors",
          icon: <Tv size={20} />,
          url: "#",
        },
        {
          title: "Keyboards",
          icon: <Keyboard size={20} />,
          url: "#",
        },
        {
          title: "Mice",
          icon: <Mouse size={20} />,
          url: "#",
        },
        {
          title: "Headphones",
          icon: <Headphones size={20} />,
          url: "#",
        },
      ],
    },
  ],
};

export function HomeSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            ></SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>
              <div className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">
                {item.title}
              </div>
            </SidebarGroupLabel>
            <SidebarMenu>
              <nav className="flex flex-col gap-1 text-sm">
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={subItem.url}
                        className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-700"
                      >
                        {subItem.icon}
                        {subItem.title}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </nav>
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
