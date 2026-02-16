
import type { Metadata } from "next";
import { Inter, Sarabun } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const sarabun = Sarabun({
    weight: ['300', '400', '500', '600', '700'],
    subsets: ["thai", "latin"],
    variable: "--font-sarabun",
    display: 'swap',
});

export const metadata: Metadata = {
    title: "ระบบบันทึกการเข้า-ออกงาน | WorkTrack",
    description: "ระบบบริหารจัดการเวลาและการลาพนักงานสำหรับองค์กร",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="th">
            <body className={`${inter.variable} ${sarabun.variable} font-sans antialiased bg-slate-50 text-slate-900`}>
                {children}
            </body>
        </html>
    );
}
