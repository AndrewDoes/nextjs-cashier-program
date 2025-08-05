// src/app/customer/layout.js
import CustomerHeader from '@/components/CustomerHeader';

export default function CustomerLayout({ children }) {
  return (
    // We reuse the 'bg-gray-100' class to keep the theme consistent
    <div className="min-h-screen bg-gray-100">
      <CustomerHeader />
      <main className="container mx-auto p-4 md:p-8">
        {/* The 'children' prop will be the content of our customer pages */}
        {children}
      </main>
    </div>
  );
}