import { QueryFilter } from "./types"

export function toNotionFilter(input?: QueryFilter | QueryFilter[]): any | undefined {
  if (!input) return undefined
  const node = Array.isArray(input) ? { and: input } : input
  const built = build(node)
  const collapsed = collapse(built)
  return collapsed
}

function build(node: QueryFilter): any | undefined {
  if ("raw" in node) return node.raw

  // Compostos
  if ("and" in node) {
    const parts = node.and.map(build).filter(Boolean)
    return parts.length ? { and: parts } : undefined
  }
  if ("or" in node) {
    const parts = node.or.map(build).filter(Boolean)
    return parts.length ? { or: parts } : undefined
  }

  // Propriedades
  const { property, type } = node as any

  switch (type) {
    case "title": {
      const payload = mapText(node as any)
      if (!payload) return undefined
      else return { property, title: mapText(node as any) }
    }
    case "rich_text": {
      const payload = mapText(node as any)
      if (!payload) return undefined
      else return { property, rich_text: mapText(node as any) }
    }
    case "select": {
      const payload = mapSelect(node as any)
      if (!payload) return undefined
      else return { property, select: mapSelect(node as any) }
    }
    case "status": {
      const payload = mapSelect(node as any)
      if (!payload) return undefined
      else return { property, status: mapSelect(node as any) }
    }
    case "multi_select": {
      const payload = mapMulti(property, node as any)
      if (!payload) return undefined
      else return payload
    }
    case "date": {
      const payload = mapDate(node as any)
      if (!payload) return undefined
      else return { property, date: mapDate(node as any) }
    }
    case "number": {
      const payload = mapNumber(node as any)
      if (!payload) return undefined
      else return { property, number: mapNumber(node as any) }
    }
    case "checkbox": {
      const payload = mapCheckbox(node as any)
      if (!payload) return undefined
      else return { property, checkbox: mapCheckbox(node as any) }
    }
    default: {
      console.error(`Tipo de filtro não suportado: ${type}`)
      return undefined
    }
  }
}

/* ----------------- Helpers de limpeza ----------------- */

function isEmptyString(v: unknown) {
  return typeof v === "string" ? v.trim() === "" : v == undefined
}

function cleanStrArray(arr?: (string | undefined)[]) {
  if (!Array.isArray) return []
  return (arr ?? []).filter((s) => typeof s === "string" && s.trim() !== "")
}

/* Colapsa AND/OR com 0 ou 1 item (evita embrulhos desnecessários) */
function collapse(v: any): any | undefined {
  if (!v) return undefined
  if (v.and && Array.isArray(v.and)) {
    const a = v.and.filter(Boolean)
    if (a.length === 0) return undefined
    if (a.length === 1) return a[0]
    return { and: a }
  }
  if (v.or && Array.isArray(v.or)) {
    const o = v.or.filter(Boolean)
    if (o.length === 0) return undefined
    if (o.length === 1) return o[0]
    return { or: o }
  }
  return v
}

/* ----------------- mapeadores por tipo ----------------- */

function mapText(n: { op: string; value?: string }) {
  const { op, value } = n

  if (isEmptyString(value)) return undefined

  switch (op) {
    case "contains":
    case "does_not_contain":
    case "equals":
    case "does_not_equal":
    case "starts_with":
    case "ends_with":
      return { [op]: value! }
    case "is_empty":
    case "is_not_empty":
      return { [op]: true }
    default:
      throw new Error(`Operador de text inválido: ${op}`)
  }
}

function mapSelect(n: { op: string; value?: string }) {
  const { op, value } = n

  if (isEmptyString(value)) return undefined

  switch (op) {
    case "equals":
    case "does_not_equal":
      return { [op]: value }
    case "is_empty":
    case "is_not_empty":
      return { [op]: true }
    default:
      throw new Error(`Operador de select/status inválido: ${op}`)
  }
}

function mapMulti(
  property: string,
  n: { op: string; value?: string | (string | undefined)[] },
) {
  const { op, value } = n

  if (!value) return undefined

  // Helpers (any_of / all_of / none_of)
  if (op === "any_of" || op === "all_of" || op === "none_of") {
    const arr = cleanStrArray(value as (string | undefined)[])
    if (arr.length === 0) return undefined
    if (op === "any_of") return { or: arr.map(v => ({ property, multi_select: { contains: v } })) }
    if (op === "all_of") return { and: arr.map(v => ({ property, multi_select: { contains: v } })) }
    /* none_of */
    return { and: arr.map(v => ({ property, multi_select: { does_not_contain: v } })) }
  }

  // Nativos: aceita string OU array (sugar):
  if (op === "contains" || op === "does_not_contain") {
    // string única
    if (typeof value === "string") {
      if (isEmptyString(value)) return undefined
      return { property, multi_select: { [op]: value } }
    }
    // array → normaliza
    const arr = cleanStrArray(value as (string | undefined)[])
    if (arr.length === 0) return undefined
    if (arr.length === 1) {
      return { property, multi_select: { [op]: arr[0] } }
    }
    // múltiplos: contains[] ⇒ ANY(OR); does_not_contain[] ⇒ NONE(AND)
    return op === "contains"
      ? { or: arr.map(v => ({ property, multi_select: { contains: v } })) }
      : { and: arr.map(v => ({ property, multi_select: { does_not_contain: v } })) }
  }

  throw new Error(`Operador de multi_select inválido: ${op}`)
}

function mapDate(n: { op: string; value?: string }) {
  const { op, value } = n

  if (isEmptyString(value)) return undefined

  switch (op) {
    case "before":
    case "after":
    case "on_or_before":
    case "on_or_after":
    case "equals":
      return { [op]: value }
    case "past_week":
    case "past_month":
    case "past_year":
    case "next_week":
    case "next_month":
    case "next_year":
      return { [op]: {} }
    case "is_empty":
    case "is_not_empty":
      return { [op]: true }
    default:
      throw new Error(`Operador de date inválido: ${op}`)
  }
}

function mapNumber(n: { op: string; value?: number }) {
  const { op, value } = n

  if (value == null || Number.isNaN(value)) return undefined

  switch (op) {
    case "equals":
    case "does_not_equal":
    case "greater_than":
    case "less_than":
    case "greater_than_or_equal_to":
    case "less_than_or_equal_to":
      return { [op]: value }
    case "is_empty":
    case "is_not_empty":
      return { [op]: true }
    default:
      throw new Error(`Operador de number inválido: ${op}`)
  }
}

function mapCheckbox(n: { op: "equals" | "does_not_equal"; value?: boolean }) {
  const { op, value } = n
  if (value == null) return undefined
  return { [op]: value }
}
