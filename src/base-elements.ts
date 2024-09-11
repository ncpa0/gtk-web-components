import { sig, Signal } from "@ncpa0cpl/vanilla-jsx/signals";
import { Element } from "jsxte-wc";
import { Attribute } from "wc_toolkit";

export type Dependency<T> = {
  getValue: () => T;
  name: string;
};

export abstract class BaseElement extends Element {
  getRootClassNames = undefined;
}

declare module "wc_toolkit" {
  class Attribute<K extends string, T> {
    public signal: Signal<T | undefined>;
  }
}

Attribute.extend(Attr => {
  return class AttributeWithSignal<K extends string, T> extends Attr<K, T> {
    signal = sig<T>();

    protected override onCreatedCallback(): void {
      this.onChange(value => {
        this.signal.dispatch(value ?? undefined);
      });
    }
  };
});
