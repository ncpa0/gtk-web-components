export class CustomMouseEvent<N extends string, T> extends CustomEvent<T> {
  declare readonly type: N;

  readonly altKey: boolean;
  readonly button: number;
  readonly buttons: number;
  readonly clientX: number;
  readonly clientY: number;
  readonly ctrlKey: boolean;
  readonly metaKey: boolean;
  readonly movementX: number;
  readonly movementY: number;
  readonly offsetX: number;
  readonly offsetY: number;
  readonly pageX: number;
  readonly pageY: number;
  readonly relatedTarget: EventTarget | null;
  readonly screenX: number;
  readonly screenY: number;
  readonly shiftKey: boolean;
  readonly x: number;
  readonly y: number;
  getModifierState: (keyArg: string) => boolean;

  constructor(name: N, detail: T, base: MouseEvent) {
    super(name, {
      detail,
      bubbles: true,
      cancelable: true,
    });

    this.clientX = base.clientX;
    this.clientY = base.clientY;
    this.screenX = base.screenX;
    this.screenY = base.screenY;
    this.button = base.button;
    this.buttons = base.buttons;
    this.ctrlKey = base.ctrlKey;
    this.altKey = base.altKey;
    this.shiftKey = base.shiftKey;
    this.metaKey = base.metaKey;
    this.relatedTarget = base.relatedTarget;
    this.movementX = base.movementX;
    this.movementY = base.movementY;
    this.offsetX = base.offsetX;
    this.offsetY = base.offsetY;
    this.pageX = base.pageX;
    this.pageY = base.pageY;
    this.x = base.x;
    this.y = base.y;
    this.getModifierState = (key) => base.getModifierState(key);
  }
}

export class CustomKeyboardEvent<N extends string, T> extends CustomEvent<T> {
  declare readonly type: N;

  readonly altKey: boolean;
  readonly charCode: number;
  readonly code: string;
  readonly ctrlKey: boolean;
  readonly isComposing: boolean;
  readonly key: string;
  readonly keyCode: number;
  readonly location: number;
  readonly metaKey: boolean;
  readonly repeat: boolean;
  readonly shiftKey: boolean;
  getModifierState: (keyArg: string) => boolean;

  constructor(name: N, detail: T, base: KeyboardEvent) {
    super(name, {
      detail,
      bubbles: true,
      cancelable: true,
    });

    this.altKey = base.altKey;
    this.charCode = base.charCode;
    this.code = base.code;
    this.ctrlKey = base.ctrlKey;
    this.isComposing = base.isComposing;
    this.key = base.key;
    this.keyCode = base.keyCode;
    this.location = base.location;
    this.metaKey = base.metaKey;
    this.repeat = base.repeat;
    this.shiftKey = base.shiftKey;
    this.getModifierState = (key) => base.getModifierState(key);
  }
}

export class CustomPointerEvent<N extends string, T> extends CustomEvent<T> {
  declare readonly type: N;

  readonly height: number;
  readonly isPrimary: boolean;
  readonly pointerId: number;
  readonly pointerType: string;
  readonly pressure: number;
  readonly tangentialPressure: number;
  readonly tiltX: number;
  readonly tiltY: number;
  readonly twist: number;
  readonly width: number;
  getCoalescedEvents: () => PointerEvent[];
  getPredictedEvents: () => PointerEvent[];

  constructor(name: N, detail: T, base: PointerEvent) {
    super(name, {
      detail,
      bubbles: true,
      cancelable: true,
    });

    this.height = base.height;
    this.isPrimary = base.isPrimary;
    this.pointerId = base.pointerId;
    this.pointerType = base.pointerType;
    this.pressure = base.pressure;
    this.tangentialPressure = base.tangentialPressure;
    this.tiltX = base.tiltX;
    this.tiltY = base.tiltY;
    this.twist = base.twist;
    this.width = base.width;
    this.getCoalescedEvents = () => base.getCoalescedEvents();
    this.getPredictedEvents = () => base.getPredictedEvents();
  }
}
