import { notion } from "@/lib/notion"
import { toNotionFilter } from "./filters"
import type { DatabaseItemsResponse, GetDatabaseItemsOptions } from "./types"

const databaseId = process.env.NOTION_DATABASE_ID!

export async function getDatabaseItems<T>(
  {
    startCursor,
    pageSize = 100,
    where,
    sorts,
  }: GetDatabaseItemsOptions = {},
): Promise<DatabaseItemsResponse<T>> {
  const filter = toNotionFilter(where)

  console.log("filter: ", filter)

  const res = await notion.databases.query({
    database_id: databaseId,
    start_cursor: startCursor,
    page_size: pageSize,
    filter,
    sorts,
  }) as any

  return {
    results: res.results as T[],
    nextCursor: res.next_cursor ?? null,
    hasMore: res.has_more,
  }
}

export async function getDatabaseProps<T>(): Promise<T> {
  const db = await notion.databases.retrieve({ database_id: databaseId }) as any
  return db as T
}
