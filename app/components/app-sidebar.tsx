import {
  Home,
  Inbox,
  Bot,
  Filter,
  CodeIcon,
  ArrowUpLeftIcon,
  ShieldQuestionIcon,
  LucideFileQuestion,
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  Sidebar,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "~/components/ui/sidebar";
import { Seed } from "./seed";
import { Link, useLocation } from "@remix-run/react";
import { CerbosLogo } from "./logo";

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Resources",
    url: "/resources",
    icon: Inbox,
  },
  {
    title: "Embedding",
    url: "/embedding",
    icon: CodeIcon,
  },
  {
    title: "Vector Store",
    url: "/vector-store",
    icon: ArrowUpLeftIcon,
  },
  {
    title: "Policies",
    url: "https://hub.cerbos.cloud/app/playground/O3JT41PKYYAO",
    icon: ShieldQuestionIcon,
    target: "_blank",
  },
  {
    title: "Query Plan",
    url: "/query-plan",
    icon: Filter,
  },
  {
    title: "Prompt",
    url: "/prompt",
    icon: LucideFileQuestion,
  },
  {
    title: "Chat",
    url: "/chat",
    icon: Bot,
  },
];

export function AppSidebar() {
  const location = useLocation();
  return (
    <Sidebar>
      <SidebarContent>
        <div className="pl-4 pt-4">
          <CerbosLogo />
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>RAG Authorization</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.url}
                  >
                    <Link to={item.url} target={item.target}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Seed />
      </SidebarFooter>
    </Sidebar>
  );
}
