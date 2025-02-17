import Footer from "@/components/ui/footer/footer";
import Header from "@/components/ui/header/header";
import { ReactNode } from "react";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
}