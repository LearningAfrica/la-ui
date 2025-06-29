declare module "@tiptap/extension-placeholder" {
  import { Extension } from "@tiptap/core"

  export interface PlaceholderOptions {
    emptyEditorClass: string
    emptyNodeClass: string
    placeholder: string
    showOnlyWhenEditable: boolean
    showOnlyCurrent: boolean
    includeChildren: boolean
  }

  export default class Placeholder extends Extension<PlaceholderOptions> {}
}