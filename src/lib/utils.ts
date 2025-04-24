import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";
import {adjectives, animals, uniqueNamesGenerator} from "unique-names-generator";
import {encode} from "jose/base64url";
import {randomString} from "@/lib/client-utils";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function cloneSingleChild(
    children: React.ReactNode | React.ReactNode[],
    props?: Record<string, any>,
    key?: any,
) {
  return React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child) && React.Children.only(children)) {
      if (child.props.class) {
        // make sure we retain classnames of both passed props and child
        props ??= {};
        props.class = clsx(child.props.class, props.class);
        props.style = { ...child.props.style, ...props.style };
      }
      return React.cloneElement(child, { ...props, key });
    }
    return child;
  });
}

export function getRandomName() {
  const customConfig = {
    dictionaries: [adjectives, animals],
    separator: '_',
    length: 2,
  };
  return encode(uniqueNamesGenerator(customConfig)+'_'+randomString(5));
}
export function append<T>(appendant: KeyValue<T>): (target: KeyValue<T>) => KeyValue<T> {
  return (target) => ({ ...target, ...appendant });
}
export type KeyValue<T> = Record<string, T>;

