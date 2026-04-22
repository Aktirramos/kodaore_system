import { describe, expect, it } from "vitest";
import {
  fadeUp,
  fadeUpTransition,
  staggerChildren,
  modalIn,
  modalInTransition,
  modalOutTransition,
  toastIn,
  toastInTransition,
  routeTransition,
  MOTION_DURATION,
  MOTION_EASE,
  MOTION_DISTANCE,
} from "../../components/motion";

describe("motion tokens", () => {
  it("expone las 5 duraciones en segundos", () => {
    expect(MOTION_DURATION.instant).toBe(0);
    expect(MOTION_DURATION.fast).toBe(0.12);
    expect(MOTION_DURATION.base).toBe(0.2);
    expect(MOTION_DURATION.slow).toBe(0.32);
    expect(MOTION_DURATION.hero).toBe(0.6);
  });

  it("expone las 4 curvas como tuplas de 4 números", () => {
    expect(MOTION_EASE.standard).toHaveLength(4);
    expect(MOTION_EASE.enter).toHaveLength(4);
    expect(MOTION_EASE.exit).toHaveLength(4);
    expect(MOTION_EASE.emphasis).toHaveLength(4);
  });

  it("expone las 3 distancias en px", () => {
    expect(MOTION_DISTANCE.sm).toBe(4);
    expect(MOTION_DISTANCE.md).toBe(8);
    expect(MOTION_DISTANCE.lg).toBe(16);
  });
});

describe("fadeUp", () => {
  it("hidden comienza con opacity 0 y rise de distance.sm", () => {
    expect(fadeUp.hidden).toEqual({ opacity: 0, y: MOTION_DISTANCE.sm });
  });
  it("visible termina con opacity 1 y y 0", () => {
    expect(fadeUp.visible).toEqual({ opacity: 1, y: 0 });
  });
  it("transition usa duration.base y ease.enter", () => {
    expect(fadeUpTransition.duration).toBe(MOTION_DURATION.base);
    expect(fadeUpTransition.ease).toEqual(MOTION_EASE.enter);
  });
});

describe("staggerChildren", () => {
  it("visible dispara stagger de 30ms entre hijos", () => {
    const visible = staggerChildren.visible as { transition?: { staggerChildren?: number } };
    expect(visible.transition?.staggerChildren).toBe(0.03);
  });
});

describe("modalIn", () => {
  it("hidden scale 0.96 + opacity 0", () => {
    expect(modalIn.hidden).toEqual({ opacity: 0, scale: 0.96 });
  });
  it("visible scale 1 + opacity 1", () => {
    expect(modalIn.visible).toEqual({ opacity: 1, scale: 1 });
  });
  it("in transition usa duration.slow y ease.enter", () => {
    expect(modalInTransition.duration).toBe(MOTION_DURATION.slow);
    expect(modalInTransition.ease).toEqual(MOTION_EASE.enter);
  });
  it("out transition es más corta y usa ease.exit", () => {
    expect(modalOutTransition.duration).toBe(0.18);
    expect(modalOutTransition.ease).toEqual(MOTION_EASE.exit);
  });
});

describe("toastIn", () => {
  it("hidden y de distance.md (slide-up)", () => {
    expect(toastIn.hidden).toEqual({ opacity: 0, y: MOTION_DISTANCE.md });
  });
  it("transition usa duration.slow", () => {
    expect(toastInTransition.duration).toBe(MOTION_DURATION.slow);
  });
});

describe("routeTransition", () => {
  it("hidden y de distance.sm", () => {
    expect(routeTransition.hidden).toEqual({ opacity: 0, y: MOTION_DISTANCE.sm });
  });
});
