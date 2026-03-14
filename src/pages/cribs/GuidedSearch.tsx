import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetPostTags } from "@/gen";
import { residenceCardDTOCommuteBucketEnum } from "@/gen/types/ResidenceCardDTO";
import {
  Bus,
  CalendarRange,
  ChevronRight,
  GraduationCap,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { AppliedCribSearch } from "./search-reminder";

export type FilterItem = {
  key: string;
  label: string;
  description?: string;
};

export type FilterCategory = {
  id: string;
  label: string;
  items: FilterItem[];
};

const FILTER_CATEGORIES: FilterCategory[] = [
  {
    id: "costs",
    label: "Costs",
    items: [
      { key: "all_utilities_included", label: "All utilities included" },
      { key: "utilities_included", label: "Utilities included" },
      { key: "internet_included", label: "Internet included" },
      { key: "electric_included", label: "Electric included" },
      {
        key: "low_deposit",
        label: "Low/no deposit",
        description: "Low or $0 security deposit",
      },
      { key: "no_broker_fee", label: "No broker fee" },
      { key: "no_application_fee", label: "No application fee" },
      { key: "no_sublet_fee", label: "No sublet / transfer fee" },
    ],
  },
  {
    id: "room_setup",
    label: "Room setup",
    items: [
      { key: "furnished", label: "Furnished" },
      { key: "private_bedroom", label: "Private bedroom" },
      { key: "private_bathroom", label: "Private bathroom" },
      { key: "bed_included", label: "Bed included" },
      { key: "desk_included", label: "Desk/workspace included" },
      { key: "in_unit_laundry", label: "In-unit laundry" },
      { key: "in_building_laundry", label: "In-building laundry" },
    ],
  },
  {
    id: "roommate_fit",
    label: "Roommate fit",
    items: [
      { key: "female_household", label: "Female household" },
      { key: "male_household", label: "Male household" },
      { key: "coed_household", label: "Co-ed household" },
      { key: "undergrad_friendly", label: "Undergrad-friendly" },
      { key: "graduate_friendly", label: "Graduate-friendly" },
      { key: "guest_friendly", label: "Guest-friendly" },
    ],
  },
  {
    id: "convenience",
    label: "Convenience",
    items: [
      { key: "walkable_to_campus", label: "Walkable to campus" },
      { key: "near_shuttle_or_bus", label: "Near shuttle/bus stop" },
      { key: "reserved_parking", label: "Reserved parking" },
      { key: "street_parking", label: "Free street parking" },
      { key: "bike_storage", label: "Bike storage" },
      { key: "air_conditioning", label: "Air conditioning" },
      { key: "dishwasher", label: "Dishwasher" },
    ],
  },
  {
    id: "trust",
    label: "Trust & safety",
    items: [
      { key: "verified_listing", label: "Verified listing" },
      { key: "verified_poster", label: "Verified poster" },
      {
        key: "verified_students_only",
        label: "Verified students only",
        description: "Only show listings from verified students",
      },
      {
        key: "secure_entry",
        label: "Secure entry",
        description: "Key fob / controlled access",
      },
      { key: "package_lockers", label: "Secure packages/mailroom" },
    ],
  },
  {
    id: "policies",
    label: "Policies",
    items: [
      { key: "pets_allowed", label: "Pets allowed" },
      { key: "no_smoking", label: "No smoking" },
      { key: "couples_allowed", label: "Couples allowed" },
    ],
  },
];

const FEATURED_CAMPUSES = [
  {
    name: "UCLA",
    city: "Los Angeles, CA",
  },
  {
    name: "UCSD",
    city: "La Jolla, CA",
  },
  {
    name: "UC Berkeley",
    city: "Berkeley, CA",
  },
  {
    name: "UCI",
    city: "Irvine, CA",
  },
] as const;

const listingTypeOptions = [
  { value: "sublease", label: "Sublease" },
  { value: "lease_takeover", label: "Lease takeover" },
  { value: "room_in_shared", label: "Room in shared apartment" },
  { value: "entire_unit", label: "Entire unit" },
] as const;

const roomTypeOptions = [
  { value: "any", label: "Any room type" },
  { value: "private_room", label: "Private room" },
  { value: "shared_room", label: "Shared room" },
  { value: "entire_place", label: "Entire place" },
] as const;

const leaseTermOptions = [
  { value: "any", label: "Any length" },
  { value: "summer", label: "Summer only" },
  { value: "semester", label: "Semester" },
  { value: "month_to_month", label: "Month-to-month" },
  { value: "three_plus", label: "3+ months" },
] as const;

const moveInOptions = [
  { value: "any", label: "Any time" },
  { value: "now", label: "Available now" },
  { value: "two_weeks", label: "Within 2 weeks" },
  { value: "next_month", label: "Next month" },
] as const;

const commuteOptions = [
  {
    value: residenceCardDTOCommuteBucketEnum.WALK_5,
    label: "5 min walk",
  },
  {
    value: residenceCardDTOCommuteBucketEnum.WALK_10,
    label: "10 min walk",
  },
  {
    value: residenceCardDTOCommuteBucketEnum.WALK_15,
    label: "15 min walk",
  },
  {
    value: residenceCardDTOCommuteBucketEnum.WALK_20,
    label: "20 min walk",
  },
  {
    value: residenceCardDTOCommuteBucketEnum.DRIVE,
    label: "Short drive",
  },
] as const;

const Toggle = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={[
      "rounded-2xl border px-3 py-3 text-left text-sm transition",
      active
        ? "border-neutral-900 bg-neutral-900 text-white shadow-sm"
        : "border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
    ].join(" ")}
  >
    {label}
  </button>
);

