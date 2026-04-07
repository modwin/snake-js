# Snake Game

A classic Snake game built with **vanilla JavaScript**, HTML, and CSS. The game runs entirely in the browser using DOM elements for rendering—no external libraries or frameworks required.

This project was built to explore core game-loop concepts, collision detection, and real-time rendering challenges in a browser environment.

## Game logic

- **DOM-Based Rendering**: Snake segments and the apple are rendered as HTML/CSS blocks (50×50 px apple, 40×40 px snake segments).
- **Precise Collision Detection**:
    - Rectangle-based (AABB) checks for apple collision and self-collision.
    - Handles floating-point coordinate inaccuracies that occur with DOM positioning.
- **Growth Mechanic**: Uses a `growing` flag to prevent false self-collisions when eating an apple.
- **Real-time Game Loop**: Handled by `#requestAnimationFrame()` for smooth performance.
- **Responsive Controls**: Arrow keys/WASD 
