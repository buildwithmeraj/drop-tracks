import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

function buildPageHref(page, search) {
  const params = new URLSearchParams();
  params.set("page", String(page));

  if (search) {
    params.set("search", search);
  }

  return `/dashboard/airdrops?${params.toString()}`;
}

const Pagination = ({
  page,
  totalPages,
  search = "",
  onPageChange,
  isLoading = false,
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const previousPage = Math.max(1, page - 1);
  const nextPage = Math.min(totalPages, page + 1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-base-content/65">
        Page {page} of {totalPages}
      </p>
      <div className="join">
        {onPageChange ? (
          <>
            <button
              type="button"
              disabled={page === 1 || isLoading}
              onClick={() => onPageChange(previousPage)}
              className={`btn join-item ${page === 1 || isLoading ? "btn-disabled" : ""}`}
            >
              <FaChevronLeft />
              Prev
            </button>
            <button
              type="button"
              disabled={page === totalPages || isLoading}
              onClick={() => onPageChange(nextPage)}
              className={`btn join-item ${page === totalPages || isLoading ? "btn-disabled" : ""}`}
            >
              Next
              <FaChevronRight />
            </button>
          </>
        ) : (
          <>
            <Link
              href={buildPageHref(previousPage, search)}
              aria-disabled={page === 1}
              className={`btn join-item ${page === 1 ? "btn-disabled" : ""}`}
            >
              <FaChevronLeft />
              Prev
            </Link>
            <Link
              href={buildPageHref(nextPage, search)}
              aria-disabled={page === totalPages}
              className={`btn join-item ${page === totalPages ? "btn-disabled" : ""}`}
            >
              Next
              <FaChevronRight />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Pagination;
