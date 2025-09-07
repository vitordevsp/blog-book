// ------------------------------
// title: Functions | Tipos para consultas
// description: tipos de entrada e saida de dados para consultas em bancos de dados do Notion
// ------------------------------

export type GetDatabaseItemsOptions = {
  startCursor?: string                // paginação
  pageSize?: number                   // paginação
  where?: QueryFilter | QueryFilter[] // wrapper de filtros
  sorts?: any[]                       // sorts do Notion
}

export type DatabaseItemsResponse<T> = {
  results: T[]
  nextCursor: string | null
  hasMore: boolean
}

// ------------------------------
// title: Filter (where) | Tipos para consultas
// description: construção de queries para buscas no Notion
// ------------------------------

// Operadores por tipo (subset útil para blog; dá pra expandir depois)
type TextOps =
  | { op: "contains" | "does_not_contain" | "equals" | "does_not_equal" | "starts_with" | "ends_with" }
  | { op: "is_empty" | "is_not_empty" }

type NumberOps =
  | { op: "equals" | "does_not_equal" | "greater_than" | "less_than" | "greater_than_or_equal_to" | "less_than_or_equal_to" }
  | { op: "is_empty" | "is_not_empty" }

type DateOps =
  | { op: "before" | "after" | "on_or_before" | "on_or_after" | "equals" }
  | { op: "past_week" | "past_month" | "past_year" | "next_week" | "next_month" | "next_year" }
  | { op: "is_empty" | "is_not_empty" }

// `multi_select` ganha semânticas ANY/ALL/NONE além dos operadores nativos
type MultiOps =
  | { op: "contains" | "does_not_contain"; value?: string | (string | undefined)[] }
  | { op: "any_of" | "all_of" | "none_of"; value?: (string | undefined)[] } // helpers compostos

type SelectOps =
  | { op: "equals" | "does_not_equal"; value?: string }
  | { op: "is_empty" | "is_not_empty" }

type CheckboxOps = { op: "equals" | "does_not_equal"; value?: boolean }

type StatusOps = SelectOps // na API filtra como select

// Para cada tipo, o valor/shape adequado
export type PropFilter =
  | { property: string; type: "title" | "rich_text"; value?: string; } & TextOps
  | { property: string; type: "select"; } & SelectOps
  | { property: string; type: "multi_select"; } & MultiOps
  | { property: string; type: "status"; } & StatusOps
  | { property: string; type: "date"; value?: string; } & DateOps // datas ISO quando aplicável
  | { property: string; type: "number"; value?: number; } & NumberOps
  | { property: string; type: "checkbox"; } & CheckboxOps
  // fallback para casos não mapeados ainda: você pode passar um objeto "bruto"
  | { raw: any }

export type LogicNode = { and: QueryFilter[] } | { or: QueryFilter[] }

export type QueryFilter = LogicNode | PropFilter
