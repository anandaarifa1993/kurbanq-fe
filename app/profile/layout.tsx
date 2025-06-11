import 'react-toastify/dist/ReactToastify.css';

export const metadata = {
  title: `Profile | QurbanQ`,
  description: `App Made By Fantastic Four Team`,
};

type PropsLayout = {
  children: React.ReactNode;
};

const RootLayout = ({ children }: PropsLayout) => {
  return <div>{children}</div>;
};

export default RootLayout;
