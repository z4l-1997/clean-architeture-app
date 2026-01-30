import React from "react";
import { MonAnProvider } from "@/presentation/views/private/menu/provider/mon-an.provider";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <MonAnProvider>{children}</MonAnProvider>;
};

export default Layout;
