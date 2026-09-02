import React, { useState } from 'react';

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
];

export default function App() {
  const [currentTab, setCurrentTab] = useState('register');
  const [gadgets, setGadgets] = useState(initialItems);

  const [form, setForm] = useState({
    gadgetName: '',
    category: categories[0],
    manufacturer: '',
    healthRating: '',
    brandName: '',
    userRole: roles[0],
  });

  const [errors, setErrors] = useState({});

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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <header className="flex justify-between items-center border-b border-slate-200 pb-4">
          <h1 className="text-xl font-bold">Tech Gadget Inventory Hub</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentTab('register')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border ${
                currentTab === 'register' ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              Intake Form
            </button>
            <button
              onClick={() => setCurrentTab('table')}
              className={`px-3 py-1.5 text-xs font-semibold rounded border ${
                currentTab === 'table' ? 'bg-blue-600 text-white' : 'bg-white'
              }`}
            >
              Registry ({gadgets.length})
            </button>
          </div>
        </header>

        {currentTab === 'register' ? (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 space-y-4 max-w-lg mx-auto">
            <div>
              <label className="block text-xs font-semibold mb-1">Gadget Name</label>
              <input
                type="text"
                name="gadgetName"
                value={form.gadgetName}
                onChange={handleChange}
                className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
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
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Health Rating (1-100)</label>
                <input
                  type="number"
                  name="healthRating"
                  value={form.healthRating}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
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
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
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
                  className="w-full border border-slate-300 rounded px-3 py-2 text-sm"
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
          <p className="text-sm text-slate-500 text-center py-10">Registry table will appear here in Phase 2.</p>
        )}
      </div>
    </div>
  );
}