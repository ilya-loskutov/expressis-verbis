export enum AlertState {
    error = 'error',
    success = 'success',
    warning = 'warning'
}

export type AlertConfigurations = {
    state: AlertState,
    message: string
}