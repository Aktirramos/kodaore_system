#!/usr/bin/env python3
"""
Vectorización final de los 5 frames haraigoshi.
Calibraciones A (trazo limpio) y B (detalle conservado) para elegir.
Se omite la primera curva (boundary de canvas que potracer emite siempre).
"""
import time
from pathlib import Path
from PIL import Image
import numpy as np
from potrace import Bitmap, POTRACE_TURNPOLICY_MINORITY

FRAMES_DIR = Path("public/landing/haraigoshi/frames")
OUT_A = Path("public/landing/haraigoshi/svg-a-clean")
OUT_B = Path("public/landing/haraigoshi/svg-b-detail")
PREVIEW = Path("/tmp/haraigoshi-preview")
for p in (OUT_A, OUT_B, PREVIEW):
    p.mkdir(parents=True, exist_ok=True)

# Limpiar SVGs anteriores (con bg rect inyectado)
for p in (OUT_A, OUT_B):
    for f in p.glob("*.svg"):
        f.unlink()

def to_svg(path, width, height, fill="#111111", bg=None):
    d = []
    for i, curve in enumerate(path):
        if i == 0:
            # Skip canvas boundary curve that potracer always emits first
            continue
        fx, fy = curve.start_point.x, curve.start_point.y
        d.append(f"M{fx:.2f} {fy:.2f}")
        for seg in curve:
            if seg.is_corner:
                d.append(f"L{seg.c.x:.2f} {seg.c.y:.2f}L{seg.end_point.x:.2f} {seg.end_point.y:.2f}")
            else:
                d.append(f"C{seg.c1.x:.2f} {seg.c1.y:.2f} {seg.c2.x:.2f} {seg.c2.y:.2f} {seg.end_point.x:.2f} {seg.end_point.y:.2f}")
        d.append("Z")
    bg_rect = f'<rect width="{width}" height="{height}" fill="{bg}"/>' if bg else ""
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width} {height}" '
        f'width="{width}" height="{height}">'
        f'{bg_rect}'
        f'<path d="{"".join(d)}" fill="{fill}" fill-rule="evenodd"/>'
        f'</svg>'
    )

def trace_once(frame_path, threshold, turdsize, alphamax, opttolerance):
    img = Image.open(frame_path).convert("L")
    arr = np.array(img)
    mask = arr < threshold
    bmp = Bitmap(mask)
    t0 = time.time()
    path = bmp.trace(
        turdsize=turdsize,
        turnpolicy=POTRACE_TURNPOLICY_MINORITY,
        alphamax=alphamax,
        opticurve=True,
        opttolerance=opttolerance,
    )
    dt = (time.time() - t0) * 1000
    n_curves = sum(1 for _ in path) - 1  # subtract canvas boundary
    return img, path, n_curves, dt

def process(frame_path, out_dir, *, threshold, turdsize, alphamax, opttolerance):
    img, path, n_curves, dt = trace_once(frame_path, threshold, turdsize, alphamax, opttolerance)
    # SVG for production use (no background, stroke-less, uses currentColor-friendly fill)
    svg_prod = to_svg(path, img.width, img.height, fill="currentColor")
    (out_dir / f"{frame_path.stem}.svg").write_text(svg_prod)
    # SVG with background for preview
    svg_preview = to_svg(path, img.width, img.height, fill="#111111", bg="#f5f0e6")
    (PREVIEW / f"{out_dir.name}-{frame_path.stem}.svg").write_text(svg_preview)
    size_kb = (out_dir / f"{frame_path.stem}.svg").stat().st_size / 1024
    return {"frame": frame_path.name, "curves": n_curves, "svg_kb": round(size_kb, 1), "ms": round(dt, 0)}

def main():
    frames = sorted(FRAMES_DIR.glob("frame-*.png"))
    print(f"=== Calibración A: trazo limpio (threshold=140, turdsize=8) ===")
    results_a = [process(f, OUT_A, threshold=140, turdsize=8, alphamax=1.0, opttolerance=0.3) for f in frames]
    print(f"=== Calibración B: detalle (threshold=170, turdsize=2) ===")
    results_b = [process(f, OUT_B, threshold=170, turdsize=2, alphamax=1.2, opttolerance=0.2) for f in frames]

    print(f"\n{'frame':<15} {'A_curves':>10} {'A_kb':>7} {'B_curves':>10} {'B_kb':>7} {'png_kb':>7}")
    for ra, rb in zip(results_a, results_b):
        png_kb = (FRAMES_DIR / ra["frame"]).stat().st_size / 1024
        print(f"{ra['frame']:<15} {ra['curves']:>10} {ra['svg_kb']:>7} {rb['curves']:>10} {rb['svg_kb']:>7} {png_kb:>7.1f}")
    tot_a = sum(r["svg_kb"] for r in results_a)
    tot_b = sum(r["svg_kb"] for r in results_b)
    tot_png = sum((FRAMES_DIR / r["frame"]).stat().st_size / 1024 for r in results_a)
    print(f"{'TOTAL':<15} {'':>10} {tot_a:>7.1f} {'':>10} {tot_b:>7.1f} {tot_png:>7.1f}")

if __name__ == "__main__":
    main()
