function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">My Vite App</h1>
          <nav className="space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-grow flex items-center justify-center text-center px-6">
        <div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to <span className="text-blue-600">Vite + React</span>
          </h2>
          <p className="text-gray-600 mb-6">
            Tailwind CSS is working 🎉 — start building your app here.
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner py-4 text-center text-gray-500">
        © {new Date().getFullYear()} My Vite App. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
