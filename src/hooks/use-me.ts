import { useGetAppMe } from "@/gen";
import useAuthenticatedClientConfig from "./use-authenticated-client-config";

export function useMe() {
  const config = useAuthenticatedClientConfig();

  const hasToken = !!config?.client?.headers?.Authorization;

  const { data, isLoading, isError } = useGetAppMe({
    ...config,
    query: {
      enabled: hasToken,
      staleTime: 1000 * 60 * 5,
    },
  });

  const me = data?.data;

  return { me, isLoading, isError };
}
