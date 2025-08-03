// src/components/CurrentSale.js
export default function CurrentSale() {
  return (
    // This component is full-width on mobile, and 2/5ths width on medium screens and up
    <div className="w-full md:w-2/5 p-4">
      <h2 className="text-2xl font-bold mb-4">Current Sale</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <p className="text-gray-400">Cart is empty.</p>
      </div>
    </div>
  );
}