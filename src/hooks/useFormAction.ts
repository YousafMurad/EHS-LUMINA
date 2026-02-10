"use client";

import { useState, useCallback, useTransition } from "react";
import type { ActionResult } from "@/types";

interface UseFormActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
}

export function useFormAction<TInput, TOutput>(
  action: (input: TInput) => Promise<ActionResult<TOutput>>,
  options?: UseFormActionOptions<TOutput>
) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TOutput | null>(null);

  const execute = useCallback(
    async (input: TInput) => {
      setError(null);

      startTransition(async () => {
        try {
          const result = await action(input);

          if (result.error) {
            setError(result.error);
            options?.onError?.(result.error);
          } else if (result.data !== undefined) {
            setData(result.data);
            options?.onSuccess?.(result.data);
          }
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An error occurred";
          setError(errorMessage);
          options?.onError?.(errorMessage);
        }
      });
    },
    [action, options]
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return {
    execute,
    isPending,
    error,
    data,
    reset,
  };
}
