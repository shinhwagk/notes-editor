export interface IIndex {
  labels: string[];
  categorys: ICategory[];
  seq: number;
}

export interface ICategory {
  cols: number;
  name: string;
  notes: INote[];
}

export interface INote {
  d: number; // doc/markdown
  f: number; // files
  i: number; // id
}
