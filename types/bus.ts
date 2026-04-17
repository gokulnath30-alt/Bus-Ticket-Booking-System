export interface Bus {
  id: number;
  operator: string;
  from: string;
  to: string;
  time: string;
  fare: number;
  seats: boolean[];
}
