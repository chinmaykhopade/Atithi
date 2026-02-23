"use client";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-saffron-50 hover:border-saffron-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-lg font-medium transition ${
            p === page
              ? "bg-saffron-500 text-white shadow-md"
              : "border border-gray-200 text-gray-600 hover:bg-saffron-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-saffron-50 hover:border-saffron-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}