export const baseUrl: string = 'https://luxury.bluejaypos.vn';
export const signalrHubUrl: string =baseUrl+'signalr/hubs';
export const hubName: string ='blueJayRestaurantPosApHub';
//export const baseUrl: string = 'https://res.ringameal.com';
export const JsonDateFormat: string = 'YYYY-MM-DD[T]HH:mm:ss';
export const info_700: string = '#0369a1';
export const danger_700: string = '#be123c';
export enum TicketType {
  ToGo = 'To Go',
  ForHere = 'For Here',
}
export enum ToastType {
  _error = 'error',
  _success = 'success',
  _info = 'info',
}

export const enum ReportType {
  Invoice = 0,
  Server = 1,
  DailySummary = 2,
  DailyDetail = 3,
  Items = 4
}

export const enum ReportRange {
  Daily = 0,
  Weekly = 1,
  Monthly = 2,
  Custom = 3
}