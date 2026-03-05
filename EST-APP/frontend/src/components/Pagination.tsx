import React from "react";

export function Pagination({
  page,
  onPrev,
  onNext
}: {
  page: number;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-2">
      <button className="btn btn-secondary" onClick={onPrev} disabled={page <= 1}>
        Prev
      </button>
      <div className="text-sm text-slate-600">Page {page}</div>
      <button className="btn btn-secondary" onClick={onNext}>
        Next
      </button>
    </div>
  );
}