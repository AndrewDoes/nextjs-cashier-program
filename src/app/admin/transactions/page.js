// src/app/admin/transactions/page.js
'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, where, getDocs } from 'firebase/firestore';

export default function TransactionsPage() {
  // --- STATE MANAGEMENT ---
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // --- DATA FETCHING LOGIC ---
  const fetchTransactions = async (start, end) => {
    setIsLoading(true);
    try {
      // Base query: get all sales, order by most recent
      const salesCollection = collection(db, 'sales');
      let transactionsQuery = query(salesCollection, orderBy('createdAt', 'desc'));

      // If start and end dates are provided, add 'where' clauses to the query
      if (start && end) {
        const startTime = new Date(start);
        startTime.setHours(0, 0, 0, 0); // Set to start of the day
        
        const endTime = new Date(end);
        endTime.setHours(23, 59, 59, 999); // Set to end of the day

        transactionsQuery = query(
          salesCollection,
          orderBy('createdAt', 'desc'),
          where('createdAt', '>=', startTime),
          where('createdAt', '<=', endTime)
        );
      }
      
      const querySnapshot = await getDocs(transactionsQuery);
      const transactionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTransactions(transactionsList);
    } catch (error) {
      console.error("Error fetching transactions: ", error);
      // This is often an indexing issue. See the note below the code.
      alert("Could not fetch transactions. You may need to create a Firestore index. See the browser console for a link.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- INITIAL LOAD ---
  // Fetch all transactions when the component first loads
  useEffect(() => {
    fetchTransactions();
  }, []);
  
  // --- UI HANDLERS ---
  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("Please select both a start and end date.");
      return;
    }
    fetchTransactions(startDate, endDate);
  };
  
  const handleShowAll = () => {
    setStartDate('');
    setEndDate('');
    fetchTransactions();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Transaction History</h1>

      {/* Date Filter UI */}
      <div className="p-4 bg-gray-100 rounded-lg shadow-md mb-8 flex items-center gap-4">
        <div>
          <label htmlFor="startDate" className="block text-sm font-medium text-gray-800">Start Date</label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="p-2 border rounded text-gray-800 opacity-80 hover:bg-gray-200 transition-ease-in-out duration-300"
          />
        </div>
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium text-gray-800">End Date</label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="p-2 border rounded text-gray-800 opacity-80 hover:bg-gray-200 transition-ease-in-out duration-300"
          />
        </div>
        <div className="self-end">
          <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Search
          </button>
        </div>
         <div className="self-end">
          <button onClick={handleShowAll} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">
            Show All
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">Date & Time</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">Total Amount</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">Items Sold</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-800 uppercase">Transaction ID</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="4" className="text-center py-5">Loading...</td></tr>
            ) : transactions.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-5 text-gray-500">No transactions found for the selected period.</td></tr>
            ) : (
              transactions.map(tx => (
                <tr key={tx.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">
                    {/* Convert Firestore Timestamp to a readable date */}
                    {tx.createdAt.toDate().toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-gray-800">
                    Rp {tx.total.toLocaleString('id-ID')}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="space-y-1">
                      {tx.items.map(item => (
                        <div key={item.id} className="text-gray-800">
                          {item.quantity} x {item.name}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-mono text-gray-500">
                    {tx.id}
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