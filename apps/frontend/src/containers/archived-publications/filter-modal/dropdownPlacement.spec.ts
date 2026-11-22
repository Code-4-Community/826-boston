import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { computeDropdownPlacement } from './dropdownPlacement';

// jsdom has no layout, so every box is given the position the test wants
function setRect(element: HTMLElement, top: number, bottom: number) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    top,
    bottom,
    left: 0,
    right: 100,
    width: 100,
    height: bottom - top,
    x: 0,
    y: top,
    toJSON: () => ({}),
  });
}

function searchBoxAt(top: number, bottom: number, parent?: HTMLElement) {
  const box = document.createElement('div');
  (parent ?? document.body).appendChild(box);
  setRect(box, top, bottom);
  return box;
}

function setWindowHeight(height: number) {
  Object.defineProperty(window, 'innerHeight', {
    value: height,
    configurable: true,
  });
}

describe('computeDropdownPlacement', () => {
  beforeEach(() => setWindowHeight(800));

  afterEach(() => {
    vi.restoreAllMocks();
    document.body.innerHTML = '';
  });

  it('opens below at the full 220px when there is plenty of room', () => {
    const box = searchBoxAt(100, 140);

    expect(computeDropdownPlacement(box)).toEqual({
      openUp: false,
      maxHeight: 220,
    });
  });

  it('cuts the list down to the room left below so the rest scrolls', () => {
    setWindowHeight(790);
    // a search box near the bottom of a laptop-sized window
    const box = searchBoxAt(576, 616);

    // 790 - 616 - 6px gap - 12px edge margin
    expect(computeDropdownPlacement(box)).toEqual({
      openUp: false,
      maxHeight: 156,
    });
  });

  it('opens upward when there is hardly any room below', () => {
    setWindowHeight(680);
    const box = searchBoxAt(541, 581);

    expect(computeDropdownPlacement(box)).toEqual({
      openUp: true,
      maxHeight: 220,
    });
  });

  it('stays below when three options fit there, even if above has more room', () => {
    setWindowHeight(800);
    // 800 - 640 - 18 = 142 below, 400 above
    const box = searchBoxAt(400, 640);

    expect(computeDropdownPlacement(box)).toEqual({
      openUp: false,
      maxHeight: 142,
    });
  });

  it('never squeezes the list below two options', () => {
    setWindowHeight(200);
    // 62px of room on both sides
    const box = searchBoxAt(80, 120);

    const placement = computeDropdownPlacement(box);

    expect(placement.maxHeight).toBe(84);
  });

  it('respects an ancestor that clips its children, such as a scrolling modal', () => {
    setWindowHeight(1000);
    const modal = document.createElement('div');
    modal.style.overflowY = 'auto';
    document.body.appendChild(modal);
    setRect(modal, 100, 500);
    // plenty of window below, but only 60px before the modal's bottom edge
    const box = searchBoxAt(400, 440, modal);

    expect(computeDropdownPlacement(box)).toEqual({
      openUp: true,
      maxHeight: 220,
    });
  });

  it('ignores ancestors that do not clip', () => {
    setWindowHeight(1000);
    const wrapper = document.createElement('div');
    wrapper.style.overflowY = 'visible';
    document.body.appendChild(wrapper);
    setRect(wrapper, 100, 500);
    const box = searchBoxAt(400, 440, wrapper);

    expect(computeDropdownPlacement(box)).toEqual({
      openUp: false,
      maxHeight: 220,
    });
  });
});
