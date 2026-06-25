"use client";

import { useEffect, useState } from "react";

/**
 * Returns true when the element is near or inside the viewport.
 * Used to mount/pause heavy 3D scenes and animations.
 */
export function useSectionVisible(
  rootMargin = "80% 0px",
  initialVisible = false,
) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [visible, setVisible] = useState(initialVisible);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin, threshold: 0 },
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, rootMargin]);

  return { setRef, visible };
}
