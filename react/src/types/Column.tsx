export interface Column<T> {
  header: string;
  key: keyof T;
  align?: "left" | "center" | "right";
  render?: (value: any, row: T) => React.ReactNode;
}