import { useRef } from "react";
import { Link, Redirect, useLocation } from "wouter";

import HomeIcon from "../assets/icons/home.svg?react";
import HistoryIcon from "../assets/icons/history.svg?react";
import ProfileIcon from "../assets/icons/profile.svg?react";

type SVGComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type NavbarMenuProps = {
  key: number;
  path: string;
  icon: SVGComponent;
  text: string;
  isActive: boolean;
  onClick: () => void;
};

function NavButton({ icon: Icon, ...props }: NavbarMenuProps) {
  return (
    <Link
      key={props.key}
      href={props.path}
      onClick={props.onClick}
      className={`flex flex-col items-center space-y-2 ${props.isActive ? "text-secondary-500" : "text-primary-500"}`}
    >
      <Icon className="w-8 h-8" />
      <p className="font-bold text-xs">{props.text}</p>
    </Link>
  );
}

export default function Navbar() {
  const [location] = useLocation();

  type Menu = {
    path: string;
    icon: SVGComponent;
    text: string;
  };

  const navbarMenus = useRef<Menu[]>([
    { path: "/home", icon: HomeIcon, text: "Beranda" },
    { path: "/history", icon: HistoryIcon, text: "Riwayat" },
    { path: "/profile", icon: ProfileIcon, text: "Profil" },
  ]);

  const navbarButtons = navbarMenus.current.map((menu, i) =>
    NavButton({
      key: i,
      path: menu.path,
      icon: menu.icon,
      text: menu.text,
      isActive: location.startsWith(menu.path),
      onClick: () => {
        return <Redirect to={menu.path} />;
      },
    }),
  );

  return (
    <div className="flex flex-row items-center justify-around h-24 fixed bottom-0 w-screen bg-white drop-shadow-lg drop-shadow-black/25">
      {navbarButtons}
    </div>
  );
}
