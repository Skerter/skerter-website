const hero = document.querySelector<HTMLElement>("[data-hero]");

if (hero) {
  const stage = hero.querySelector<HTMLElement>(".hero__stage");
  const word = hero.querySelector<HTMLElement>("[data-pressure-word]");
  const cells = Array.from(
    hero.querySelectorAll<HTMLElement>("[data-pressure-cell]"),
  );
  const toggle = hero.querySelector<HTMLButtonElement>("[data-motion-toggle]");
  const cellLabel = hero.querySelector<HTMLElement>("[data-pressure-cell-label]");
  const forceLabel = hero.querySelector<HTMLElement>("[data-pressure-force]");
  const hint = hero.querySelector<HTMLElement>("[data-pressure-hint]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");

  let responseEnabled = true;
  let lastX = window.innerWidth / 2;
  let lastY = window.innerHeight / 2;
  let lastTime = performance.now();
  let pendingPointer: { x: number; y: number; energy: number } | null = null;
  let paintFrame = 0;
  let heatTimer = 0;
  let pulseTimer = 0;
  let stageBounds: DOMRect | null = null;

  const clamp = (value: number, minimum: number, maximum: number) => {
    return Math.min(Math.max(value, minimum), maximum);
  };

  const setReadout = (cellIndex: number, force: number) => {
    if (cellLabel) {
      cellLabel.textContent = `Glyph ${String(cellIndex + 1).padStart(2, "0")}`;
    }

    if (forceLabel) {
      forceLabel.textContent = `Force ${String(force).padStart(2, "0")}`;
    }
  };

  const resetCell = (cell: HTMLElement) => {
    cell.style.removeProperty("--glyph-weight");
    cell.style.removeProperty("--glyph-flare");
    cell.style.removeProperty("--glyph-volume");
    cell.style.removeProperty("--glyph-slant");
    cell.style.removeProperty("--glyph-shift-x");
    cell.style.removeProperty("--glyph-shift-y");
    cell.style.removeProperty("--glyph-scale-boost");
    cell.style.removeProperty("--pressure");
    cell.style.removeProperty("--heat");
    delete cell.dataset.pressured;
  };

  const resetCells = () => {
    cells.forEach(resetCell);

    setReadout(3, 0);
  };

  const renderPressure = (clientX: number, clientY: number, energy: number) => {
    if (!stage || cells.length === 0) {
      return;
    }

    const bounds = stageBounds ?? stage.getBoundingClientRect();
    const normalizedX = clamp((clientX - bounds.left) / bounds.width, 0, 1);
    const normalizedY = clamp((clientY - bounds.top) / bounds.height, 0, 1);
    const activePosition = normalizedX * cells.length - 0.5;
    const activeIndex = clamp(Math.round(activePosition), 0, cells.length - 1);
    const force = Math.round(34 + energy * 65);

    cells.forEach((cell, index) => {
      const distance = Math.abs(index - activePosition);
      const pressure = clamp(1 - distance / 1.45, 0, 1);

      if (pressure === 0) {
        if (cell.dataset.pressured === "true") {
          resetCell(cell);
        }

        return;
      }

      const direction = clamp(index - activePosition, -1, 1);
      const weight = 315 + pressure * (190 + energy * 105);
      const flare = 6 + pressure * (32 + energy * 34);
      const volume = pressure * (7 + energy * 20);
      const slant = -normalizedY * pressure * 9;
      const shiftX = direction * pressure * (2 + energy * 3.5);
      const shiftY = (normalizedY - 0.5) * pressure * 12;
      const scaleBoost = pressure * (0.02 + energy * 0.035);
      const heat = pressure * energy;

      cell.dataset.pressured = "true";
      cell.style.setProperty("--glyph-weight", weight.toFixed(1));
      cell.style.setProperty("--glyph-flare", flare.toFixed(1));
      cell.style.setProperty("--glyph-volume", volume.toFixed(1));
      cell.style.setProperty("--glyph-slant", slant.toFixed(1));
      cell.style.setProperty("--glyph-shift-x", `${shiftX.toFixed(2)}px`);
      cell.style.setProperty("--glyph-shift-y", `${shiftY.toFixed(2)}px`);
      cell.style.setProperty("--glyph-scale-boost", scaleBoost.toFixed(3));
      cell.style.setProperty("--pressure", pressure.toFixed(3));
      cell.style.setProperty("--heat", heat.toFixed(3));
    });

    setReadout(activeIndex, force);
  };

  const queuePressure = (x: number, y: number, energy: number) => {
    pendingPointer = { x, y, energy };

    if (paintFrame) {
      return;
    }

    paintFrame = requestAnimationFrame(() => {
      if (pendingPointer) {
        renderPressure(pendingPointer.x, pendingPointer.y, pendingPointer.energy);
      }

      pendingPointer = null;
      paintFrame = 0;
    });
  };

  const clearHeatSoon = () => {
    window.clearTimeout(heatTimer);
    heatTimer = window.setTimeout(() => {
      cells.forEach((cell) => {
        if (cell.dataset.pressured === "true") {
          cell.style.setProperty("--heat", "0");
        }
      });
      if (forceLabel) {
        forceLabel.textContent = "Force 00";
      }
    }, 90);
  };

  const triggerWave = () => {
    if (!word || !responseEnabled) {
      return;
    }

    window.clearTimeout(pulseTimer);
    word.classList.remove("is-pulsing");
    void word.offsetWidth;
    word.classList.add("is-pulsing");
    setReadout(3, 99);

    pulseTimer = window.setTimeout(() => {
      word.classList.remove("is-pulsing");
      setReadout(3, 0);
    }, 900);
  };

  const setResponse = (enabled: boolean) => {
    responseEnabled = enabled;
    hero.dataset.motion = enabled ? "on" : "off";

    if (toggle) {
      toggle.textContent = enabled ? "Response: on" : "Response: off";
      toggle.setAttribute("aria-pressed", String(enabled));
    }

    if (hint) {
      hint.textContent = enabled ? "Move / click" : "Response paused";
    }

    if (!enabled) {
      cancelAnimationFrame(paintFrame);
      paintFrame = 0;
      pendingPointer = null;
      word?.classList.remove("is-pulsing");
      resetCells();
    }
  };

  stage?.addEventListener("pointerenter", (event) => {
    stageBounds = stage.getBoundingClientRect();
    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = performance.now();
  });

  stage?.addEventListener("pointermove", (event) => {
    if (!responseEnabled || !finePointer.matches) {
      return;
    }

    const now = performance.now();
    const elapsed = Math.max(now - lastTime, 16);
    const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY);
    const energy = clamp(distance / elapsed / 1.25, 0, 1);

    queuePressure(event.clientX, event.clientY, energy);
    clearHeatSoon();

    lastX = event.clientX;
    lastY = event.clientY;
    lastTime = now;
  });

  stage?.addEventListener("pointerleave", () => {
    stageBounds = null;
    window.clearTimeout(heatTimer);
    resetCells();
  });

  window.addEventListener("resize", () => {
    stageBounds = null;
  });

  stage?.addEventListener("click", triggerWave);

  toggle?.addEventListener("click", () => {
    setResponse(!responseEnabled);
  });

  reduceMotion.addEventListener("change", (event) => {
    if (event.matches) {
      setResponse(false);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      cancelAnimationFrame(paintFrame);
      paintFrame = 0;
      pendingPointer = null;
      resetCells();
    }
  });

  window.addEventListener(
    "pagehide",
    () => {
      cancelAnimationFrame(paintFrame);
      window.clearTimeout(heatTimer);
      window.clearTimeout(pulseTimer);
    },
    { once: true },
  );

  setResponse(!reduceMotion.matches);
}
