import { InjectionToken } from "@angular/core";

import { BehaviorSubject } from "rxjs";

export const SHOW_PRELOADER = new InjectionToken<BehaviorSubject<boolean>>('show preloader', {
    providedIn: 'root',
    factory: () => new BehaviorSubject<boolean>(true)
});