// ------------------------------
// title: Tipos para consultas
// description: tipos de entrada e saida de dados para consultas em bancos de dados do Notion
// ------------------------------

export type GetDatabaseItemsOptions = {
  pageSize?: number        // paginação
  startCursor?: string     // paginação
  sorts?: any[]            // sorts do Notion
  // configs extras
  query?: string           // filtrar por título (contains)
  titleProperty?: string   // nome da coluna de título (default "Name")
  tags?: string[]          // filtrar por multi_select "Tags"
  tagProperty?: string     // nome da coluna de tags (default "Tags")
}

export type DatabaseItemsResponse<T> = {
  results: T[]
  nextCursor: string | null
  hasMore: boolean
}
