import {
  Activity,
  Archive,
  Building,
  FileText,
  LifeBuoy,
  Package,
  Send,
  type LucideIcon,
} from "lucide-react";

export type NavigationMain = {
  group: string;
  menus: NavigationMenu[];
};

export type NavigationMenu = {
  name: string;
  href: string;
  icon: LucideIcon;
  submenus: NavigationSubMenu[] | null;
};

export type NavigationSubMenu = {
  name: string;
  href: string;
};

export type NavigationSecondary = {
  name: string;
  href: string;
  icon: LucideIcon;
};

export const NAVIGATION_MAIN: NavigationMain[] = [
  {
    group: "Overview",
    menus: [{ name: "Dashboard", href: "/dashboard", icon: Activity, submenus: null }],
  },
  {
    group: "Master Data",
    menus: [
      {
        name: "Cabang",
        href: "/dashboard/master/branch",
        icon: Building,
        submenus: null,
      },
      {
        name: "Produk",
        href: "#",
        icon: Package,
        submenus: [
          { name: "Kategori Produk", href: "/dashboard/master/product-type" },
          { name: "Daftar Produk", href: "/dashboard/master/product" },
        ],
      },
      {
        name: "Stok",
        href: "/dashboard/master/stock",
        icon: Archive,
        submenus: null,
      },
    ],
  },
  {
    group: "Analisis",
    menus: [
      {
        name: "Laporan",
        href: "/dashboard/analytics/report",
        icon: FileText,
        submenus: null,
      },
    ],
  },
];

export const NAVIGATION_SECONDARY: NavigationSecondary[] = [
  {
    name: "Bantuan",
    href: "#",
    icon: LifeBuoy,
  },
  {
    name: "Saran",
    href: "#",
    icon: Send,
  },
];
