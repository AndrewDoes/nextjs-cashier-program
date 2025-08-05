// src/components/ProductList.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full md:w-3/5 p-4">
        <h2 className="text-2xl font-bold mb-4">Products</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-3/5 p-4">
      <h2 className="text-2xl font-bold mb-4">Products</h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
        {products.map((product) => (
          <button
            key={product.id}
            className="bg-white p-4 rounded-lg shadow text-left hover:bg-blue-100 transition-colors w-full"
          >
            <p className="font-semibold truncate text-gray-800">{product.productId}</p>
            <p className="font-semibold truncate text-gray-800">{product.name}</p>
            <p className="font-semibold-s opacity-80 truncate text-gray-800">{product.category}</p>
            <p className="text-gray-800">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}