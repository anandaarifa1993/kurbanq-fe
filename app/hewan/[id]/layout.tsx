import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: `Hewan | QurbanQ`,
  description: `App Made By Fantastic Four Team`,
};

type PropsLayout = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: PropsLayout) => {
  return (
    <div>
      <ToastContainer containerId={`toastNotify`} />
      {children}
    </div>
  );
};

export default RootLayout;
