# Japanese Text Waterfall - PRD

A poetic interactive application where Japanese literary text flows like water down a black canvas, with user-placeable rocks that naturally redirect the flowing characters.

**Experience Qualities**:
1. **Meditative** - Creates a calming, zen-like atmosphere through gentle text flow
2. **Interactive** - Users can place rocks to dynamically alter text flow patterns  
3. **Organic** - Text movement feels natural and water-like, not mechanical

**Complexity Level**: Light Application (multiple features with basic state)
- Single-purpose focus on text flow visualization with interactive elements that maintain state of rock positions

## Essential Features

**Text Flow System**
- Functionality: Japanese literary characters fall continuously from top to bottom like a waterfall
- Purpose: Creates the primary visual metaphor and meditative experience
- Trigger: Automatically starts on page load
- Progression: Characters spawn at random x-positions → fall with gravity → disappear at bottom → cycle continues
- Success criteria: Smooth 60fps animation with natural falling motion

**Rock Placement System**  
- Functionality: Users click anywhere to place circular rock obstacles
- Purpose: Allows creative interaction and flow pattern customization
- Trigger: Mouse click on canvas area
- Progression: User clicks → rock appears at cursor position → persists until removed → affects all subsequent text flow
- Success criteria: Immediate rock placement with persistent positioning

**Flow Collision Physics**
- Functionality: Falling characters detect rock collisions and redirect naturally around obstacles
- Purpose: Creates the core water-like behavior that makes interaction meaningful
- Trigger: Character touches rock boundary during fall
- Progression: Character falls normally → detects rock collision → splits flow around rock → continues falling past obstacle
- Success criteria: Realistic water-flow physics with characters naturally flowing around rocks

**Literary Text Source**
- Functionality: Displays excerpts from classic Japanese literature
- Purpose: Adds cultural depth and meaning to the flowing characters
- Trigger: Random selection from curated text pool
- Progression: App loads → selects random literary passage → feeds characters into flow system → cycles through different texts
- Success criteria: Diverse, authentic Japanese literary content with proper character rendering

## Edge Case Handling

- **Performance with many rocks**: Limit total rocks to prevent frame rate drops
- **Text rendering issues**: Fallback fonts ensure character visibility across browsers  
- **Mobile touch interaction**: Touch events work equivalently to mouse clicks
- **Empty text sources**: Default haiku content if literary sources fail to load
- **Overlapping rocks**: Allow stacking but maintain individual collision detection

## Design Direction

The design should evoke tranquil contemplation and digital poetry - like watching rain on a window while reading by candlelight, with the interface feeling organic and calming rather than technical or game-like.

## Color Selection

Complementary (opposite colors) - Deep black background contrasted with pure white text creates maximum legibility and dramatic visual impact while maintaining the essential night/water metaphor.

- **Primary Color**: Pure Black (oklch(0 0 0)) - Represents the void, night sky, or deep water
- **Secondary Colors**: White (oklch(1 0 0)) for flowing text, creating stark contrast for readability
- **Accent Color**: Soft Gray (oklch(0.7 0 0)) for rocks and UI elements, providing subtle presence without competing with text
- **Foreground/Background Pairings**: 
  - Background Black (oklch(0 0 0)): White text (oklch(1 0 0)) - Ratio 21:1 ✓
  - Rock Gray (oklch(0.7 0 0)): Black text (oklch(0 0 0)) - Ratio 14.3:1 ✓

## Font Selection

The typeface should feel literary and elegant while maintaining excellent readability for flowing Japanese characters, using a clean serif that honors traditional typography.

- **Typographic Hierarchy**: 
  - Flowing Text: Noto Serif JP Regular/16px/normal spacing for optimal Japanese character rendering
  - UI Elements: Inter Medium/14px/tight for any interface text

## Animations

Motion should feel organic and water-like rather than digital, with gentle physics that create a sense of natural flow and peaceful rhythm.

- **Purposeful Meaning**: Gravity and fluid dynamics communicate the water metaphor while character movement creates meditative rhythm
- **Hierarchy of Movement**: Falling text has primary motion focus, rock placement uses subtle scaling, collision responses feel physically natural

## Component Selection

- **Components**: Canvas-based custom rendering for smooth text animation, shadcn Button for any controls, Card for settings if needed
- **Customizations**: Custom physics engine for text flow, custom collision detection system, custom Japanese text rendering
- **States**: Rocks have placed/hover states, text characters have falling/colliding/deflecting states
- **Icon Selection**: Phosphor icons for any UI controls (play/pause, settings)
- **Spacing**: Minimal UI chrome to focus on canvas experience
- **Mobile**: Touch events replace mouse clicks, responsive canvas sizing, simplified interaction for smaller screens