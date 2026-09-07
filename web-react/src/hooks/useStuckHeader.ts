import { useEffect, useState } from "react";

/** Sayfa 8 pikselden fazla kaydırıldığında true — header gölgesi için. */
export function useStuckHeader(): boolean {
  const [stuck, setStuck] = useState(
    () => typeof window !== "undefined" && window.scrollY > 8
  );

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return stuck;
}
