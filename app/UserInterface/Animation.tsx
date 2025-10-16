import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import Lottie, { type LottieRefCurrentProps } from "lottie-react";
import { makeCard, type Card } from "../game/types/Card";
import { useEffect, useRef, useState } from "react";
import { uiBus, type PlayerEffect, type PlayerEffectPayload } from '~/UIBus';


type Props = {
  
  play: boolean;
  
  src?: string; // defaults to "/ErrorRobot.json"
};

export default function TriggerFn({ play, src = "/ErrorRobot.json" }: Props) {
  const [data, setData] = useState<any | null>(null);
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const prevPlay = useRef<boolean>(play);

  // Load the Lottie JSON once
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch(src);
        const json = await r.json();
        if (alive) setData(json);
      } catch (e) {
        console.error("Failed to load Lottie JSON:", e);
      }
    })();
    return () => {
      alive = false;
    };
  }, [src]);

  // Ensure static first frame on initial load
  useEffect(() => {
    if (!data) return;
    // Snap to frame 0 so it looks idle on mount
    lottieRef.current?.stop?.();
    lottieRef.current?.goToAndStop?.(0, true);
  }, [data]);

  // Drive animation on false -> true edges only
  useEffect(() => {
    if (!data) return;

    const was = prevPlay.current;
    const now = play;

    // Trigger when toggled from false to true
    if (!was && now) {
      lottieRef.current?.stop?.();
      lottieRef.current?.goToAndStop?.(0, true);
      lottieRef.current?.play?.();
    }

    // Optional: when going true -> false, freeze at first frame (reset)
    if (was && !now) {
      lottieRef.current?.stop?.();
      lottieRef.current?.goToAndStop?.(0, true);
    }

    prevPlay.current = now;
  }, [play, data]);

  if (!data) return null;

  return (
    <div className="w-48 h-48 flex items-start justify-center">
    <Lottie
      lottieRef={lottieRef}
      animationData={data}
      loop={false}
      autoplay={false} // critical: never autoplay; we control it via ref
      style={{ width: 150, height: 150 }}
    />
    </div>
  );
}

//makes the text look typed out instead of looking static
function Typewriter({ text, speed = 35, onDone }: { text: string; speed?: number; onDone?: () => void }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i >= text.length) { onDone?.(); return; }
    const t = setTimeout(() => setI(i + 1), speed);
    return () => clearTimeout(t);
  }, [i, text, speed, onDone]);
  return <>{text.slice(0, i)}</>;
}

//styles the text bubble on the AI player- need to edit eventually
function SpeechBubble({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative max-w-[16rem] rounded-2xl bg-white/95 px-4 py-2 text-sm scale-80 shadow-md ring-1 ring-black/5 
                 select-none focus:outline-none pointer-events-none ml-4"
      tabIndex={-1}
    >
      <span className="absolute -left-2 top-4 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-white drop-shadow" />
      {children}
    </div>
  );
}

export function PlayerHeader({
  playerId,
  playerName,
}: {
  playerId: string;
  playerName: string;
}) {
  const [bubble, setBubble] = useState("");
  const [play, setPlay] = useState(false);   // <-- controls AppFn
  const hide = useRef<number | null>(null);
  const effectMessages: Record<PlayerEffect, string> = {
    skip: "Cut it out!",
    draw2: "That's too many!",
    wild: "Color chaos!",
    wildDraw4: "Four cards?!",
  };

  useEffect(() => {
    const handler = (e: Event) => {
      const { playerId: id, effect } = (e as CustomEvent<PlayerEffectPayload>).detail;
      if (id !== playerId) return;

      // show bubble
      setBubble(effectMessages[effect] ?? "That wasn't nice!");

      // trigger animation
      setPlay(true);

      // clear existing timeout, reset after 2s
      if (hide.current) window.clearTimeout(hide.current);
      hide.current = window.setTimeout(() => {
        setBubble("");
        setPlay(false); // reset to allow next event to trigger animation again
      }, 2000);
    };

    uiBus.addEventListener("playerEffect", handler);
    return () => {
      uiBus.removeEventListener("playerEffect", handler);
      if (hide.current) window.clearTimeout(hide.current);
    };
  }, [playerId]);

  return (
    <div className="flex items-start gap-6 scale-110 pl-8">
    {/* one robot */}
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
      {bubble && (
        <div className="absolute items-start top-1/2 left-[120%] -translate-y-1.7 z-20 pointer-events-none">
          <SpeechBubble>
            <Typewriter text={bubble} speed={35} />
          </SpeechBubble>
        </div>
      )}

      {/* the animation */}
      <TriggerFn play={play} />
    </div>

    {/* ...other siblings like your arrow, other robots, etc. */}
  </div>
  );
}
