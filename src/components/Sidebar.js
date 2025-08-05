'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
    const pathname = usePathname();

    const navLinks = [
        { name: 'Cashier', href: '/admin/cashier' },
        { name: 'Products', href: '/admin/products' },
        { name: 'Transactions', href: '/admin/transactions' },
    ];

    return (
        <aside className='w-64 flex-shrink-0 bg-gray-800 text-white p-4'>
            <h1 className="text-2xl font-bold mb-8 text-center border-b-2 pb-4">Mie Galaxy</h1>
            <nav>
                <ul>
                    {navLinks.map((link) => {
                        // Check if the current path starts with the link's href to highlight it
                        const isActive = pathname.startsWith(link.href);
                        return (
                            <li key={link.name} className="mb-2">
                                <Link
                                    href={link.href}
                                    className={`block p-3 rounded-lg hover:bg-gray-700 transition-colors ${isActive ? 'bg-blue-600' : ''}`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        );
                    })}
                    <button onClick={() => window.location.href = '/customer'} className="bg-red-500 w-full block p-3 rounded-lg hover:bg-red-700 transition-colors mt-100">Logout</button>
                </ul>
            </nav>
        </aside>
    )
}
