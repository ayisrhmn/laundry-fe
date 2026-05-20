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
    menus: [{ name: "Beranda", href: "/", icon: Activity, submenus: null }],
  },
  {
    group: "Transaksi",
    menus: [
      {
        name: "Order",
        href: "/transaction/orders",
        icon: ReceiptText,
        submenus: null,
      },
    ],
  },
  {
    group: "Master Data",
    menus: [
      {
        name: "Pelanggan",
        href: "/master/customers",
        icon: Users2,
        submenus: null,
      },
      {
        name: "Layanan",
        href: "/master/services",
        icon: WashingMachine,
        submenus: null,
      },
      {
        name: "Aturan Diskon",
        href: "/master/discount-rules",
        icon: Percent,
        submenus: null,
      },
    ],
  },
  {
    group: "Pengaturan",
    menus: [
      {
        name: "Pengguna",
        href: "/setting/users",
        icon: UserCog2,
        submenus: null,
      },
    ],
  },
];
