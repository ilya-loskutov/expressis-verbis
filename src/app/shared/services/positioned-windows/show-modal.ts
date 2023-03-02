import { InjectionToken } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { ModalConfigurations } from "../../config/components/modal";

export const SHOW_MODAL = new InjectionToken<BehaviorSubject<ModalConfigurations | null>>('show modal', {
    providedIn: 'root',
    factory: () => new BehaviorSubject<ModalConfigurations | null>(null)
});