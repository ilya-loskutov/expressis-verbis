import { InjectionToken } from "@angular/core";

import { BehaviorSubject } from "rxjs";

import { AlertConfigurations } from "../../config/components/alert";

export const SHOW_ALERT = new InjectionToken<BehaviorSubject<AlertConfigurations | null>>('show alert', {
    providedIn: 'root',
    factory: () => new BehaviorSubject<AlertConfigurations | null>(null)
});