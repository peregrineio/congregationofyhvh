"use client";

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void _error;
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 px-4">
          <h1 className="text-3xl font-bold">Something Went Wrong</h1>
          <p className="text-gray-400 max-w-md mx-auto">
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={reset}
            className="inline-flex items-center justify-center rounded-md bg-[#C9A227] text-[#0A0A0A] px-6 py-2 font-medium hover:bg-[#C9A227]/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
