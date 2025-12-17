export default function TestTailwind() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Tailwind CSS Test
        </h1>
        <div className="space-y-4">
          <p className="text-gray-700">
            If you can see this styled component, Tailwind CSS is working correctly!
          </p>
          <div className="flex justify-center">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
              Test Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
