export interface PriorityResult {
  score: number;
  level: "Low" | "Medium" | "High";
}

export const calculateTimeWeight = (createdAt: Date): number => {
  const now = new Date();
  const hoursPassed =
    (now.getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60);

  if (hoursPassed < 12) return 1;
  if (hoursPassed < 24) return 2;
  if (hoursPassed < 48) return 3;
  return 4;
};

export const calculatePriority = (
  urgency: number,
  severity: number,
  publicImpact: number,
  createdAt: Date = new Date(),
): PriorityResult => {
  const timeWeight = calculateTimeWeight(createdAt);

  const score =
    urgency * 0.3 + severity * 0.3 + publicImpact * 0.2 + timeWeight * 0.2;

  let level: "Low" | "Medium" | "High";

  if (score >= 8) level = "High";
  else if (score >= 5) level = "Medium";
  else level = "Low";

  return {
    score: Number(score.toFixed(2)),
    level,
  };
};
