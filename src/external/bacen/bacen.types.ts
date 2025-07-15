export interface BacenApiResponse {
  data: string;
  dataFim: string;
  valor: string;
}

export interface BacenCachedValue {
  data: string;
  dataFim: string;
  valor: number;
}

export interface BacenApiRange {
  initialDate: Date;
  finalDate: Date;
}
