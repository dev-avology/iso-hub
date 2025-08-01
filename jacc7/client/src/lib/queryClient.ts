import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const error = await res.text();
    throw new Error(error);
  }
  return res;
}

function getQueryFn({ on401 }: { on401: "throw" | "return" }): QueryFunction {
  return async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (res.status === 401) {
      if (on401 === "throw") {
        throw new Error("Unauthorized");
      } else {
        return null;
      }
    }

    return throwIfResNotOk(res).then((res) => res.json());
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      staleTime: 30 * 1000, // 30 seconds - data is fresh for 30 seconds
      gcTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
      retry: 1, // Only retry once
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnMount: true, // Refetch on mount
      refetchOnReconnect: true, // Refetch on reconnect
    },
    mutations: {
      retry: 1, // Only retry once for mutations
    },
  },
});

export async function apiRequest(
  method: string,
  url: string,
  body?: any,
  options?: { on401?: "throw" | "return" }
) {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    if (options?.on401 === "return") {
      return res;
    }
    throw new Error("Unauthorized");
  }

  return throwIfResNotOk(res);
}
