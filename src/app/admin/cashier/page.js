// src/app/admin/cashier/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export default function CashierPage() {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productsCollection);
      const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productList);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const handleAddItem = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleDecreaseItem = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem.quantity === 1) {
        return prevItems.filter((item) => item.id !== product.id);
      } else {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    try {
      await addDoc(collection(db, 'sales'), {
        items: cartItems,
        total: total,
        createdAt: Timestamp.now(),
      });
      alert('Sale completed successfully!');
      handleClearCart();
    } catch (error) {
      console.error("Error completing sale: ", error);
      alert('Failed to complete sale.');
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      {/* ADDED TEXT COLOR */}
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Cashier</h1>
      <div className="flex flex-col md:flex-row gap-8">

        {/* Left Column: Product List */}
        <div className="w-full md:w-3/5">
          {/* ADDED TEXT COLOR */}
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Products</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddItem(product)}
                  className="bg-white p-4 rounded-lg shadow-md text-left hover:bg-blue-100 transition-colors focus:ring-2 focus:ring-blue-500"
                >
                  {/* ADDED TEXT COLOR */}
                  <p className="font-semibold truncate text-gray-900">{product.name}</p>
                  <p className="text-gray-600 text-sm">Rp {product.price.toLocaleString("id-ID")}</p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Current Sale (Cart) */}
        <div className="w-full md:w-2/5">
          {/* ADDED TEXT COLOR */}
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Current Sale</h2>
          <div className="bg-white p-4 rounded-lg shadow-md flex flex-col h-full">

            <div className="flex-grow overflow-y-auto">
              {cartItems.length === 0 ? (
                <p className="text-gray-500">Cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center border-b py-2">
                    <div>
                      {/* ADDED TEXT COLOR */}
                      <p className="font-semibold text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x Rp {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    {/* ADDED TEXT COLOR */}
                    <p className="font-bold text-gray-900">
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => {
                          handleDecreaseItem(item);
                        }}
                        className="text-white hover:bg-red-600 py-1 px-3 rounded bg-red-500"
                      >
                        -
                      </button>
                      <button
                        onClick={() => {
                          handleAddItem(item);
                        }}
                        className="text-white hover:bg-green-600 py-1 px-3 rounded bg-green-500"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold text-xl mb-4 text-gray-800"> {/* ADDED TEXT COLOR */}
                <span>Total</span>
                <span>Rp {total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleClearCart}
                  className="w-1/2 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 disabled:bg-gray-300"
                  disabled={cartItems.length === 0}
                >
                  Clear Sale
                </button>
                <button
                  onClick={handleCheckout}
                  className="w-1/2 bg-green-500 text-white py-3 rounded-lg font-semibold hover:bg-green-600 disabled:bg-gray-300"
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}