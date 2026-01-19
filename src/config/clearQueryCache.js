import { client } from "./apolloClient";

export function clearQueryCache(queryField, objectPrefix) {
  if (!client || !queryField) return;

  try {
    // 1️⃣ Evict all objects with given prefix
    if (objectPrefix) {
      const allCache = client.cache.extract();
      Object.keys(allCache).forEach((key) => {
        if (key.startsWith(objectPrefix + ":")) {
          client.cache.evict({ id: key });
        }
      });
    }

    // 2️⃣ Evict the query from ROOT_QUERY entirely
    client.cache.evict({ id: "ROOT_QUERY", fieldName: queryField });

    // 3️⃣ Garbage collection to clean up dangling references
    client.cache.gc();

    console.log(
      `[Cache] Refreshed cache for "${queryField}" ${objectPrefix ? `and objects "${objectPrefix}:*"` : ""}`,
    );
  } catch (error) {
    console.error(
      `[Cache] Failed to refresh cache for "${queryField}":`,
      error,
    );
  }
}
