// src/app/customer/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export default function CustomerMenuPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      // Query to sort products by their category, then by name
      const q = query(productsCollection, orderBy('category'), orderBy('name'));
      const productSnapshot = await getDocs(q);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    const category = product.category || 'Lainnya';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Our Menu</h1>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading menu...</p>
      ) : (
        <div className="space-y-8">
          {Object.keys(productsByCategory).map(category => (
            <div key={category}>
              <h2 className="text-2xl font-bold mb-4 text-gray-700 border-b-2 pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsByCategory[category].map(product => (
                  <div key={product.id} className="bg-white p-4 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-700">Rp {product.price.toLocaleString('id-ID')}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}