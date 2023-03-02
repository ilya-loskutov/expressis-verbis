import { TemplateRef } from "@angular/core"

export type ModalConfigurations = {
    isClosable: boolean,
    content: TemplateRef<HTMLElement>
}