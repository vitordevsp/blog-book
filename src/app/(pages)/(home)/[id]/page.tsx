import { getPageById } from "@/lib/notion"
import { PageRenderer, getAllBlockChildren, richTextRender } from "@/lib/notion"
import type { PostPage } from "../types"
import style from "./style.module.css"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params
  const blocks = await getAllBlockChildren(id, { deep: true })
  console.log("blocks:", blocks)

  const page = await getPageById<PostPage>("51b1db49-2e81-4a6b-af03-e62e94bde4c7")

  return (
    <main className={`${style.page} notion`}>
      <header className={style.page__header}>
        <h1>
          {richTextRender(page?.properties?.title?.title)}
        </h1>

        <p>
          {richTextRender(page?.properties?.description?.rich_text)}
        </p>

        <div>
          {page?.properties.tags.multi_select.map((t) => (
            <span key={t.id} className={style.page__tag}>
              {t.name}
            </span>
          ))}
        </div>
      </header>

      <PageRenderer blocks={blocks} />
    </main>
  )
}
