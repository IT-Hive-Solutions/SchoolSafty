import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/LogoutButton';

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('tenant_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = parseJwt(token);

  if (!payload) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-gray-200 pb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">{payload.organizationName || payload.schoolName}</h1>
            <p className="text-gray-600 mt-1">Tenant Dashboard</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm bg-gray-200 text-gray-800 px-3 py-1 rounded-full font-medium">
              Role: {payload.role}
            </span>
            <LogoutButton />
            
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Welcome to your organization portal!</h2>
          <p className="text-gray-600">
            You are logged into the isolated database schema: <code className="bg-gray-100 px-2 py-1 rounded text-pink-600">{payload.schemaName}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
