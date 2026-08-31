"use client";

import * as Icons from "@phosphor-icons/react";
import type { IconProps, Icon as IconType } from "@phosphor-icons/react";

const registry = Icons as unknown as Record<string, IconType>;

export function PhIcon({
  name,
  fill,
  ...props
}: { name: string; fill?: boolean } & IconProps) {
  const Cmp = registry[name];
  if (!Cmp) return null;
  return <Cmp weight={fill ? "fill" : props.weight} {...props} />;
}
