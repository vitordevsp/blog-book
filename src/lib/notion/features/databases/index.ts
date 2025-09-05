import { notion } from "@/lib/notion/resources/client"
import { DatabaseItemsResponse, GetDatabaseItemsOptions } from "./types"

const databaseId = process.env.NOTION_DATABASE_ID!

export async function getDatabaseItems<T>(
  {
    pageSize = 100,
    startCursor,
    sorts,
    query,
    titleProperty,
    tags,
    tagProperty,
  }: GetDatabaseItemsOptions = {},
): Promise<DatabaseItemsResponse<T>> {
  // monta filtro composto
  const filters: any[] = []

  if (tags?.length) {
    // ANY: contém qualquer uma das tags
    filters.push({
      or: tags.map((t) => ({
        property: tagProperty,
        multi_select: { contains: t },
      })),
    })
  }

  if (query && query.trim()) {
    filters.push({
      property: titleProperty,
      title: { contains: query.trim() },
    })
  }

  const filter =
    filters.length === 0
      ? undefined
      : filters.length === 1
        ? filters[0]
        : { and: filters }

  const res = await notion.databases.query({
    database_id: databaseId,
    filter,
    sorts,
    page_size: pageSize,
    start_cursor: startCursor,
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
