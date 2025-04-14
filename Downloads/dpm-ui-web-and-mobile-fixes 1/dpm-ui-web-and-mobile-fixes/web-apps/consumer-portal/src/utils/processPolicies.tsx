import { PolicyDetail } from "types/PolicyDetail";

export function processPolicies(policies: PolicyDetail[]): PolicyDetail[] {
  // Group by policyNo
  const groupedByPolicyNo: Record<string, PolicyDetail[]> = (policies || []).reduce((acc, obj) => {
    const key: string = obj.policyNo;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(obj);
    return acc;
  }, {} as Record<string, PolicyDetail[]>);

  // Filter each group
  const result = Object.values(groupedByPolicyNo)
    .map((group) => {
      if (group.length === 1) {
        return group[0].endorsementNo === null ? group : [];
      }
      return group
        .filter((item) => item.endorsementNo !== null)
        .sort((a, b) => {
          if (b.endorsementNo && a.endorsementNo) {
            return b.endorsementNo.localeCompare(a.endorsementNo);
          }
          return 0;
        });
    })
    .map((group) => group[0]);
  return result;
}