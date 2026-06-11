import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-76px)] flex flex-col justify-center items-center text-center px-6 pt-12 pb-24">
      
      {/* Hero Section */}
      <div className="max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">brilliant content</span> in seconds.
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 mb-10 leading-relaxed max-w-2xl mx-auto">
          The ultimate AI-powered workspace for writers and creators. Stop staring at a blank page and let artificial intelligence draft your next masterpiece.
        </p>
        
        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            href="/dashboard" 
            className="bg-blue-600 text-white font-bold text-lg py-4 px-8 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Creating for Free
          </Link>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white text-gray-800 font-bold text-lg py-4 px-8 rounded-full border border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
          >
            View Code on GitHub
          </a>
        </div>
      </div>
      
      {/* Features Grid */}
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-left">
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-2xl mb-6">⚡</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Lightning Fast</h3>
          <p className="text-gray-500 leading-relaxed">Generate whole articles, social media posts, and emails instantly using industry-leading AI models.</p>
        </div>
        
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center text-2xl mb-6">🛠️</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Production Ready</h3>
          <p className="text-gray-500 leading-relaxed">Built on Next.js and Tailwind CSS, ensuring a scalable, responsive, and modern architecture.</p>
        </div>
        
        <div className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-2xl mb-6">🔒</div>
          <h3 className="text-xl font-bold mb-3 text-gray-900">Highly Secure</h3>
          <p className="text-gray-500 leading-relaxed">Your API keys and user data are safely isolated in a secure, server-side vault.</p>
        </div>
      </div>

    </div>
  );
}