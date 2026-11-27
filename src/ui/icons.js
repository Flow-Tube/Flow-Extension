const svg = (body, viewBox = "0 0 24 24") =>
  `<svg viewBox="${viewBox}" width="16" height="16" aria-hidden="true" focusable="false">${body}</svg>`;

// The Flow mark in one colour, for YouTube's own surfaces (player bar, thumbnails, Shorts).
export const flowIcon = svg(
  '<rect x="2.6" y="5.2" width="18.8" height="14" rx="4" fill="none" stroke="currentColor" stroke-width="1.9"/><path fill="currentColor" d="M10.2 8.3h6.6l-.6 2h-3.9l-.45 1.5h3.2l-.6 2h-3.2l-.85 2.7H8.1z"/>',
);

// The Flow mark in its own colours, for pills that sit among YouTube's buttons.
export const flowMarkIcon = svg(
  '<path fill="#FF0000" d="M21.58 7.16a2.75 2.75 0 0 0-1.93-1.93C17.96 4.77 12 4.77 12 4.77s-5.96 0-7.65.46A2.75 2.75 0 0 0 2.42 7.16C1.96 8.85 1.96 12.38 1.96 12.38s0 3.53.46 5.22a2.75 2.75 0 0 0 1.93 1.93c1.69.46 7.65.46 7.65.46s5.96 0 7.65-.46a2.75 2.75 0 0 0 1.93-1.93c.46-1.69.46-5.22.46-5.22s0-3.53-.46-5.22z"/><path fill="#fff" d="M10 7h8l-.8 2.5h-4.4l-.6 2H16l-.8 2.5h-3.7l-1 3h-3z"/>',
);

export const downloadIcon = svg(
  '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M12 4v10m0 0-4-4m4 4 4-4M5 19h14"/>',
);
