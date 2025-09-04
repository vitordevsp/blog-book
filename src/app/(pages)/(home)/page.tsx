import Link from "next/link"
import { getDatabaseItems, richTextRender } from "@/lib/notion"
import style from "./style.module.css"
import type { PostPage } from "./types"

export default async function Home({
  searchParams,
}: {
  searchParams?: { tag?: string; q?: string; cursor?: string };
}) {
  const { tag, q: query, cursor } = await searchParams || {}

  const { results, nextCursor, hasMore } = await getDatabaseItems<PostPage>({
    tags: tag ? [tag] : undefined,
    query,
    startCursor: cursor ?? undefined,
    tagProperty: "tags",
    titleProperty: "title",
    sorts: [{ property: "publishedAt", direction: "descending" }],
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

        {tag && (
          <p>
            Filtrando por tag: <strong>{tag}</strong>{" "}
            <Link href="/">[limpar]</Link>
          </p>
        )}
      </div>

      <ul className={style.page__list}>
        {results.map((item) => {
          const { title, description, tags } = item.properties

          return (
            <li key={item.id} className={style.page__list__item}>
              <h3 className={style.page__list__item__title}>
                {richTextRender(title.title)}
              </h3>

              {description && (
                <p className={style.page__list__item__description}>
                  {richTextRender(description.rich_text)}
                </p>
              )}

              <div className={style.page__list__item__tags}>
                {tags.multi_select.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/?tag=${encodeURIComponent(tag.name)}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
                    className={style.page__list__item__tag}
                  >
                    {tag.name}
                  </Link>
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
