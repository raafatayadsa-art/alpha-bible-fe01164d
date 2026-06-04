The section chip rail already has onClick handlers calling jumpTo(), but two issues make it unreliable:

1. jumpTo uses el.offsetTop which is relative to the nearest positioned ancestor (<article>), not the scroll container (<main>). This causes inaccurate scroll destinations.
2. activeId is only updated by the scroll-tracking useEffect during/after smooth scroll. There is no immediate visual feedback when a pill is tapped — the user sees no highlight change until the scroll completes and the tracking effect recomputes.

Fix:
- Rewrite jumpTo to calculate scroll position via getBoundingClientRect() on both the target section and the scroll container, giving an accurate root-relative offset.
- Set activeId immediately inside jumpTo() so the tapped pill highlights instantly.
- Keep the existing scroll-tracking useEffect (it will naturally converge as scrolling finishes).