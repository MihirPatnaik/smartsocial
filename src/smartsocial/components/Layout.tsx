//D:\datasenceai\src\smartsocial\components\Layout.tsx

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        {children}
      </div>
    </div>
  );
}
