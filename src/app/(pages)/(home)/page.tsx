import Link from "next/link"
import { listPosts } from "@/app/lib/notion"
import style from "./style.module.css"

export default async function Home({
  searchParams,
}: {
  searchParams?: { tag?: string; q?: string; cursor?: string };
}) {
  const { tag, q, cursor } = await searchParams || {}

  const { results, nextCursor, hasMore } = await listPosts({
    tags: tag ? [tag] : undefined,
    query: q,
    pageSize: 10,
    startCursor: cursor ?? undefined,
  })

  console.log("results: ", results)

  return (
    <main className={style.page}>
      <header className={style.page__header}>
        <h1>Blog Book</h1>
        <p>Um template simples de blog usando o Notion como CMS</p>
      </header>

      <div className={style.page__filter}>
        <form className={style.page__filter__form}>
          <input
            type="text"
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar por título…"
            className={style.page__filter__input}
          />

          <button type="submit" className={style.page__filter__button}>
            Buscar
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
        {results.map((p: any) => {
          const props = p.properties || {}
          const title = props?.title?.title?.[0]?.plain_text || "(sem título)"
          const description = props?.description?.rich_text?.[0]?.plain_text
          const tags: string[] = (props?.tags?.multi_select || []).map((t: any) => t.name)

          return (
            <li key={p.id}>
              <Link href={`/${p.id}`} className={style.page__list__item}>
                <h3 className={style.page__list__item__title}>
                  {title}
                </h3>

                {description && (
                  <p className={style.page__list__item__description}>
                    {description}
                  </p>
                )}

                <div className={style.page__list__item__tags}>
                  {tags.map((t) => (
                    <Link
                      key={t}
                      href={`/?tag=${encodeURIComponent(t)}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                      className={style.page__list__item__tag}
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </Link>
            </li>
          )
        })}
      </ul>

      {hasMore && (
        <div className={style.page__pagination}>
          <Link
            href={`/?${[
              q ? `q=${encodeURIComponent(q)}` : "",
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
