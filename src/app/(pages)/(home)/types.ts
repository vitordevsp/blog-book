import type {
  EnsureNotionPropertiesSchema,
  NotionDateProperty,
  NotionMultiSelectProperty,
  NotionRichTextProperty,
  NotionSelectProperty,
  NotionTitleProperty,
} from "@/lib/notion"

export type PostProps = EnsureNotionPropertiesSchema<{
  status: NotionSelectProperty<PostPageStatusOpt>
  tags: NotionMultiSelectProperty<string>
  publishedAt: NotionDateProperty
  description: NotionRichTextProperty
  title: NotionTitleProperty
}>

type PostPageStatusOpt = "published" | "draft" | "private"
