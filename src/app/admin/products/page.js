// src/app/admin/products/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc, doc, deleteDoc, updateDoc, setDoc, runTransaction } from 'firebase/firestore';
import ProductForm from '@/components/ProductForm';

export default function ProductsAdminPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
    const [filterCategory, setFilterCategory] = useState('');

    const categories = ['Makanan', 'Minuman', 'Cemilan', 'Lainnya'];

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
            await runTransaction(db, async (transaction) => {
                const counterRef = doc(db, 'counters', 'products');
                const counterDoc = await transaction.get(counterRef);

                let newProductId;

                // Check if the counter document exists
                if (!counterDoc.exists()) {
                    // If it doesn't exist, this is the very first product.
                    // Set the ID to 1 and CREATE the counter document.
                    newProductId = 1;
                    transaction.set(counterRef, { currentId: newProductId });
                } else {
                    // If it exists, increment the current ID.
                    newProductId = counterDoc.data().currentId + 1;
                    transaction.update(counterRef, { currentId: newProductId });
                }

                // Create the new product with the determined ID
                const newProductRef = doc(collection(db, 'products'));
                transaction.set(newProductRef, {
                    ...productData,
                    productId: newProductId
                });
            });

            console.log("Product added successfully!");
            fetchProducts(); // Refresh the list
        } catch (error) {
            console.error("Error in transaction: ", error);
            alert("Failed to add product. See console for details.");
        }
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                const productDoc = doc(db, 'products', productId);
                await (deleteDoc(productDoc));
                setProducts(products.filter(p => p.id != productId));
            } catch (error) {
                console.error("Error deleting product: ", error);
                alert("Failed to delete product");
            }
        }
    };

    const handleUpdateProduct = async (productData) => {
        try {
            const productDoc = doc(db, 'products', editingProduct.id);
            await updateDoc(productDoc, productData);
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Error updating product: ", error);
            alert("Failed to update product");
        }
    };

    const handleSubmit = (productData) => {
        if (editingProduct) {
            handleUpdateProduct(productData);
        } else {
            handleAddProduct(productData);
        }
    }

    const filteredSortedProducts = useMemo(() => {
        let items = [...products];

        if (filterCategory) {
            items = items.filter(p => p.category === filterCategory);
        }
        if (sortConfig.key !== null) {
            items.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                // Handle cases where values might be missing
                if (aValue === undefined || aValue === null) return 1;
                if (bValue === undefined || bValue === null) return -1;

                if (typeof (aValue) === 'number' && typeof (bValue) === 'number') {
                    if (aValue < bValue) {
                        return sortConfig.direction === 'ascending' ? -1 : 1;
                    }
                    else if (aValue > bValue) {
                        return sortConfig.direction === 'ascending' ? 1 : -1;
                    }
                }

                const comparison = String(aValue).localeCompare(String(bValue));
                return sortConfig.direction === 'ascending' ? comparison : -comparison;
            });
        }
        return items;
    }, [sortConfig, products, filterCategory]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Product Management</h1>

            <ProductForm onSubmit={handleSubmit} productToEdit={editingProduct} />

            <h2 className="text-2xl font-bold mb-2 text-gray-800">Existing Products</h2>
            <h3 className='text-lg font-regular mb-2 text-gray-600 opacity-70'>press the column header to sort</h3>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">
                                <button onClick={() => requestSort('productId')}>
                                    ID {sortConfig.key === 'productId' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                </button>
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">
                                <button onClick={() => requestSort('name')}>
                                    Name {sortConfig.key === 'name' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                </button>
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">
                                <button onClick={() => requestSort('category')}>
                                    Category {sortConfig.key === 'category' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                </button>
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">
                                <button onClick={() => requestSort('price')}>
                                    Price {sortConfig.key === 'price' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                </button>
                            </th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">
                                <button onClick={() => requestSort('actions')}>
                                    Actions {sortConfig.key === 'actions' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan="3" className="text-center py-5 text-gray-500">Loading...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan="3" className="text-center py-5 text-gray-500">No products found. Add one using the form above.</td></tr>
                        ) : (
                            filteredSortedProducts.map(product => (
                                <tr key={product.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">{product.productId}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">{product.name}</td>
                                    <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800'>{product.category}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">Rp {product.price.toLocaleString('id-ID')}</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">
                                        <button onClick={() => setEditingProduct(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <div className='flex mt-4 gap-4 align-middle'>
                <h2 className='text-lg font-bold mb-2 text-gray-800 mt-4'>Filter by Category</h2>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className='px-2 py-1 rounded-2xl w-1/5 shadow-md bg-white text-gray-800 hover:bg-gray-700 hover:text-white transition-ease-in duration-200'>
                    <option value="">None</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}