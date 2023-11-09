import { type User } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

export type OmitDynamicFields<T> = Omit<
  T,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "createdBy"
  | "updatedBy"
  | "createdById"
  | "updatedById"
  | "verifiedBy"
  | "verifiedById"
  | "verifiedAt"
  | "price"
> & {
  price: number | Decimal;
  id?: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  createdBy?: User | null;
  updatedBy?: User | null;
  createdById?: string | null;
  updatedById?: string | null;
  verifiedBy?: User | null;
  verifiedById?: string | null;
  verifiedAt?: Date | null;
};
