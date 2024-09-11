import { Switch } from "adwavecss";
import "../../index.css";
import { customElement } from "wc_toolkit";
import { CustomKeyboardEvent, CustomMouseEvent } from "../../utils/events";
import { stopEvent } from "../../utils/prevent-default";
import "./switch.css";

class SwitchChangeEvent extends Event {
  declare readonly type: "change";
  public readonly active: boolean;

  constructor(active: boolean) {
    super("change", {
      bubbles: true,
    });
    this.active = active;
  }
}

const { CustomElement: AdwSwitch } = customElement("adw-switch")
  .attributes({
    active: "boolean",
    disabled: "boolean",
    name: "string",
    form: "string",
  })
  .events(["change", "click", "keydown"])
  .context()
  .methods(self => {
    const { attribute: { active } } = self;

    return {
      toggle() {
        active.set(!active.get());
      },

      _handleClick(e: MouseEvent) {
        e.stopPropagation();
        const nextValue = !active.get();

        self
          .emitEvent(new CustomMouseEvent("click", { nextValue }, e))
          .onCommit(() => {
            active.set(nextValue);
          });
      },

      _handleKeyDown(e: KeyboardEvent) {
        e.stopPropagation();

        self
          .emitEvent(new CustomKeyboardEvent("keydown", {}, e))
          .onCommit(() => {
            if (e.key === " ") {
              const nextValue = !active.get();
              active.set(nextValue);
            }
          });
      },
    };
  })
  .connected((self) => {
    const { attribute, method } = self;
    const { active, disabled, form, name } = attribute;

    self.onChange([active], () => {
      self.emitEvent(
        new SwitchChangeEvent(!!active.get()),
      );
    });

    self.render(
      <div
        class={{
          [Switch.switch]: true,
          [Switch.disabled]: disabled.signal,
          [Switch.active]: active.signal,
        }}
        onclick={method._handleClick}
        onkeydown={method._handleKeyDown}
        tabIndex={0}
        role="switch"
        aria-checked={active.signal}
        aria-disabled={disabled.signal}
      >
        <div class={Switch.knob}></div>
        <input
          type="checkbox"
          class="_adw_hidden"
          disabled={disabled.signal}
          checked={active.signal}
          name={name.signal}
          attribute:form={form.signal}
          onclick={method._handleClick}
          onchange={stopEvent}
          aria-hidden="true"
        />
      </div>,
    );
  })
  .register();

export { AdwSwitch };
export type { SwitchChangeEvent };
