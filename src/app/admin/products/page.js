// src/app/admin/products/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import ProductForm from '@/components/ProductForm';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // READ logic: Fetches all products from Firestore
  const fetchProducts = async () => {
    setIsLoading(true);
    const productsCollection = collection(db, 'products');
    const productSnapshot = await getDocs(productsCollection);
    const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(productList);
    setIsLoading(false);
  };

  // Run fetchProducts once when the component loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // CREATE logic: Adds a new product document to Firestore
  const handleAddProduct = async (productData) => {
    try {
      const productsCollection = collection(db, 'products');
      await addDoc(productsCollection, productData);
      // Refresh the list to show the new product immediately
      fetchProducts();
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Management</h1>
      
      <ProductForm onSubmit={handleAddProduct} />

      <h2 className="text-2xl font-bold mb-4 text-gray-800">Existing Products</h2>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">Price</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="3" className="text-center py-5 text-gray-500">Loading...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="3" className="text-center py-5 text-gray-500">No products found. Add one using the form above.</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">{product.name}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">Rp {product.price.toLocaleString('id-ID')}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">
                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}