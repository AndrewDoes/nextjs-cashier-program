// src/components/ProductForm.js
'use client';
import { useState } from 'react';

export default function ProductForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    onSubmit({ name, price: Number(price) });
    setName('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow-md mb-8">
      <h3 className="text-xl font-bold mb-4">Add New Product</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <input
          type="number"
          placeholder="Price (e.g., 15000)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border rounded w-full"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Add Product
        </button>
      </div>
    </form>
  );
}