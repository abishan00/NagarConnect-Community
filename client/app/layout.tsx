import "./globals.css";
import { Providers } from "@/redux/provider";
import { Toaster } from "react-hot-toast";
import LayoutWrapper from "@/components/layout/LayoutWrapper";

export const metadata = {
  title: "NagarConnect Community",
  description: "Community Issue Reporting Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
          <Toaster position="bottom-right" />
        </Providers>
      </body>
    </html>
  );
}
