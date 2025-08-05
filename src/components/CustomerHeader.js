// src/components/CustomerHeader.js
import Link from 'next/link';

export default function CustomerHeader() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link href="/customer" className="text-2xl font-bold text-gray-800">
          Mie Galaxy
        </Link>
        <nav>
          <Link href="/login" className="text-gray-600 hover:text-blue-500">
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
}