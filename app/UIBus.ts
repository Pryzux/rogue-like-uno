
export type PlayerEffect =
    | { kind: "skip"; }
    | { kind: "reverse"; }
    | { kind: "draw2"; count: 2 }
    | { kind: "draw4"; count: 4 }
    | { kind: "wild"; }
    | { kind: "uno"; }
    | { kind: "wilddraw4"; };



export interface PlayerEffectPayload {
  playerId: string;       
  effect: PlayerEffect;
}

class _UIBus extends EventTarget {
  emitPlayerEffect(detail: PlayerEffectPayload) {
    console.log("[UIBus] emit", detail);
    this.dispatchEvent(new CustomEvent<PlayerEffectPayload>("playerEffect", { detail }));
  }
}



export const uiBus = new _UIBus();