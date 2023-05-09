export enum FavoriteType {
  patient,
  order
}

export interface FavoriteView {
  id: string;
  type: FavoriteType;
  typeKey: string;
  name: string;
}
