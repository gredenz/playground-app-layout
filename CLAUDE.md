# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting (with auto-fix)
npm run lint

# Format code
npm run format

# Unit tests with Vitest
npm run test:unit

# E2E tests with Playwright
npm run test:e2e          # Interactive UI mode
npm run test:e2e:headed   # Headed browser mode

# Production build
npm run build
```

## Architecture Overview

This is a Vue 3 + TypeScript application implementing a plugin-based tool system with dynamic layouts. The architecture enables different "tools" (features) to self-register and define their own UI layouts and component arrangements.

### Core Plugin System

The system is built around:

1. **ToolRegistry** (`src/core/ToolRegistry.ts`): Central registry that:
   - Manages tool registration and validation
   - Handles tool activation/deactivation with lifecycle hooks
   - Provides event listeners for tool changes
   - Maintains reactive state for active tools

2. **App Store** (`src/stores/app.store.ts`): State management that:
   - Manages current layout mode and active components
   - Dynamically loads components based on tool configuration
   - Handles layout transitions between tools
   - Provides computed properties for reactive UI updates

3. **Layout Manager** (`src/core/LayoutManager.vue`): Renders layouts by:
   - Supporting 3-column, 2-column, and focused layout modes
   - Using dynamic components (`:is`) for flexible rendering
   - Wrapping all components in ErrorBoundary for fault tolerance
   - Providing debug controls for tool and layout switching

### Layout Modes

Three distinct layout arrangements:
- `3col`: Main panel, middle panel, right sidebar
- `2col`: Main panel, right sidebar  
- `focused`: Full-width main panel

### Tool Plugin Structure

Tools implement the `ToolPlugin` interface and define:
- Supported layout modes with component slot assignments
- Default layout mode for initial activation
- Optional lifecycle hooks for activation/deactivation
- Components loaded via dynamic imports for code splitting

### Component Loading Strategy

- Components are lazy-loaded using dynamic imports for automatic code splitting
- Loaded in parallel for optimal performance  
- Wrapped with `shallowRef` to prevent unnecessary Vue reactivity overhead
- All dynamic components wrapped in ErrorBoundary for fault tolerance

### Tool Structure and Conventions

All tools follow a consistent directory structure under `src/plugins/tools/`:

```
src/plugins/tools/
├── seo-score/
│   ├── components/
│   │   └── SeoScorePanel.vue
│   └── index.ts
├── debug-tool/
│   ├── components/
│   │   ├── DebugMainPanel.vue
│   │   ├── DebugMiddlePanel.vue
│   │   └── DebugSidebar.vue
│   └── index.ts
```

**Tool Naming Conventions:**
- Directory names: `kebab-case` (e.g., `debug-tool`, `seo-score`)
- Class names: `PascalCase` with "Tool" suffix (e.g., `DebugTool`, `SeoScoreTool`)
- Component names: `PascalCase` with descriptive suffixes (e.g., `DebugMainPanel`, `SeoScorePanel`)

**Tool Layout Requirements:**
- **3col layout**: Must include `ToolList` component in right slot for tool switching
- **2col layout**: Should include `ToolList` component in right slot for tool switching  
- **focused layout**: No `ToolList` needed (full-screen mode)
- All tools should extend `BaseTool` class for consistency and lifecycle management

### Current Tools

- **SeoScoreTool**: SEO analysis tool with content editor and scoring panel
- **DebugTool**: System debugging and diagnostic information tool

### Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **PrimeVue** component library (theme disabled)
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Vitest** for unit testing
- **Playwright** for E2E testing

### Key Features

The current architecture provides:
- ✅ **Plugin-based tool system** with self-registration
- ✅ **Type-safe component resolution** via TypeScript interfaces
- ✅ **Error boundaries** for fault-tolerant component rendering
- ✅ **Dynamic layouts** supporting multiple layout modes
- ✅ **Tool validation** with comprehensive error checking
- ✅ **Event-driven architecture** with tool change notifications
- ✅ **Clean separation of concerns** between registry, state, and UI

### Development Principles

- **Keep it simple**: Avoid premature optimization and over-engineering
- **SOLID principles**: Well-structured, maintainable code architecture
- **Clean code**: Readable, focused functions with early returns
- **Type safety**: Comprehensive TypeScript usage throughout
- write tests before working on implementation
- Review Primevue component library to ensure we are not reinventing the wheel. We should try and use the Adapter Pattern when possible to ensure consistency
- USE TAILWIND - Do not use regular css unless absolutely necessary
