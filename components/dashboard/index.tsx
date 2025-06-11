"use client";
import { ReactNode } from "react";
import Navbar from "./navbar";
type MenuType = {
  id: string;
  icon: ReactNode;
  path: string;
  label: string;
};
type ManagerProp = {
  children: ReactNode;
  id: string;
  title: string;
  menuList: MenuType[];
};
const navbarTemplate = ({ children, id, title, menuList }: ManagerProp) => {
  return (
    <div className="w-full min-h-dvh bg-slate-50">
      <Navbar menuList={menuList} id={id}>
        {children}
      </Navbar>
    </div>
  );
};

export default navbarTemplate;
