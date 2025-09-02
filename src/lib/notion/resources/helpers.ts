import { NotionRichTextNode } from "../types"

// ------------------------------
// Helpers
// ------------------------------
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

// ------------------------------
// Helpers de renderização
// ------------------------------
export function richTextRender(nodes: NotionRichTextNode[]): string {
  // Render básico com suporte a bold, italic, code, underline, strike e link
  return nodes.map(n => {
    const txt = escapeHtml(n.text?.content ?? n.plain_text ?? "")
    const a = n.annotations

    let html = txt
    if (a.code) html = `<code>${html}</code>`
    if (a.bold) html = `<strong>${html}</strong>`
    if (a.italic) html = `<em>${html}</em>`
    if (a.underline) html = `<u>${html}</u>`
    if (a.strikethrough) html = `<s>${html}</s>`

    const link = n.text?.link?.url ?? n.href
    if (link) html = `<a href="${escapeHtml(link)}" rel="noopener noreferrer" target="_blank">${html}</a>`

    return html
  }).join("")
}

// ------------------------------
// Normalizadores para computed_value
// ------------------------------
// function computeForProperty<P extends AnyProperty>(prop: P): ComputedValue<P> {
//   switch (prop.type) {
//     case "title":
//       return richTextToHtml(prop.title) as ComputedValue<P>
//     case "rich_text":
//       return richTextToHtml(prop.rich_text) as ComputedValue<P>
//     case "date":
//       return (prop.date ?? null) as ComputedValue<P>
//     case "select":
//       return (prop.select?.name ?? null) as ComputedValue<P>
//     case "multi_select":
//       return prop.multi_select.map(o => o.name) as ComputedValue<P>
//     case "files":
//       return prop.files.map(f => {
//         if (f.type === "external") return { name: f.name, url: f.external.url }
//         return { name: f.name, url: f.file.url }
//       }) as ComputedValue<P>
//     default:
//       // @ts-expect-error — para tipos não mapeados
//       return undefined
//   }
// }

// // Aplica computed_value a todo o objeto `properties`
// export function computeProperties<S extends PropertiesSchema>(props: S): WithComputed<S> {
//   const out: any = {}
//   for (const key in props) {
//     const p = props[key] as AnyProperty
//     out[key] = { ...p, computed_value: computeForProperty(p as any) }
//   }
//   return out as WithComputed<S>
// }

// // Converte uma página crua (do Notion) numa página tipada com computed_value
// export function formatNotionPage<S extends PropertiesSchema>(
//   raw: NotionPageBase & { properties: S },
// ): NotionPage<S> {
//   return {
//     ...raw,
//     properties: computeProperties(raw.properties),
//   }
// }