const Pill = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={[
      "rounded-full border px-4 py-2.5 text-sm transition",
      active
        ? "border-neutral-900 bg-neutral-900 text-white"
        : "border-neutral-200 bg-white text-neutral-800 hover:bg-neutral-50",
    ].join(" ")}
  >
    {label}
  </button>
);

const SectionCard = ({
  active,
  icon,
  title,
  subtitle,
  summary,
  onClick,
  children,
}: {
  active: boolean;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  summary?: string;
  onClick: () => void;
  children: React.ReactNode;
}) => (
  <section
    className={[
      "overflow-hidden rounded-[30px] border bg-white transition-all duration-300",
      active
        ? "border-neutral-900 shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        : "border-neutral-200 shadow-[0_8px_30px_rgba(0,0,0,0.04)]",
    ].join(" ")}
  >
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-700">
          {icon}
        </div>
        <div>
          <div className="text-xl font-semibold text-neutral-950">{title}</div>
          <div className="mt-1 text-sm text-neutral-500">{subtitle}</div>
          {!active && summary ? (
            <div className="mt-2 text-sm font-medium text-neutral-800">
              {summary}
            </div>
          ) : null}
        </div>
      </div>
      <ChevronRight
        className={[
          "h-5 w-5 shrink-0 text-neutral-400 transition-transform",
          active ? "rotate-90" : "",
        ].join(" ")}
      />
    </button>

    <div
      className={[
        "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
        active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
      ].join(" ")}
    >
      <div className="overflow-hidden border-t border-neutral-100">
        <div className="px-5 pb-5 pt-4">{children}</div>
      </div>
    </div>
  </section>
);

