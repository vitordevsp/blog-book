// ------------------------------
// Properties (valores crus do Notion)
// ------------------------------

// Rich text / Title - nodes (básico)
export type NotionRichTextNode = {
  type: "text";
  plain_text: string;
  href: string | null;
  text: {
    content: string;
    link: null | {
      url: string
    }
  };
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean; color: string;
  };
};

export type NotionTitleProperty = {
  id: string;
  type: "title";
  title: NotionRichTextNode[];
};

export type NotionRichTextProperty = {
  id: string;
  type: "rich_text";
  rich_text: NotionRichTextNode[];
};

export type NotionDateProperty = {
  id: string;
  type: "date";
  date: {
    start: string;
    end: string | null;
    time_zone: string | null
  } | null;
};

export type NotionSelectProperty<Option extends string = string> = {
  id: string;
  type: "select";
  select: { id: string; name: Option; color: string } | null;
};

export type NotionMultiSelectProperty<Option extends string = string> = {
  id: string;
  type: "multi_select";
  multi_select: { id: string; name: Option; color: string }[];
};

export type NotionFilesProperty = {
  id: string
  type: "files"
  files: Array<
    | {
      type: "external";
      name: string;
      external: {
        url: string
      }
    }
    | {
      type: "file";
      name: string;
      file: {
        url: string;
        expiry_time: string
      }
    }
  >
}

export type NotionAnyProperty =
  | NotionTitleProperty
  | NotionRichTextProperty
  | NotionDateProperty
  | NotionSelectProperty<string>
  | NotionMultiSelectProperty<string>
  | NotionFilesProperty

export type NotionPropertiesSchema = Record<string, NotionAnyProperty>

// ------------------------------
// NotionPage
// ------------------------------

export type NotionPage<P extends NotionPropertiesSchema> = {
  object: "page";
  id: string;
  created_time: string;          // ISO
  last_edited_time: string;      // ISO
  created_by: NotionPageUserRef;
  last_edited_by: NotionPageUserRef;
  cover: null | {
    type: "external";
    external: {
      url: string
    }
  };
  icon: NotionPageIcon;
  parent: NotionPageParent;
  archived: boolean;
  in_trash: boolean;
  url: string;
  public_url: string | null;
  properties: P
}

export type NotionPageIcon = NotionPageIconEmoji | null;

export type NotionPageIconEmoji = {
  type: "emoji";
  emoji: string
}

export type NotionPageParent = {
  type: "database_id";
  database_id: string
}

export type NotionPageUserRef = {
  object: "user";
  id: string;
}

// ------------------------------
// Computed Value por tipo
// ------------------------------
// export type ComputedValue<T> =
//   T extends TitleProperty ? string :
//   T extends RichTextProperty ? string :                                 // HTML pronto
//   T extends DateProperty ? (T["date"]) :                                // {start,end,time_zone} | null
//   T extends SelectProperty<infer Opt> ? (Opt | null) :
//   T extends MultiSelectProperty<infer Opt> ? Opt[] :
//   T extends FilesProperty ? Array<{ name: string; url: string }> :
//   unknown;

// // Acrescenta computed_value em cada property do schema
// export type WithComputed<S extends PropertiesSchema> = {
//   [K in keyof S]: S[K] & { computed_value: ComputedValue<S[K]> }
// };

// // Página tipada com o schema enriquecido
// export type NotionPage<S extends PropertiesSchema> =
//   NotionPageBase & { properties: WithComputed<S> };

// ------------------------------
// Tipos para consulta de itens no database
// ------------------------------
export type GetDatabaseItemsOptions = {
  pageSize?: number;        // paginação
  startCursor?: string;     // paginação
  sorts?: any[];            // sorts do Notion
  // configs extras
  query?: string;           // filtrar por título (contains)
  titleProperty?: string;   // nome da coluna de título (default "Name")
  tags?: string[];          // filtrar por multi_select "Tags"
  tagProperty?: string;     // nome da coluna de tags (default "Tags")
};

// Assinatura genérica:
export type DatabaseItemsResponse<T> = {
  results: T[];
  nextCursor: string | null;
  hasMore: boolean;
};
