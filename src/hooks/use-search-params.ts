import { parseAsString, useQueryState } from "nuqs";

// TODO: パーサーの設定 (https://nuqs.dev/docs/parsers/built-in#literals)

export function useSearchParam(key: string) {
  return useQueryState(
    key,
    parseAsString.withDefault("").withOptions({ clearOnDefault: true }),
  );
}
