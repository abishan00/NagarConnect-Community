export type DepartmentType =
  | "Public Works"
  | "Sanitation"
  | "Water Department"
  | "General";

export const assignDepartment = (category: string): DepartmentType => {
  const normalized = category.toLowerCase();

  if (normalized.includes("road")) return "Public Works";
  if (normalized.includes("garbage")) return "Sanitation";
  if (normalized.includes("water")) return "Water Department";

  return "General";
};
