import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, School, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
    label: "Costs & bills",
    items: [
      { key: "utilities_included", label: "Utilities included" },
      { key: "internet_included", label: "Internet included" },
      { key: "electric_included", label: "Electric included" },
      {
        key: "low_deposit",
        label: "Low/no deposit",
        description: "Low or $0 security deposit",
      },
    ],
  },

  {
    id: "dates",
    label: "Dates & flexibility",
    items: [
      { key: "flexible_move_in", label: "Flexible move-in" },
      { key: "flexible_move_out", label: "Flexible move-out" },
      {
        key: "short_term_friendly",
        label: "Short-term sublease",
        description: "Good for summer/co-op (short duration OK)",
      },
    ],
  },

  {
    id: "furnishing",
    label: "Furnishing",
    items: [
      { key: "furnished", label: "Furnished" },
      { key: "bed_included", label: "Bed included" },
      { key: "desk_included", label: "Desk/workspace included" },
      {
        key: "kitchen_essentials",
        label: "Kitchen essentials included",
        description: "Basic cookware/dishes",
      },
    ],
  },

  {
    id: "laundry",
    label: "Laundry",
    items: [
      { key: "in_unit_laundry", label: "In-unit laundry" },
      { key: "in_building_laundry", label: "In-building laundry" },
    ],
  },

  {
    id: "kitchen",
    label: "Kitchen essentials",
    items: [
      { key: "dishwasher", label: "Dishwasher" },
      { key: "microwave", label: "Microwave included" },
    ],
  },

  {
    id: "transport",
    label: "Getting around",
    items: [
      { key: "walkable_to_campus", label: "Walkable to campus" },
      { key: "near_shuttle_or_bus", label: "Near shuttle/bus stop" },
      { key: "reserved_parking", label: "Reserved parking" },
      { key: "street_parking", label: "Free street parking" },
      { key: "bike_storage", label: "Bike storage" },
    ],
  },

  {
    id: "privacy",
    label: "Privacy",
    items: [
      { key: "private_bedroom", label: "Private bedroom" },
      { key: "private_bathroom", label: "Private bathroom" },
    ],
  },

  {
    id: "safety",
    label: "Safety & delivery",
    items: [
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
      { key: "guest_friendly", label: "Guest-friendly" },
    ],
  },
];

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
      "px-3 py-2 rounded-xl border text-sm text-left transition",
      active
        ? "bg-slate-900 text-white border-slate-900"
        : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
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
      e.stopPropagation(); // prevent section header click from re-firing weirdly
      onClick();
    }}
    className={[
      "px-3 py-2 rounded-2xl text-sm border transition",
      active
        ? "bg-slate-900 text-white border-slate-900"
        : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50",
    ].join(" ")}
  >
    {label}
  </button>
);

