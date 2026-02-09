"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
  totalItems?: number;
}

export function usePagination(options: UsePaginationOptions = {}) {
  const { initialPage = 1, initialLimit = 10, totalItems = 0 } = options;

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : initialPage;
  });

  const [limit, setLimit] = useState(() => {
    const limitParam = searchParams.get("limit");
    return limitParam ? parseInt(limitParam, 10) : initialLimit;
  });

  const totalPages = Math.ceil(totalItems / limit);

  const updateUrl = useCallback(
    (newPage: number, newLimit: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", newPage.toString());
      params.set("limit", newLimit.toString());
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const goToPage = useCallback(
    (newPage: number) => {
      const validPage = Math.max(1, Math.min(newPage, totalPages || 1));
      setPage(validPage);
      updateUrl(validPage, limit);
    },
    [totalPages, limit, updateUrl]
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      goToPage(page + 1);
    }
  }, [page, totalPages, goToPage]);

  const prevPage = useCallback(() => {
    if (page > 1) {
      goToPage(page - 1);
    }
  }, [page, goToPage]);

  const changeLimit = useCallback(
    (newLimit: number) => {
      setLimit(newLimit);
      setPage(1);
      updateUrl(1, newLimit);
    },
    [updateUrl]
  );

  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    changeLimit,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
