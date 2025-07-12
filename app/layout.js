import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer, toast } from 'react-toastify'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Smart Union",
  description: "Union Parishad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <main className=" p-2 bg-gray-100 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">১নং রামগড় ইউনিয়ন পরিষদ</h1>
      <p className="mb-6">সকল সেবা এক জায়গায়</p>

      <div className="space-x-4">
        <a href="/register" className="bg-green-500 px-4 py-2 rounded text-white">Register</a>
        <a href="/login" className="bg-blue-500 px-4 py-2 rounded text-white">Login</a>
      </div>
    </main>
        {children}
        

        

      </body>
    </html>
  );
}
