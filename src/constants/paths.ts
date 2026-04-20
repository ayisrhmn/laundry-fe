import {
  Activity,
  Percent,
  ReceiptText,
  UserCog2,
  Users2,
  WashingMachine,
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
    group: "Ikhtisar",
    menus: [{ name: "Dashboard", href: "/dashboard", icon: Activity, submenus: null }],
  },
  {
    group: "Transaksi",
    menus: [
      {
        name: "Order",
        href: "/dashboard/transaction/orders",
        icon: ReceiptText,
        submenus: null,
      },
    ],
  },
  {
    group: "Master Data",
    menus: [
      {
        name: "Customer",
        href: "/dashboard/master/customers",
        icon: Users2,
        submenus: null,
      },
      {
        name: "Layanan",
        href: "/dashboard/master/services",
        icon: WashingMachine,
        submenus: null,
      },
      {
        name: "Aturan Diskon",
        href: "/dashboard/master/discount-rules",
        icon: Percent,
        submenus: null,
      },
    ],
  },
  {
    group: "Pengaturan",
    menus: [
      {
        name: "User",
        href: "/dashboard/setting/users",
        icon: UserCog2,
        submenus: null,
      },
    ],
  },
];
