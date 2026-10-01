'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Organization = {
  id: string;
  name: string;
  createdAt: string;
};

export default function AdminDashboardPage() {
  const router = useRouter();
  
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrganizations, setLoadingOrganizations] = useState(true);
  const [organizationsError, setOrganizationsError] = useState('');

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    organizationName: '',
    executiveName: '',
    executiveEmail: '',
  });
  
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [successData, setSuccessData] = useState<{ tenantName: string; initialPassword: string } | null>(null);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    setLoadingOrganizations(true);
    setOrganizationsError('');
    try {
      const res = await fetch('/api/admin/organizations');
      if (!res.ok) throw new Error('Failed to fetch organizations');
      const data = await res.json();
      setOrganizations(data);
    } catch (err: any) {
      setOrganizationsError(err.message);
    } finally {
      setLoadingOrganizations(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setCreateError('');
    setSuccessData(null);

    try {
      const res = await fetch('/api/admin/create-organization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create organization');
      }

      setSuccessData({
        tenantName: data.tenant.name,
        initialPassword: data.initialPassword,
      });

      // Reset form & hide it
      setFormData({
        organizationName: '',
        executiveName: '',
        executiveEmail: '',
      });
      setShowCreateForm(false);
      
      // Refresh organizations list
      fetchOrganizations();
    } catch (err: any) {
      setCreateError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = () => {
    if (successData) {
      navigator.clipboard.writeText(successData.initialPassword);
      alert('Password copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black">Super Admin Dashboard</h1>
          <div className="flex space-x-4">
            <button 
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors shadow-sm"
            >
              {showCreateForm ? 'Cancel' : 'Create New Organization'}
            </button>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors shadow-sm"
            >
              Logout
            </button>
          </div>
        </div>
        
        {/* Create Organization Form Section */}
        {showCreateForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8 transition-all">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Create New Organization</h2>
            </div>
            
            <div className="p-6">
              {createError && (
                <div className="mb-4 p-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-200">
                  {createError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="organizationName">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      id="organizationName"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-black"
                      placeholder="e.g. Acme Corp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="executiveName">
                      Executive Name
                    </label>
                    <input
                      type="text"
                      id="executiveName"
                      name="executiveName"
                      value={formData.executiveName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-black"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="executiveEmail">
                      Executive Email (Org Admin)
                    </label>
                    <input
                      type="email"
                      id="executiveEmail"
                      name="executiveEmail"
                      value={formData.executiveEmail}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-black focus:border-black text-black"
                      placeholder="e.g. admin@acmecorp.com"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={creating}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50"
                  >
                    {creating ? 'Creating...' : 'Create Organization Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Active Organizations List Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Active Organizations</h2>
            <button onClick={fetchOrganizations} className="text-sm text-gray-500 hover:text-black">
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            {loadingOrganizations ? (
              <div className="p-8 text-center text-gray-500">Loading organizations...</div>
            ) : organizationsError ? (
              <div className="p-8 text-center text-red-600">{organizationsError}</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-white text-sm text-gray-600">
                    <th className="px-6 py-3 font-medium">ID</th>
                    <th className="px-6 py-3 font-medium">Organization Name</th>
                    <th className="px-6 py-3 font-medium">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {organizations.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                        No active organizations found.
                      </td>
                    </tr>
                  ) : (
                    organizations.map((org) => (
                      <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="px-6 py-4 font-mono text-gray-500 text-xs">{org.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-900">{org.name}</td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Success Modal / Display */}
        {successData && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Organization Created Successfully
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  The workspace for <strong>{successData.tenantName}</strong> is ready. Please securely share the following temporary password with the organization executive.
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-6 flex items-center justify-between">
                <code className="text-black font-mono text-lg">{successData.initialPassword}</code>
                <button 
                  onClick={copyToClipboard}
                  className="ml-4 px-3 py-1 bg-white border border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50"
                >
                  Copy
                </button>
              </div>
              
              <button
                onClick={() => setSuccessData(null)}
                className="w-full px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium"
              >
                Done
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
