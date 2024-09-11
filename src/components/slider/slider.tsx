import { Slider } from "adwavecss";
import "../../index.css";
import { CustomPointerEvent } from "../../utils/events";
import { changeWithStep, clamp, toPrecision } from "../../utils/math";
import { stopEvent } from "../../utils/prevent-default";
import "./slider.css";
import { sig } from "@ncpa0cpl/vanilla-jsx/signals";
import { customElement } from "wc_toolkit";

const preventDefault = (e: Event) => {
  e.preventDefault();
  return false;
};

class SliderChangeEvent extends Event {
  declare readonly type: "change";
  public readonly value: number;

  constructor(value: number) {
    super("change", {
      bubbles: true,
    });
    this.value = value;
  }
}

const { CustomElement: AdwSlider } = customElement("adw-slider")
  .attributes({
    value: "number",
    min: "number",
    max: "number",
    step: "number",
    precision: "number",
    disabled: "boolean",
    name: "string",
    form: "string",
  })
  .events(["pointerdown", "change"])
  .context(({ value, min, max }) => {
    const positions = sig.derive(
      value.signal,
      min.signal,
      max.signal,
      (value = 0, min = 0, max = 100) => {
        const percent = ((value - min) / (max - min)) * 100;

        return {
          progressRight: `${100 - percent}%`,
          thumbLeft: `calc(${percent}% - 0.3em)`,
        };
      },
    );

    return {
      isPressed: sig(false),
      positions,
    };
  })
  .methods((api) => {
    const {
      attribute: {
        min,
        max,
        value,
        disabled,
        precision,
        step,
      },
      context,
    } = api;

    const handlePointerEventUp = (event: PointerEvent) => {
      event.stopPropagation();
      context.isPressed.dispatch(false);
    };

    const handlePointerEventMove = (event: PointerEvent) => {
      event.stopPropagation();
      if (disabled.get()) return;

      if (context.isPressed.get()) {
        const minV = min.get() ?? 0;
        const maxV = max.get() ?? 100;

        const { left, width } = api.thisElement.getBoundingClientRect();
        const percent = (event.clientX - left) / width;
        const tmpValue = changeWithStep(
          value.get() ?? 0,
          toPrecision(
            minV + percent * (maxV - minV),
            precision.get() ?? 4,
          ),
          step.get() ?? 1,
        );

        methods.setValue(tmpValue);
      }
    };

    const methods = {
      setValue(newValue: number) {
        newValue = clamp(newValue, min.get() ?? 0, max.get() ?? 100);

        if (newValue === value.get()) return;

        value.set(newValue);
      },

      _handlePointerDown(event: PointerEvent) {
        event.stopPropagation();

        api.emitEvent(
          new CustomPointerEvent("pointerdown", {}, event),
        ).onCommit(() => {
          context.isPressed.dispatch(true);
          handlePointerEventMove(event);
        });
      },

      _handleKeyDown(event: KeyboardEvent) {
        if (disabled.get()) return;

        switch (event.key) {
          case "ArrowLeft":
            this.setValue((value.get() ?? 0) - (step.get() ?? 1));
            break;
          case "ArrowRight":
            this.setValue((value.get() ?? 0) + (step.get() ?? 1));
            break;
        }
      },

      _setupGlobalPointerListeners() {
        if (document) {
          window.addEventListener(
            "pointerup",
            handlePointerEventUp,
          );
          window.addEventListener(
            "pointermove",
            handlePointerEventMove,
          );
        }

        return () => {
          window.removeEventListener(
            "pointerup",
            handlePointerEventUp,
          );
          window.removeEventListener(
            "pointermove",
            handlePointerEventMove,
          );
        };
      },
    };

    return methods;
  })
  .connected((self) => {
    const {
      method,
      attribute: {
        disabled,
        min,
        max,
        value,
        form,
        step,
        name,
      },
    } = self;
    const cleanup = method._setupGlobalPointerListeners();

    self.onChange([value], () => {
      self.emitEvent(new SliderChangeEvent(value.get() ?? 0));
    });

    self.render(
      <div
        draggable={false}
        class={{
          [Slider.slider]: true,
          [Slider.disabled]: disabled.signal,
        }}
        onpointerdown={method._handlePointerDown}
        onpointermove={preventDefault}
        ondrag={preventDefault}
        onkeydown={method._handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuemin={min.signal}
        aria-valuemax={max.signal}
        aria-valuenow={value.signal}
        aria-disabled={disabled}
      >
        <div
          draggable={false}
          class={Slider.track}
          onpointermove={preventDefault}
          ondrag={preventDefault}
        >
        </div>
        <div
          draggable={false}
          class={Slider.progress}
          onpointermove={preventDefault}
          ondrag={preventDefault}
          style={{
            right: self.context.positions.derive(p => p.progressRight),
          }}
        >
        </div>
        <div
          draggable={false}
          class={Slider.thumb}
          onpointermove={preventDefault}
          ondrag={preventDefault}
          style={{
            left: self.context.positions.derive(p => p.thumbLeft),
          }}
        >
        </div>
        <input
          type="range"
          class="_adw_hidden"
          disabled={disabled.signal}
          name={name.signal}
          attribute:form={form.signal}
          min={min.signal.derive(String)}
          max={max.signal.derive(String)}
          step={step.signal.derive(String)}
          value={value.signal}
          onchange={stopEvent}
          aria-hidden="true"
        />
      </div>,
    );

    return () => {
      cleanup();
    };
  })
  .register();

export { AdwSlider };
export type { SliderChangeEvent };
