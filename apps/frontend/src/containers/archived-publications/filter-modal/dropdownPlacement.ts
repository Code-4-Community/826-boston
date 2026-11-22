// Keeps a filter dropdown on screen: it opens below the search box, is cut down to the
// space left so the rest scrolls, and opens upward when there is hardly any room below.

// the list's height limit in filter-modal.css (.filter-select-dropdown)
const MAX_HEIGHT = 220;
// space left between the list and the edge of the screen
const EDGE_MARGIN = 12;
// the gap between the search box and the list (see .filter-select-dropdown in the css)
const GAP = 6;
// three 42px options; with less room than this below, opening upward is preferred
const COMFORTABLE_HEIGHT = 126;
// two 42px options; the list is never squeezed below this
const MIN_HEIGHT = 84;

export interface DropdownPlacement {
  openUp: boolean;
  maxHeight: number;
}

// The area the list can use: the window, narrowed by any ancestor that clips its
// children (for example the modal when it scrolls on a short screen).
function visibleBounds(element: HTMLElement): { top: number; bottom: number } {
  let top = 0;
  let bottom = window.innerHeight;

  for (
    let node = element.parentElement;
    node && node !== document.body;
    node = node.parentElement
  ) {
    if (getComputedStyle(node).overflowY === 'visible') continue;
    const rect = node.getBoundingClientRect();
    top = Math.max(top, rect.top);
    bottom = Math.min(bottom, rect.bottom);
  }
  return { top, bottom };
}

export function computeDropdownPlacement(
  searchBox: HTMLElement,
): DropdownPlacement {
  const rect = searchBox.getBoundingClientRect();
  const bounds = visibleBounds(searchBox);

  const below = bounds.bottom - rect.bottom - GAP - EDGE_MARGIN;
  const above = rect.top - bounds.top - GAP - EDGE_MARGIN;

  const openUp = below < COMFORTABLE_HEIGHT && above > below;
  const space = openUp ? above : below;

  return {
    openUp,
    maxHeight: Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, Math.floor(space))),
  };
}
