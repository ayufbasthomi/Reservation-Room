// src/components/PageContainer.tsx
export default function PageContainer({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-4 py-6">
      <div className="w-full max-w-3xl mx-auto bg-white text-gray-800 rounded-xl shadow p-4">
        {title && <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
