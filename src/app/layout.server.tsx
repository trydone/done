import { ReactNode } from "react";

export const metadata = {
  title: "My App",
  description: "My app description",
};

export default function ServerLayout({ children }: { children: ReactNode }) {
  return children;
}
