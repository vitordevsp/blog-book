import { RenderBlock } from ".."
import { getPageBlocks } from "@/lib/notion"
import style from "./style.module.css"

export async function NotionRenderer({ pageId }: { pageId: string }) {
  const { results } = await getPageBlocks(pageId)

  console.log("results: ", results)

  const nodes: React.ReactNode[] = []

  let i = 0
  while (i < results.length) {
    const b = results[i]

    if (b.type === "bulleted_list_item") {
      const items: any[] = []
      while (i < results.length && results[i].type === "bulleted_list_item") {
        items.push(results[i])
        i++
      }
      nodes.push(
        <ul key={`ul-${i}`}>{items.map((it) => <RenderBlock key={it.id} block={it} />)}</ul>,
      )
      continue
    }

    if (b.type === "numbered_list_item") {
      const items: any[] = []
      while (i < results.length && results[i].type === "numbered_list_item") {
        items.push(results[i])
        i++
      }
      nodes.push(
        <ol key={`ol-${i}`}>{items.map((it) => <RenderBlock key={it.id} block={it} />)}</ol>,
      )
      continue
    }

    nodes.push(<RenderBlock key={b.id} block={b} />)
    i++
  }

  return <div className={style.rendered}>{nodes}</div>
}
