export interface IpeadataResponse {
  '@odata.context': string;
  value: {
    SERCODIGO: string;
    VALDATA: string;
    VALVALOR: number;
    NIVNOME: string;
    TERCODIGO: string;
  }[];
}

export interface IpeadataCachedValue {
  date: string;
  value: number;
}
