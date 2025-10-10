export type PlayerEffect = "skip" | "draw2";


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