export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>
            Media coverage tracked automatically via Google News.
            Data refreshed every 6 hours.
          </p>
          <p>
            &copy; {new Date().getFullYear()} Best for Britain
          </p>
        </div>
      </div>
    </footer>
  );
}
