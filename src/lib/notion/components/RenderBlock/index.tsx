// app/components/RenderBlock.tsx
import React from "react"

function rich(rt: any[] = []) {
  return rt.map((r: any, i: number) => {
    const t = r?.plain_text ?? ""
    const a = r?.annotations ?? {}
    let node: React.ReactNode = t
    if (a?.code) node = <code>{node}</code>
    if (a?.bold) node = <strong>{node}</strong>
    if (a?.italic) node = <em>{node}</em>
    if (a?.underline) node = <u>{node}</u>
    if (a?.strikethrough) node = <s>{node}</s>
    return <React.Fragment key={i}>{node}</React.Fragment>
  })
}

export function RenderBlock({ block }: { block: any }) {
  switch (block.type) {
    case "paragraph":
      return <p>{rich(block.paragraph?.rich_text)}</p>

    case "heading_1":
      return <h1>{rich(block.heading_1?.rich_text)}</h1>

    case "heading_2":
      return <h2>{rich(block.heading_2?.rich_text)}</h2>

    case "heading_3":
      return <h3>{rich(block.heading_3?.rich_text)}</h3>

    case "bulleted_list_item":
      return <li>{rich(block.bulleted_list_item?.rich_text)}</li>

    case "numbered_list_item":
      return <li>{rich(block.numbered_list_item?.rich_text)}</li>

    case "quote":
      return <blockquote>{rich(block.quote?.rich_text)}</blockquote>

    case "code":
      return (
        <pre>
          <code>{block.code?.rich_text?.map((r: any) => r.plain_text).join("")}</code>
        </pre>
      )

    case "divider":
      return <hr />

    case "image": {
      const data = block.image
      const src = data?.type === "file" ? data?.file?.url : data?.external?.url
      const alt = data?.caption?.map((r: any) => r.plain_text).join(" ") || ""
      return src ? <img src={src} alt={alt} /> : null
    }

    default:
      return null
  }
}
