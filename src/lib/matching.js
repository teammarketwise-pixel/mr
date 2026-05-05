// Filters & scores locations based on user criteria
export function filterAndScoreLocations(locations, { budget, region, audience }) {
  if (!locations || locations.length === 0) return [];

  const budgetNum = Number(budget) || 0;
  const regionLower = (region || '').toLowerCase();

  const filtered = locations.filter((loc) => {
    // Budget filter
    if (budgetNum > 0 && loc.price_per_week > budgetNum) return false;

    // Region filter (match city OR region)
    if (regionLower) {
      const matchesCity = (loc.city || '').toLowerCase().includes(regionLower);
      const matchesRegion = (loc.region || '').toLowerCase().includes(regionLower);
      if (!matchesCity && !matchesRegion) return false;
    }

    return true;
  });

  // Score by audience match
  const scored = filtered.map((loc) => {
    const tags = (loc.target_audience_tags || '').split(',').map(t => t.trim());
    let score = 60; // base

    if (audience && tags.includes(audience)) {
      score = 85 + Math.round(Math.random() * 13); // 85-98
    } else if (audience && tags.length > 0) {
      score = 65 + Math.round(Math.random() * 15);
    }

    // Budget fit bonus (closer to budget = slightly higher)
    if (budgetNum > 0) {
      const ratio = loc.price_per_week / budgetNum;
      if (ratio > 0.5 && ratio < 0.95) score = Math.min(98, score + 2);
    }

    return { ...loc, matchScore: score };
  });

  return scored.sort((a, b) => b.matchScore - a.matchScore);
}
