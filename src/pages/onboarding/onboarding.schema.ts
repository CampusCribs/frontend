// schemas/onboarding.schema.ts
import { z } from "zod";

/** -----------------------------
 * Enums
 * ----------------------------- */
export const RoleSchema = z.enum(["STUDENT", "LANDLORD"]);
export type Role = z.infer<typeof RoleSchema>;

export const GoalSchema = z.enum(["FIND_HOUSING", "FIND_ROOMMATES"]);
export type Goal = z.infer<typeof GoalSchema>;

export const HeardFromSchema = z.enum([
  "TIKTOK",
  "INSTAGRAM",
  "GOOGLE",
  "FRIEND",
  "FLYER",
  "CAMPUS",
  "OTHER",
]);
export type HeardFrom = z.infer<typeof HeardFromSchema>;

/** -----------------------------
 * Address (exact house address)
 * ----------------------------- */
export const AddressSchema = z.object({
  line1: z.string().trim().min(1, "Street address is required"), // "123 Main St"
  line2: z.string().trim().optional().default(""), // "Apt 4B"
  city: z.string().trim().min(1, "City is required"),
  region: z.string().trim().min(1, "State/Region is required"), // "OH", "NRW"
  postalCode: z.string().trim().min(1, "Postal code is required"),
  country: z.string().trim().min(1, "Country is required"), // "US", "DE" or full name
  // Optional extras if you ever want to geocode / map:
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});
export type Address = z.infer<typeof AddressSchema>;

/** -----------------------------
 * Full onboarding schema
 * ----------------------------- */
export const OnboardingSchema = z
  .object({
    role: RoleSchema.nullable(),

    // shared basics
    fullName: z.string().trim().min(1, "Full name is required"),
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),

    // student-only basics
    birthday: z.string().trim().optional().default(""), // "YYYY-MM-DD"

    // landlord-only basics
    companyName: z.string().trim().optional().default(""),

    // student flow
    major: z.string().trim().optional().default(""),
    goal: GoalSchema.nullable(),

    // landlord flow
    campus: z.string().trim().optional().default(""),
    rooms: z.number().int().positive().nullable(),
    ein: z.string().trim().optional().default(""), // optional

    // exact address of the house (primarily landlord, but included in schema)
    address: AddressSchema.optional(),

    // marketing
    heardFrom: HeardFromSchema.nullable(),
    heardFromOther: z.string().trim().optional().default(""),
  })
  .superRefine((val, ctx) => {
    // role must be chosen by step 0
    if (val.role === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["role"],
        message: "Please choose a role",
      });
      return; // don’t cascade other requirements until role known
    }

    // marketing rule
    if (val.heardFrom === "OTHER" && !val.heardFromOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["heardFromOther"],
        message: "Please tell us where you heard about us",
      });
    }

    // student rules
    if (val.role === "STUDENT") {
      if (!val.birthday?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["birthday"],
          message: "Birthday is required",
        });
      }
      // basic ISO date shape check (still keep it simple)
      if (val.birthday?.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(val.birthday)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["birthday"],
          message: "Birthday must be in YYYY-MM-DD format",
        });
      }

      if (!val.major?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["major"],
          message: "Major is required",
        });
      }

      if (val.goal === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["goal"],
          message: "Please choose a goal",
        });
      }

      // optional: student should NOT provide landlord-only fields (keep optional, but you can enforce if you want)
      // if (val.companyName.trim()) { ... }
    }

    // landlord rules
    if (val.role === "LANDLORD") {
      if (!val.companyName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Company name is required",
        });
      }

      if (!val.campus?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["campus"],
          message: "Campus is required",
        });
      }

      if (val.rooms === null || val.rooms <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["rooms"],
          message: "Number of rooms is required",
        });
      }

      // address required for landlord (exact house address)
      if (!val.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Address is required",
        });
      } else {
        // AddressSchema already validates required fields, but we can add a helpful message target:
        const parsed = AddressSchema.safeParse(val.address);
        if (!parsed.success) {
          // bubble up field errors as-is
          parsed.error.issues.forEach((issue) => {
            ctx.addIssue({
              ...issue,
              path: ["address", ...issue.path],
            });
          });
        }
      }

      // EIN optional, but if provided make it “reasonable”
      if (val.ein?.trim() && !/^[0-9-]{6,12}$/.test(val.ein.trim())) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["ein"],
          message: "EIN looks invalid (use digits, optionally with a dash)",
        });
      }
    }
  });

export type OnboardingState = z.infer<typeof OnboardingSchema>;

/** -----------------------------
 * Step schemas (useful for step-by-step trigger)
 * These are “partial” validators; keep the full one for final submit.
 * ----------------------------- */
export const Step0_RoleSchema = z.object({
  role: RoleSchema.nullable().refine((v) => v !== null, "Choose a role"),
});

export const Step1_BasicsSchema = z
  .object({
    role: RoleSchema,
    fullName: OnboardingSchema.shape.fullName,
    username: OnboardingSchema.shape.username,
    birthday: OnboardingSchema.shape.birthday,
    companyName: OnboardingSchema.shape.companyName,
  })
  .superRefine((val, ctx) => {
    if (val.role === "STUDENT" && !val.birthday.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["birthday"],
        message: "Birthday is required",
      });
    }
    if (val.role === "LANDLORD" && !val.companyName.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyName"],
        message: "Company name is required",
      });
    }
  });

export const Step2_StudentMajorSchema = z.object({
  major: z.string().trim().min(1, "Major is required"),
});

export const Step3_MarketingSchema = z
  .object({
    heardFrom: HeardFromSchema.nullable(),
    heardFromOther: z.string().trim().optional().default(""),
  })
  .superRefine((val, ctx) => {
    if (val.heardFrom === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["heardFrom"],
        message: "Select an option",
      });
    }
    if (val.heardFrom === "OTHER" && !val.heardFromOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["heardFromOther"],
        message: "Please tell us where",
      });
    }
  });

export const Step4_StudentGoalSchema = z.object({
  goal: GoalSchema.nullable().refine((v) => v !== null, "Choose a goal"),
});

export const Step2_LandlordCampusSchema = z.object({
  campus: z.string().trim().min(1, "Campus is required"),
});

export const Step3_LandlordRoomsSchema = z.object({
  rooms: z
    .number()
    .int()
    .positive("Rooms must be a positive number")
    .nullable(),
});

export const Step5_LandlordVerifySchema = z.object({
  ein: z.string().trim().optional().default(""),
  address: AddressSchema, // enforce exact address on the verify step (or wherever you collect it)
});
