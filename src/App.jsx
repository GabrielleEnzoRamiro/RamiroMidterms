import React, { useState, useEffect, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';

const categories = ['Smartphone', 'Laptop', 'Wearable', 'Audio'];
const roles = ['Engineer', 'Tester'];

const initialItems = [
  {
    id: '1',
    gadgetName: 'Apex Phone Pro',
    category: 'Smartphone',
    manufacturer: 'Apex Tech Inc.',
    healthRating: 94,
    brandName: 'Apex',
    userRole: 'Engineer',
  },
  {
    id: '2',
    gadgetName: 'Zenith Studio 15',
    category: 'Laptop',
    manufacturer: 'Zenith Systems',
    healthRating: 82,
    brandName: 'Zenith',
    userRole: 'Tester',
  },
  {
    id: '3',
    gadgetName: 'Pulse Band Active',
    category: 'Wearable',
    manufacturer: 'BioPulse Labs',
    healthRating: 68,
    brandName: 'Pulse',
    userRole: 'Engineer',
  },
  {
    id: '4',
    gadgetName: 'SoundWave ANC',
    category: 'Audio',
    manufacturer: 'Wave Acoustics',
    healthRating: 89,
    brandName: 'Wave',
    userRole: 'Tester',
  },
  {
    id: '5',
    gadgetName: 'Aero Tab 11',
    category: 'Laptop',
    manufacturer: 'Aero Corp',
    healthRating: 75,
    brandName: 'Aero',
    userRole: 'Engineer',
  },
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('register');
  const [gadgets, setGadgets] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(initialItems[0].id);
  const [activeProfile, setActiveProfile] = useState(null);
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [form, setForm] = useState({
    gadgetName: '',
    category: categories[0],
    manufacturer: '',
    healthRating: '',
    brandName: '',
    userRole: roles[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const matched = gadgets.find((item) => item.id === selectedId);
    if (matched) {
      setActiveProfile(matched);
    }
  }, [selectedId, gadgets]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errs = {};
    if (!form.gadgetName.trim() || form.gadgetName.trim().length < 3) {
      errs.gadgetName = 'Name must be at least 3 characters long.';
    }
    if (!form.category) {
      errs.category = 'Please choose a category.';
    }
    if (!form.manufacturer.trim()) {
      errs.manufacturer = 'Manufacturer is required.';
    }
    const rating = Number(form.healthRating);
    if (!form.healthRating || isNaN(rating) || rating < 1 || rating > 100) {
      errs.healthRating = 'Health rating must be a number between 1 and 100.';
    }
    if (!form.brandName.trim()) {
      errs.brandName = 'Brand name is required.';
    }
    if (!form.userRole) {
      errs.userRole = 'Please select a role.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const newItem = {
      id: Date.now().toString(),
      gadgetName: form.gadgetName.trim(),
      category: form.category,
      manufacturer: form.manufacturer.trim(),
      healthRating: parseInt(form.healthRating, 10),
      brandName: form.brandName.trim(),
      userRole: form.userRole,
    };

    setGadgets((prev) => [newItem, ...prev]);
    setSelectedId(newItem.id);

    setForm({
      gadgetName: '',
      category: categories[0],
      manufacturer: '',
      healthRating: '',
      brandName: '',
      userRole: roles[0],
    });
    setErrors({});
    setCurrentTab('table');
  };

  const filteredGadgets = useMemo(() => {
    if (roleFilter === 'ALL') return gadgets;
    return gadgets.filter((item) => item.userRole === roleFilter);
  }, [gadgets, roleFilter]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'gadgetName',
        header: 'Gadget Name',
        cell: (info) => <span className="font-semibold text-slate-900">{info.getValue()}</span>,
      },
      {
        accessorKey: 'category',
        header: 'Category',
        cell: (info) => (
          <span className="inline-block px-2.5 py-0.5 rounded text-xs bg-slate-100 text-slate-700 border border-slate-200">
            {info.getValue()}
          </span>
        ),
      },
      {
        accessorKey: 'brandName',
        header: 'Brand',
      },
      {
        accessorKey: 'healthRating',
        header: 'Health Rating',
        cell: (info) => {
          const val = info.getValue();
          return (
            <span
              className={`inline-block px-2 py-0.5 text-xs font-semibold rounded ${
                val >= 80
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : val >= 50
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {val}%
            </span>
          );
        },
      },
      {
        accessorKey: 'userRole',
        header: 'Logged By',
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredGadgets,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 4,
      },
    },
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tech Gadget Inventory Hub</h1>
            <p className="text-xs text-slate-500">Registry and diagnostic tracking system</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCurrentTab('register')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border ${
                currentTab === 'register' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
              }`}
            >
              Intake Form
            </button>
            <button
              type="button"
              onClick={() => setCurrentTab('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border ${
                currentTab === 'table' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700'
              }`}
            >
              Registry Table ({gadgets.length})
            </button>
          </div>
        </header>

        {currentTab === 'register' ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 space-y-4 max-w-lg mx-auto shadow-sm">
            <div>
              <label className="block text-xs font-semibold mb-1">Gadget Name</label>
              <input
                type="text"
                name="gadgetName"
                value={form.gadgetName}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {errors.gadgetName && <p className="text-red-500 text-xs mt-1">{errors.gadgetName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Health Rating (1–100)</label>
                <input
                  type="number"
                  name="healthRating"
                  value={form.healthRating}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.healthRating && <p className="text-red-500 text-xs mt-1">{errors.healthRating}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Brand Name</label>
                <input
                  type="text"
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.brandName && <p className="text-red-500 text-xs mt-1">{errors.brandName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Manufacturer</label>
                <input
                  type="text"
                  name="manufacturer"
                  value={form.manufacturer}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {errors.manufacturer && <p className="text-red-500 text-xs mt-1">{errors.manufacturer}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">User Role</label>
              <div className="flex gap-4">
                {roles.map((r) => (
                  <label key={r} className="text-xs flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="userRole"
                      value={r}
                      checked={form.userRole === r}
                      onChange={handleChange}
                    />
                    {r}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white text-sm py-2 rounded font-medium hover:bg-blue-700">
              Submit Gadget Spec
            </button>
          </form>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Filter Role:</span>
                  {['ALL', 'Engineer', 'Tester'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setRoleFilter(item)}
                      className={`px-3 py-1 text-xs rounded border transition ${
                        roleFilter === item
                          ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-slate-400">4 items per page</span>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                    {table.getHeaderGroups().map((group) => (
                      <tr key={group.id}>
                        {group.headers.map((header) => (
                          <th key={header.id} className="p-3">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {table.getRowModel().rows.map((row) => (
                      <tr
                        key={row.id}
                        onClick={() => setSelectedId(row.original.id)}
                        className={`cursor-pointer transition ${
                          selectedId === row.original.id ? 'bg-blue-50' : 'hover:bg-slate-50'
                        }`}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="p-3">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                    {table.getRowModel().rows.length === 0 && (
                      <tr>
                        <td colSpan={columns.length} className="text-center p-6 text-xs text-slate-400">
                          No matching records found for this role.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <div className="flex items-center justify-between p-3 border-t border-slate-200 bg-slate-50 text-xs">
                  <span className="text-slate-600">
                    Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                      className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                      className="px-3 py-1 bg-white border border-slate-200 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Profile</h3>
                  {activeProfile?.userRole && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {activeProfile.userRole}
                    </span>
                  )}
                </div>

                {activeProfile ? (
                  <div className="space-y-4 text-xs">
                    <div>
                      <p className="text-lg font-bold text-slate-800">{activeProfile.gadgetName}</p>
                      <p className="text-slate-400">Record ID: {activeProfile.id}</p>
                    </div>

                    <div className="space-y-2 border-t border-slate-100 pt-3">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Brand Name:</span>
                        <span className="font-semibold text-slate-800">{activeProfile.brandName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Category:</span>
                        <span className="font-medium text-slate-800">{activeProfile.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Manufacturer:</span>
                        <span className="font-medium text-slate-800">{activeProfile.manufacturer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Health Rating:</span>
                        <span className="font-bold text-slate-900">{activeProfile.healthRating} / 100</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-6">Select an item from the table to view details.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}