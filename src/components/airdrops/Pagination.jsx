import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

const Pagination = ({ page, totalPages }) => {
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
        <Link
          href={`/dashboard/airdrops?page=${previousPage}`}
          aria-disabled={page === 1}
          className={`btn join-item ${page === 1 ? "btn-disabled" : ""}`}
        >
          <FaChevronLeft />
          Prev
        </Link>
        <Link
          href={`/dashboard/airdrops?page=${nextPage}`}
          aria-disabled={page === totalPages}
          className={`btn join-item ${page === totalPages ? "btn-disabled" : ""}`}
        >
          Next
          <FaChevronRight />
        </Link>
      </div>
    </div>
  );
};

export default Pagination;
