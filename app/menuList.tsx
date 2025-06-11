import { ReactNode } from "react";

import { FaUser } from "react-icons/fa";
import { FaShoppingBasket } from "react-icons/fa";

interface IPropMenu {
  id: string;
  path: string;
  label: string;
  icon: ReactNode;
}

let menuList: IPropMenu[] = [
  {
    id: `user`,
    path: `/profile`,
    label: `Profile`,
    icon: <FaUser size={28} />,
  },
  {
    id: `keranjang`,
    path: `/keranjang`,
    label: `Keranjang`,
    icon: <FaShoppingBasket size={28} />,
  },
];

export default menuList;
