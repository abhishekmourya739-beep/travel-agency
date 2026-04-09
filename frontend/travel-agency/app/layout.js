import { AuthProvider } from "@/context/authContext";
import "./globals.css";
import ReduxProvider from "@/store/ReduxProvider";
import GlobalToast from "@/components/global/GlobalToast";

export const metadata = {
  title: "Travel Agency",
  description: "Travel Agency Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            <GlobalToast />
            {children}
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
