// src/components/shared/Footer.tsx

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Branding */}
        <div className="flex flex-col items-center md:items-start">
          <h3 className="text-xl font-semibold text-white">Transport Management</h3>
          <p className="mt-2 text-sm">Simplifying logistics, one route at a time.</p>
        </div>

        {/* Links */}
        <div className="flex flex-col items-center">
          <h4 className="font-medium mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <a href="/" className="hover:text-white">
                Home
              </a>
            </li>
            <li>
              <a href="/showData" className="hover:text-white">
                Show Data
              </a>
            </li>
          </ul>
        </div>

        {/* Social / Contact */}
        <div className="flex flex-col items-center md:items-end">
          <h4 className="font-medium mb-2">Contact Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-white" aria-label="Twitter">
              <svg className="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                {/* Twitter icon path */}
                <path d="M..." />
              </svg>
            </a>
            <a href="#" className="hover:text-white" aria-label="LinkedIn">
              <svg className="h-5 w-5 inline-block" fill="currentColor" viewBox="0 0 24 24">
                {/* LinkedIn icon path */}
                <path d="M..." />
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center py-4 text-sm">
        &copy; {new Date().getFullYear()} Transport Management System. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
