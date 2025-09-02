import { notion } from "./resources/client"
import { DatabaseItemsResponse, GetDatabaseItemsOptions } from "./types"

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
  const databaseId = process.env.NOTION_DATABASE_ID!
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
  })

  return {
    results: res.results as unknown as T[],
    nextCursor: res.next_cursor ?? null,
    hasMore: res.has_more,
  }
}

export async function getPageBlocks(pageId: string, pageSize = 100) {
  const res = await notion.blocks.children.list({
    block_id: pageId,
    page_size: Math.min(pageSize, 100),
  })
  return {
    results: res.results as any[],
    nextCursor: res.next_cursor ?? null,
    hasMore: res.has_more,
  }
}
