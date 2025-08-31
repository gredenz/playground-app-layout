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

This is a Vue 3 + TypeScript application implementing a dynamic, tool-based layout system. The architecture enables different "tools" (features) to define their own UI layouts and component arrangements.

### Core Layout System

The layout system (currently v0) is built around:

1. **Tool Store** (`src/stores/tool.store.ts`): Central state management that:
   - Manages active tool and layout mode
   - Dynamically loads components based on tool configuration
   - Handles layout transitions between tools
   - Maps component names to lazy-loaded Vue components

2. **Layout Manager** (`src/LayoutManager.vue`): Orchestrates layout rendering by:
   - Selecting appropriate layout component (ThreePanelLayout, TwoPanelLayout, FocusedLayout)
   - Passing dynamically loaded components to layout slots
   - Providing layout mode switching UI

3. **Layout Modes**: Three distinct arrangements:
   - `3col`: Main panel, middle panel, right sidebar
   - `2col`: Main panel, right sidebar
   - `focused`: Full-width main with optional overlay

### Tool Configuration Structure

Each tool in `toolLayoutConfigs` defines:
- Supported layout modes
- Default layout mode
- Component assignments for each layout slot per mode
- Components can be set to 'hidden' to remove them

### Component Loading Strategy

Components are:
- Lazy-loaded using dynamic imports
- Wrapped with `markRaw()` to prevent Vue reactivity overhead
- Cached using `shallowRef` for performance
- Loaded in parallel when switching tools/layouts

### Current Tools

- **SeoScore**: SEO analysis tool
- **SpecSheetHosting**: Specification sheet tool
- **NewTool**: Example placeholder tool

### Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Pinia** for state management
- **PrimeVue** component library (theme disabled)
- **Tailwind CSS** for styling
- **Vite** for build tooling
- **Vitest** for unit testing
- **Playwright** for E2E testing

### Active Refactoring

There is an ongoing refactoring plan (`REFACTORING_PLAN.md`) to transform this into a plugin-based architecture with:
- Tool self-registration
- Better separation of concerns
- Type-safe component resolution
- Proper error boundaries
- Responsive layout support

When making changes, consider whether they align with the refactoring goals or should be implemented in the current v0 system.
- Ok lets start with the plan. First thing however I noticed the usage of "I" in front of interface names. I don't like that naming convention. Also I'm a big a big fan of SOLID principals, clean code (without overdoing the creation of small functions), early returns. Also I don't want you to agree with everything. You are my pair programmer, we challenge each other assumptions, we are architects of this system, we think as Sr Software Engineers and architects"
- I've added a code-reviewer agent you are to use this agent before we commit code and other times along the way to make sure we are writing quality code