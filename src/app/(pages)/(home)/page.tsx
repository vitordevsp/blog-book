import Link from "next/link"
import { Chip } from "@/components"
import { getDatabaseItems, richTextRender } from "@/lib/notion"
import { formatDateBR } from "@/utils/date-handle"
import style from "./style.module.css"
import type { PostProps } from "./types"

export default async function Home({
  searchParams,
}: {
  searchParams?: { q?: string; cursor?: string; tag?: string; wiki?: string; }
}) {
  const { tag, cursor, q: query, wiki } = await searchParams || {}

  const { results, nextCursor, hasMore } = await getDatabaseItems<PostProps>({
    startCursor: cursor ?? undefined,
    sorts: [
      { property: "Publicado Em", direction: "ascending" },
      { property: "Criado Em", direction: "ascending" },
    ],
    where: {
      and: [
        { property: "Publicado Em", type: "date", op: "is_not_empty" },
      ],
      or: [
        { property: "Nome", type: "title", op: "contains", value: query },
        { property: "Tags", type: "multi_select", op: "any_of", value: [tag] },
        { property: "Wiki", type: "select", op: "equals", value: wiki },
      ],
    },
  })

  console.log("results: ", results)

  return (
    <main className={style.page}>
      <header className={style.page__header}>
        <h1>Blog Notion CMS</h1>

        <p>
          Um template simples de blog usando o Notion como CMS
        </p>
      </header>

      <div className={style.page__filter}>
        <form className={style.page__filter__form}>
          <input
            type="text"
            name="q"
            defaultValue={query ?? ""}
            placeholder="Buscar por título…"
            className={style.page__filter__input}
          />

          <button type="submit" className={style.page__filter__button}>
            <span>🔍</span> Buscar
          </button>
        </form>

        {wiki && (
          <p>
            Filtrando por wiki: <strong>{wiki}</strong>{" "}
            <Link href="/">[limpar]</Link>
          </p>
        )}

        {tag && (
          <p>
            Filtrando por tag: <strong>{tag}</strong>{" "}
            <Link href="/">[limpar]</Link>
          </p>
        )}
      </div>

      <ul className={style.page__list}>
        {results.map((item) => {
          const title = richTextRender(item.properties.Nome.title)
          const description = richTextRender(item.properties.Descricao.rich_text)
          const wiki = item.properties.Wiki.select
          const tags = item.properties.Tags.multi_select
          const publishedIn = item.properties["Publicado Em"].date?.start

          return (
            <li key={item.id} className={style.page__list__item}>
              <h3 className={style.page__list__item__title}>
                {title}
              </h3>

              <div className={style.page__list__item__tags}>
                {publishedIn && (
                  <Chip>
                    🕓 {formatDateBR(publishedIn)}
                  </Chip>
                )}

                {wiki && (
                  <Chip
                    href={`/?wiki=${encodeURIComponent(wiki.name)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                  >
                    {wiki.name}
                  </Chip>
                )}
              </div>

              {description && (
                <p className={style.page__list__item__description}>
                  {description}
                </p>
              )}

              <div className={style.page__list__item__tags}>
                {tags.map((tag) => (
                  <Chip
                    key={tag.id}
                    href={`/?tag=${encodeURIComponent(tag.name)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                  >
                    {tag.name}
                  </Chip>
                ))}
              </div>

              <Link
                href={`/${item.id}`}
                className={style.page__list__item__overlay}
                aria-label="Abrir post"
              />
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <div className={style.page__pagination}>
          <Link
            href={`/?${[
              query ? `q=${encodeURIComponent(query)}` : "",
              tag ? `tag=${encodeURIComponent(tag)}` : "",
              nextCursor ? `cursor=${encodeURIComponent(nextCursor)}` : "",
            ]
              .filter(Boolean)
              .join("&")}`}
          >
            Próxima página →
          </Link>
        </div>
      )}
    </main>
  )
}
