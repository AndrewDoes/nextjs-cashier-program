// src/components/ProductForm.js
'use client';
import { useState, useEffect } from 'react';

export default function ProductForm({ onSubmit, productToEdit }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const isEditMode = !!productToEdit;

  useEffect(() => {
      if (productToEdit){
        setName(productToEdit.name);
        setPrice(productToEdit.price);
      } else{
        setName('');
        setPrice('');
      }
  }, [productToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price) return;
    onSubmit({ name, price: Number(price) });
    setName('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-gray-100 rounded-lg shadow-md mb-8">
      {/* 4. Change title based on mode */}
      <h3 className="text-xl font-bold mb-4 text-gray-800">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-full text-gray-800"
        />
        <input
          type="number"
          placeholder="Price (e.g., 15000)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="p-2 border rounded w-full text-gray-800"
        />
        {/* 5. Change button text and color based on mode */}
        <button type="submit" className={`text-white p-2 rounded transition-colors ${isEditMode ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'}`}>
          {isEditMode ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}