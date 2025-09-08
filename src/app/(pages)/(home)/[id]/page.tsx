import Link from "next/link"
import { Chip } from "@/components"
import { Flexbox } from "@/components/Flexbox"
import { PageRenderer, getAllBlockChildren, getPageById, richTextRender } from "@/lib/notion"
import { formatDateBR } from "@/utils/date-handle"
import style from "./style.module.css"
import type { PostProps } from "../types"

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = await params

  const page = await getPageById<PostProps>(id)
  console.log("page:", page)
  if (!page) return <div>Post não encontrado</div>

  const blocks = await getAllBlockChildren(id, { deep: true })
  console.log("blocks:", blocks)

  const title = richTextRender(page.properties.Nome.title)
  const description = richTextRender(page.properties.Descricao.rich_text)
  const wiki = page.properties.Wiki.select
  const tags = page.properties.Tags.multi_select
  const publishedIn = page.properties["Publicado Em"].date?.start

  return (
    <main className={`${style.page} notion`}>
      <Link href="/">
        <button>
          <Flexbox gap="8px">
            <b>{"<"}</b> Voltar para a home
          </Flexbox>
        </button>
      </Link>

      <header className={style.page__header}>
        <Flexbox gap="8px">
          {publishedIn && (
            <Chip>
              🕓 {formatDateBR(publishedIn)}
            </Chip>
          )}

          {wiki && (
            <Chip
              href={`/?wiki=${encodeURIComponent(wiki.name)}`}
            >
              {wiki.name}
            </Chip>
          )}
        </Flexbox>

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

        <Flexbox gap="8px">
          {tags.map((tag) => (
            <Chip
              key={tag.id}
              href={`/?tag=${encodeURIComponent(tag.name)}`}
            >
              {tag.name}
            </Chip>
          ))}
        </Flexbox>
      </header>

      <PageRenderer blocks={blocks} />
    </main>
  )
}
