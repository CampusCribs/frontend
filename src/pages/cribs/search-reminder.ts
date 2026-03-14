export type AppliedCribSearch = {
  campus: string;
  locationQuery: string;
  minPrice: number;
  maxPrice: number;
  listingType: string;
  roomType: string;
  leaseTerm: string;
  moveInWindow: string;
  beginDate: string;
  endDate: string;
  commuteBucket: string;
  roommates: number;
  tagIds: string[];
  tagNames: string[];
  filterKeys: string[];
};

export function getReminderSummaryLines(search: AppliedCribSearch) {
  const lines: string[] = [];

  if (search.campus) lines.push(`Campus: ${search.campus}`);
  else if (search.locationQuery) lines.push(`Area: ${search.locationQuery}`);

  lines.push(`Price: $${search.minPrice} - $${search.maxPrice}`);

  if (search.listingType !== "sublease") {
    lines.push(`Listing type: ${search.listingType.replaceAll("_", " ")}`);
  }
  if (search.roomType !== "any") {
    lines.push(`Room type: ${search.roomType.replaceAll("_", " ")}`);
  }
  if (search.leaseTerm !== "any") {
    lines.push(`Lease term: ${search.leaseTerm.replaceAll("_", " ")}`);
  }
  if (search.moveInWindow !== "any") {
    lines.push(`Move-in: ${search.moveInWindow.replaceAll("_", " ")}`);
  }
  if (search.beginDate) {
    lines.push(`Begin date: ${search.beginDate}`);
  }
  if (search.endDate) {
    lines.push(`End date: ${search.endDate}`);
  }
  if (search.commuteBucket) {
    lines.push(`Distance: ${search.commuteBucket.replaceAll("_", " ")}`);
  }
  if (search.roommates > 0) {
    lines.push(`Roommates: ${search.roommates === 3 ? "3+" : search.roommates}`);
  }
  if (search.tagNames.length > 0) {
    lines.push(`Tags: ${search.tagNames.join(", ")}`);
  }
  if (search.filterKeys.length > 0) {
    lines.push(`Extras: ${search.filterKeys.length} active filters`);
  }

  return lines;
}