const FilterBlock = ({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-[26px] border border-neutral-200 bg-white p-4">
    <p className="font-semibold text-neutral-900">{title}</p>
    <p className="mt-1 text-sm text-neutral-500">{description}</p>
    <div className="mt-4 flex flex-wrap gap-2">{children}</div>
  </div>
);

const WhereItem = ({
  campus,
  city,
  active,
  onPick,
}: {
  campus: string;
  city: string;
  active: boolean;
  onPick: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={onPick}
      className={[
        "group relative overflow-hidden rounded-[20px] border px-3 py-3 text-left transition",
        active
          ? "border-neutral-900 bg-neutral-900 text-white shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
          : "border-neutral-200 bg-white hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)]",
      ].join(" ")}
    >
      <div className="relative flex items-center gap-3">
        <div className="rounded-xl bg-white/90 p-2.5 text-neutral-900 shadow-sm">
          <GraduationCap className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold">{campus}</div>
          <div
            className={[
              "mt-0.5 truncate text-xs",
              active ? "text-white/75" : "text-neutral-500",
            ].join(" ")}
          >
            {city}
          </div>
          <div
            className={[
              "mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium",
              active ? "text-white" : "text-neutral-800",
            ].join(" ")}
          >
            <MapPin className="h-3.5 w-3.5" />
            Search this campus
          </div>
        </div>
        {active ? (
          <div className="rounded-full border border-white/20 px-2.5 py-1 text-[11px] font-medium text-white/80">
            Selected
          </div>
        ) : (
          <ChevronRight className="h-4 w-4 text-neutral-400" />
        )}
      </div>
    </button>
  );
};

const GuidedSearch = ({
  setOpenSearch,
  onApply,
}: {
  setOpenSearch: (open: boolean) => void;
  onApply: (filters: AppliedCribSearch) => void;
}) => {
  const {
    data: tagsData,
    isLoading: isLoadingTags,
    isError: isTagsError,
  } = useGetPostTags({});

  const [filters, setFilters] = useState({
    campus: "",
    locationQuery: "",
    minPrice: 500,
    maxPrice: 1500,
    listingType: "sublease",
    roomType: "any",
    leaseTerm: "any",
    moveInWindow: "any",
    commuteBucket: "" as "" | (typeof commuteOptions)[number]["value"],
    roommates: 0 as 0 | 1 | 2 | 3,
  });
  const [filterValues, setFilterValues] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState<"where" | "when" | "filter">("where");
  const { control, watch, reset } = useForm({
    defaultValues: {
      beginDate: "",
      endDate: "",
    },
  });

  const tagOptions = tagsData?.data ?? [];
  const beginDate = watch("beginDate");
  const endDate = watch("endDate");
  const selectedTagCount = Object.keys(filterValues).filter(
    (key) => key.startsWith("tag:") && filterValues[key],
  ).length;
  const selectedFilterCount = Object.keys(filterValues).filter(
    (key) => !key.startsWith("tag:") && filterValues[key],
  ).length;

  const whereSummary = useMemo(() => {
    if (filters.campus) return filters.campus;
    if (filters.locationQuery.trim()) return filters.locationQuery.trim();
    return "Choose a campus or area";
  }, [filters.campus, filters.locationQuery]);

  const whenSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.moveInWindow !== "any") {
      parts.push(
        moveInOptions.find((option) => option.value === filters.moveInWindow)
          ?.label ?? "Custom timing",
      );
    }
    if (filters.leaseTerm !== "any") {
      parts.push(
        leaseTermOptions.find((option) => option.value === filters.leaseTerm)
          ?.label ?? "Flexible term",
      );
    }
    return parts.length > 0 ? parts.join(" · ") : "Set timing and lease term";
  }, [filters.leaseTerm, filters.moveInWindow]);

  const filterSummary = useMemo(() => {
    const parts: string[] = [];
    if (filters.listingType !== "sublease") {
      parts.push(
        listingTypeOptions.find((option) => option.value === filters.listingType)
          ?.label ?? "Listing type",
      );
    }
    if (filters.roomType !== "any") {
      parts.push(
        roomTypeOptions.find((option) => option.value === filters.roomType)
          ?.label ?? "Room type",
      );
    }
    if (selectedTagCount > 0) parts.push(`${selectedTagCount} tags`);
    if (selectedFilterCount > 0) parts.push(`${selectedFilterCount} extras`);
    return parts.length > 0
      ? parts.join(" · ")
      : "Price, room setup, tags, amenities";
  }, [
    filters.listingType,
    filters.roomType,
    selectedFilterCount,
    selectedTagCount,
  ]);

  const resetFilters = () => {
    setFilters({
      campus: "",
      locationQuery: "",
      minPrice: 500,
      maxPrice: 1500,
      listingType: "sublease",
      roomType: "any",
      leaseTerm: "any",
      moveInWindow: "any",
      commuteBucket: "",
      roommates: 0,
    });
    setFilterValues({});
    reset({
      beginDate: "",
      endDate: "",
    });
  };

  const appliedSearch: AppliedCribSearch = useMemo(
    () => ({
      campus: filters.campus,
      locationQuery: filters.locationQuery,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      listingType: filters.listingType,
      roomType: filters.roomType,
      leaseTerm: filters.leaseTerm,
      moveInWindow: filters.moveInWindow,
      beginDate,
      endDate,
      commuteBucket: filters.commuteBucket,
      roommates: filters.roommates,
      tagIds: tagOptions
        .filter((tag) => filterValues[`tag:${tag.id}`])
        .map((tag) => tag.id),
      tagNames: tagOptions
        .filter((tag) => filterValues[`tag:${tag.id}`])
        .map((tag) => tag.name),
      filterKeys: Object.keys(filterValues).filter(
        (key) => !key.startsWith("tag:") && filterValues[key],
      ),
    }),
    [beginDate, endDate, filterValues, filters, tagOptions],
  );

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(22,22,22,0.55)] backdrop-blur-sm">
      <div className="mx-auto flex h-full w-full max-w-[760px] flex-col overflow-y-auto px-3 pb-8 pt-4 sm:px-5">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setOpenSearch(false)}
            className="rounded-full bg-white p-2 text-neutral-700 shadow-sm"
          >
            <X size={22} />
          </button>

          <div className="rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm">
            Guided search
          </div>
        </div>

        <div className="rounded-[34px] bg-[#f7f4ef] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.12)] sm:p-5">
          <div className="mb-4 rounded-[24px] border border-neutral-200 bg-white p-4 sm:p-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
              <Sparkles className="h-3.5 w-3.5" />
              Student sublets
            </div>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-[28px]">
              Find the right sublease faster.
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-600">
              Pick a campus, set your timing, then refine the details that matter.
            </p>
          </div>

          <div className="space-y-4">
            <SectionCard
              active={active === "where"}
              icon={<MapPin className="h-5 w-5" />}
              title="Where"
              subtitle="Search by campus or area"
              summary={whereSummary}
              onClick={() => setActive("where")}
            >
              <div className="space-y-5">
                <div className="rounded-[26px] border border-neutral-200 bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-3 rounded-[20px] border border-neutral-200 bg-neutral-50 px-4 py-3">
                    <Search className="h-4 w-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search for a campus or neighborhood"
                      value={filters.locationQuery}
                      onChange={(e) =>
                        setFilters((current) => ({
                          ...current,
                          locationQuery: e.target.value,
                        }))
                      }
                      className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-neutral-900">
                        Popular campuses
                      </div>
                      <div className="mt-1 text-sm text-neutral-500">
                        Pick a school to anchor your search.
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {FEATURED_CAMPUSES.map((campus) => (
                      <WhereItem
                        key={campus.name}
                        campus={campus.name}
                        city={campus.city}
                        active={filters.campus === campus.name}
                        onPick={() => {
                          setFilters((current) => ({
                            ...current,
                            campus: campus.name,
                            locationQuery: campus.name,
                          }));
                          setActive("when");
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard
              active={active === "when"}
              icon={<CalendarRange className="h-5 w-5" />}
              title="When"
              subtitle="Choose your window and lease length"
              summary={whenSummary}
              onClick={() => setActive("when")}
            >
              <div className="space-y-5">
                <div className="grid gap-4 rounded-[26px] border border-neutral-200 bg-white p-4 sm:grid-cols-2">
                  <Controller
                    name="beginDate"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>Begin Date</Label>
                        <Input
                          type="date"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  />

                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    )}
                  />
                </div>

                <FilterBlock
                  title="Move-in timing"
                  description="Quick ways to describe your availability."
                >
                  {moveInOptions.map((option) => (
                    <Pill
                      key={option.value}
                      label={option.label}
                      active={filters.moveInWindow === option.value}
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          moveInWindow: option.value,
                        }))
                      }
                    />
                  ))}
                </FilterBlock>

                <FilterBlock
                  title="Lease term"
                  description="Focus on the kind of sublease duration you want."
                >
                  {leaseTermOptions.map((option) => (
                    <Pill
                      key={option.value}
                      label={option.label}
                      active={filters.leaseTerm === option.value}
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          leaseTerm: option.value,
                        }))
                      }
                    />
                  ))}
                </FilterBlock>
              </div>
            </SectionCard>

            <SectionCard
              active={active === "filter"}
              icon={<SlidersHorizontal className="h-5 w-5" />}
              title="Filters"
              subtitle="Refine by price, setup, and amenities"
              summary={filterSummary}
              onClick={() => setActive("filter")}
            >
              <div className="space-y-4">
                <div className="rounded-[26px] border border-neutral-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-neutral-900">Price</p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Monthly budget range
                      </p>
                    </div>
                    <div className="rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-700">
                      ${filters.minPrice} - ${filters.maxPrice}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                        Min
                      </label>
                      <input
                        title="minPrice"
                        type="range"
                        min={0}
                        max={4000}
                        step={50}
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters((current) => ({
                            ...current,
                            minPrice: Math.min(
                              Number(e.target.value),
                              current.maxPrice,
                            ),
                          }))
                        }
                        className="mt-3 w-full"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
                        Max
                      </label>
                      <input
                        title="maxPrice"
                        type="range"
                        min={0}
                        max={4000}
                        step={50}
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters((current) => ({
                            ...current,
                            maxPrice: Math.max(
                              Number(e.target.value),
                              current.minPrice,
                            ),
                          }))
                        }
                        className="mt-3 w-full"
                      />
                    </div>
                  </div>
                </div>

                <FilterBlock
                  title="Listing type"
                  description="Choose the kind of housing handoff you want."
                >
                  {listingTypeOptions.map((option) => (
                    <Pill
                      key={option.value}
                      label={option.label}
                      active={filters.listingType === option.value}
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          listingType: option.value,
                        }))
                      }
                    />
                  ))}
                </FilterBlock>

                <FilterBlock
                  title="Distance from campus"
                  description="Use your same commute buckets from cribs."
                >
                  <Pill
                    label="Any distance"
                    active={filters.commuteBucket === ""}
                    onClick={() =>
                      setFilters((current) => ({
                        ...current,
                        commuteBucket: "",
                      }))
                    }
                  />
                  {commuteOptions.map((option) => (
                    <Pill
                      key={option.value}
                      label={option.label}
                      active={filters.commuteBucket === option.value}
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          commuteBucket: option.value,
                        }))
                      }
                    />
                  ))}
                </FilterBlock>

                <FilterBlock
                  title="Room type"
                  description="Private room, shared room, or entire place."
                >
                  {roomTypeOptions.map((option) => (
                    <Pill
                      key={option.value}
                      label={option.label}
                      active={filters.roomType === option.value}
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          roomType: option.value,
                        }))
                      }
                    />
                  ))}
                </FilterBlock>

                <FilterBlock
                  title="Roommates"
                  description="Maximum roommates you're comfortable with."
                >
                  {[
                    { label: "Any", value: 0 },
                    { label: "1", value: 1 },
                    { label: "2", value: 2 },
                    { label: "3+", value: 3 },
                  ].map((roommate) => (
                    <Pill
                      key={roommate.value}
                      label={roommate.label}
                      active={filters.roommates === roommate.value}
                      onClick={() =>
                        setFilters((current) => ({
                          ...current,
                          roommates: roommate.value as 0 | 1 | 2 | 3,
                        }))
                      }
                    />
                  ))}
                </FilterBlock>

                <div className="rounded-[26px] border border-neutral-200 bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-neutral-900">Popular tags</p>
                      <p className="mt-1 text-sm text-neutral-500">
                        Live tags pulled from current listings.
                      </p>
                    </div>
                    <div className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
                      {selectedTagCount} selected
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {isLoadingTags ? (
                      <div className="col-span-2 text-sm text-neutral-500">
                        Loading tags...
                      </div>
                    ) : isTagsError ? (
                      <div className="col-span-2 text-sm text-neutral-500">
                        Unable to load tags right now.
                      </div>
                    ) : (
                      tagOptions.map((tag) => (
                        <Toggle
                          key={tag.id}
                          label={tag.name}
                          active={!!filterValues[`tag:${tag.id}`]}
                          onClick={() =>
                            setFilterValues((current) => ({
                              ...current,
                              [`tag:${tag.id}`]: !current[`tag:${tag.id}`],
                            }))
                          }
                        />
                      ))
                    )}
                  </div>
                </div>

                {FILTER_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-[26px] border border-neutral-200 bg-white p-4"
                  >
                    <p className="font-semibold text-neutral-900">
                      {category.label}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      Fine-tune the experience for this search.
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {category.items.map((item) => (
                        <Toggle
                          key={item.key}
                          label={item.label}
                          active={!!filterValues[item.key]}
                          onClick={() =>
                            setFilterValues((current) => ({
                              ...current,
                              [item.key]: !current[item.key],
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          <div className="mt-5 rounded-[28px] border border-neutral-200 bg-white px-4 py-4 shadow-sm sm:px-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-neutral-100 p-3 text-neutral-700">
                  <Bus className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-neutral-900">
                    Do not want to miss the right listing?
                  </div>
                  <div className="mt-1 text-sm text-neutral-500">
                    Save your filters and get reminded when a match shows up.
                  </div>
                </div>
              </div>

              <button
                type="button"
                className="rounded-full border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-900 hover:bg-neutral-50"
              >
                Set reminder
              </button>
            </div>
          </div>

          <div className="sticky bottom-3 mt-5">
            <div className="flex gap-2 rounded-[26px] border border-neutral-200 bg-white p-3 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  resetFilters();
                }}
                className="flex-1 rounded-2xl border border-neutral-200 px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onApply(appliedSearch);
                  setOpenSearch(false);
                }}
                className="flex-1 rounded-2xl bg-neutral-950 px-4 py-3 text-sm font-semibold text-white hover:bg-neutral-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidedSearch;
