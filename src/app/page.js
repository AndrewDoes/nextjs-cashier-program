// src/app/page.js
import ProductList from '@/components/ProductList';
import CurrentSale from '@/components/CurrentSale';

export default function CashierPage() {
  return (
    // CHANGE THIS LINE:
    <main className="flex flex-col md:flex-row min-h-screen bg-gray-500">
      <ProductList />
      <CurrentSale />
    </main>
  );
}