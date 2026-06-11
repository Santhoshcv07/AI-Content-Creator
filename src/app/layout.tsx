import './globals.css';

// This is the metadata that shows up in Google Search and browser tabs
export const metadata = {
  title: 'AI ContentPro | Create Faster',
  description: 'The ultimate AI-powered workspace for writers, marketers, and creators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 font-sans antialiased">
        
        {/* The Navigation Bar (Shows on all pages) */}
        <nav className="w-full bg-white border-b border-gray-200 py-4 px-8 flex justify-between items-center shadow-sm">
          <div className="font-extrabold text-2xl text-blue-600 tracking-tight">
            AI ContentPro
          </div>
          <div>
            <a 
              href="/dashboard" 
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors"
            >
              Go to Workspace &rarr;
            </a>
          </div>
        </nav>
        
        {/* The Main Content (This changes depending on what page you are on) */}
        <main>
          {children}
        </main>

      </body>
    </html>
  );
}