const GuidedSearch = ({
  setOpenSearch,
}: {
  setOpenSearch: (open: boolean) => void;
}) => {
  const [filters, setFilters] = useState({
    minPrice: 500,
    maxPrice: 1500,
    beds: 1 as 0 | 1 | 2 | 3 | 4,
    baths: 1 as 0 | 1 | 2 | 3,
    roommates: 0 as 0 | 1 | 2 | 3,
    furnished: false,
    petsOk: false,
    parking: false,
    inUnitLaundry: false,
  });

  const [filterValues, setFilterValues] = useState<Record<string, boolean>>({});

  const resetFilters = () =>
    setFilters({
      minPrice: 500,
      maxPrice: 1500,
      beds: 1,
      baths: 1,
      roommates: 0,
      furnished: false,
      petsOk: false,
      parking: false,
      inUnitLaundry: false,
    });

  // --- component helper ---
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      roommates: 0,
      beginDate: new Date(),
      endDate: new Date(),
      tags: [],
    },
  });

  const [active, setActive] = useState<"filter" | "where" | "when">("where");
  const [whereFocus, setWhereFocus] = useState<boolean>(false);
  const [whenFocus, setWhenFocus] = useState<boolean>(false);

  const handleChange = (
    active: "where" | "when" | "filter",
    focus: boolean,
  ) => {
    setActive(active);
    setWhereFocus(focus);
  };

  useEffect(() => {
    console.log("whereFocus changed:", whereFocus, active);
  }, [whereFocus, active]);

  return (
    <div className="fixed inset-0 z-50 w-full h-full bg-black/50 flex items-center justify-center ">
      <div className=" z-50 w-full h-full max-w-[600px] flex flex-col overflow-scroll ">
        <div className="flex justify-end cursor-pointer p-1 ">
          <div
            className="bg-white rounded-full p-1"
            onClick={() => setOpenSearch(false)}
          >
            <X size={24} />
          </div>
        </div>

        {/* Where Section */}
        <div
          className={`flex bg-white  rounded-2xl p-4 shadow-lg flex-col transition-transform duration-200  ${whereFocus ? " rounded-none fixed h-screen w-full transition-transform duration-200 " : " mx-3 mt-3"}`}
        >
          <div
            className="flex justify-between"
            onClick={() => setActive("where")}
          >
            <h1 className="text-2xl font-bold">Where</h1>{" "}
            {whereFocus == true && (
              <button title="close" onClick={() => setWhereFocus(false)}>
                <ArrowLeft size={32} />
              </button>
            )}
          </div>
          <p
            className="text-sm text-slate-600 mt-1"
            onClick={() => setActive("where")}
          >
            Search by campus or location
          </p>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
      ${active === "where" ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"}
    `}
          >
            <div className="flex items-center border rounded-2xl p-2 mt-3">
              <Search />{" "}
              <input
                type="text"
                placeholder="Search for a campus or location"
                className=" px-2 py-1 w-full"
                onFocus={() => setWhereFocus(true)}
              />
            </div>
            <div className="mt-2">suggested Campuses</div>
            <div className="flex flex-col space-y-2">
              {Array.from(["UCLA", "UCSD", "UC Berkeley", "UCI"]).map(
                (campus) => (
                  <WhereItem
                    key={campus}
                    campus={campus}
                    onPick={() => handleChange("when", false)}
                  />
                ),
              )}
            </div>
          </div>
        </div>

        {/* When Section */}
        <div className="flex bg-white mx-3 mt-3 rounded-2xl p-4 shadow-lg flex-col transition-transform duration-200">
          <div
            className="flex flex-col justify-between"
            onClick={() => setActive("when")}
          >
            <h1 className="text-2xl font-bold">When</h1>

            <p className="text-sm text-slate-600 mt-1">
              Select your desired move-in and move-out dates
            </p>
          </div>
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
      ${active === "when" ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"}
    `}
          >
            <div
              className="flex flex-col  gap-y-10 pb-10"
              onFocus={() => setWhenFocus(true)}
            >
              <Controller
                name="beginDate"
                control={control}
                render={({ field }) => (
                  <div>
                    <Label>Begin Date</Label>
                    <Input
                      type="date"
                      onChange={(e) => field.onChange(e.target.value)}
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
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </div>
                )}
              />
            </div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="flex bg-white mx-3 mt-3 rounded-2xl p-4 shadow-lg flex-col  mb-3">
          {/* header only is clickable */}
          <div
            className="cursor-pointer select-none"
            onClick={() => setActive("filter")}
          >
            <h1 className="text-2xl font-bold">Filters</h1>
            <p className="text-sm text-slate-600 mt-1">
              Refine results by price, amenities, and more
            </p>
          </div>

          {/* animated body */}
          <div
            className={[
              "grid transition-[grid-template-rows,opacity] duration-300 ease-in-out",
              active === "filter"
                ? "grid-rows-[1fr] opacity-100 mt-3"
                : "grid-rows-[0fr] opacity-0",
            ].join(" ")}
          >
            <div className="overflow-hidden">
              <div
                className="flex flex-col gap-4"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Price */}
                <div className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-slate-900">Price</p>
                    <p className="text-sm text-slate-600">
                      ${filters.minPrice} - ${filters.maxPrice}
                    </p>
                  </div>

                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="text-xs text-slate-500">Min</label>
                      <input
                        title="minPrice"
                        type="range"
                        min={0}
                        max={4000}
                        step={50}
                        value={filters.minPrice}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            minPrice: Math.min(
                              Number(e.target.value),
                              f.maxPrice,
                            ),
                          }))
                        }
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-slate-500">Max</label>
                      <input
                        title="maxPrice"
                        type="range"
                        min={0}
                        max={4000}
                        step={50}
                        value={filters.maxPrice}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            maxPrice: Math.max(
                              Number(e.target.value),
                              f.minPrice,
                            ),
                          }))
                        }
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Roommates */}
                <div className="rounded-2xl border border-slate-200 p-4">
                  <p className="font-semibold text-slate-900">Roommates</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Max roommates you're okay with
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {[
                      { label: "Any", value: 0 },
                      { label: "1", value: 1 },
                      { label: "2", value: 2 },
                      { label: "3+", value: 3 },
                    ].map((r) => (
                      <Pill
                        key={r.value}
                        label={r.label}
                        active={filters.roommates === r.value}
                        onClick={() =>
                          setFilters((f) => ({
                            ...f,
                            roommates: r.value as any,
                          }))
                        }
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {FILTER_CATEGORIES.map((category) => (
                    <div
                      key={category.id}
                      className="rounded-2xl border border-slate-200 p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {category.label}
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        {category.items.map((item) => (
                          <Toggle
                            key={item.key}
                            label={item.label}
                            active={!!filterValues[item.key]}
                            onClick={() =>
                              setFilterValues((v) => ({
                                ...v,
                                [item.key]: !v[item.key],
                              }))
                            }
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-2 bg-white px-5 py-2 mx-3 rounded-2xl mb-20">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              resetFilters();
            }}
            className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50"
          >
            Reset
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              // Hook this into your search query / API call
              // e.g. onApply(filters)
              console.log("apply filters:", filters);
              setOpenSearch(false);
            }}
            className="flex-1 rounded-2xl bg-slate-900 text-white px-4 py-3 text-sm font-semibold hover:bg-slate-800"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const WhereItem = ({
  campus,
  onPick,
}: {
  campus: string;
  onPick: () => void;
}) => {
  return (
    <div
      className="p-2 hover:bg-gray-400 cursor-pointer flex items-center border rounded-xl"
      onClick={onPick}
    >
      <div>
        <School size={32} />
      </div>
      <div className="ml-5">{campus}</div>
    </div>
  );
};
export default GuidedSearch;
