import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import { dark } from "@clerk/themes";
import { ClerkProvider,SignIn,SignInButton,SignedIn,SignedOut,UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GenZ Messenger",
  description: "A Web Application used for Conversation",
};

export default function RootLayout({
  children,
}:{
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey="pk_test_aW1tdW5lLXN3YW4tNTIuY2xlcmsuYWNjb3VudHMuZGV2JA"
      appearance={{
        baseTheme: [dark]
      }}
    >
      <html lang='en'  suppressHydrationWarning>
      <body className={cn( font.className,
        'bg-white dark:bg-[#313338]'
          )}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme="dark" 
            enableSystem={false}
            storageKey="genz-theme" > 
            <SocketProvider> 
              <ModalProvider/> 
                <QueryProvider> 
                  {children}
                </QueryProvider>
              </SocketProvider>
          </ThemeProvider>
      </body>
    </html>
    </ClerkProvider>
  )
}
