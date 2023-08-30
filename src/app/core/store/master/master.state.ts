export interface Master {
  id:string,
  name:string,
  description:string,
}
export interface MasterState {
  master: Master[]; // Adjust the type based on your data structure
}
