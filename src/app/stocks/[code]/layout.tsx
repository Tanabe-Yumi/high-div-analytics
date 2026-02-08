import { Loader } from "@/components/layout/Loader";
import { Suspense } from "react";

export default function StockDetailLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<Loader label="Loading..." />}>{children}</Suspense>
  );
}
