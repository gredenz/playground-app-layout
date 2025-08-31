# Layout System Refactoring Plan: Plugin-Based Tool Architecture

## Overview
Refactoring the current layout system from a hardcoded, tightly-coupled approach to a flexible, plugin-based architecture with proper separation of concerns.

## Approach: Spike-First Development
We're using a spike-first approach to validate our architecture before committing to abstractions:
1. Build working implementation with one tool ✅
2. Extract interfaces from what works (IN PROGRESS)
3. Validate with second tool
4. Generalize and polish

## Progress Summary
**Completed Spike (Phase 0):**
- Created working plugin-based SeoScoreTool
- Built minimal but functional ToolRegistry
- New simplified app store that delegates properly
- New LayoutManager that dynamically loads components
- Validated the architecture works end-to-end

**Current Focus (Phase 1):**
- Extracting proper TypeScript interfaces
- Creating BaseTool abstract class
- Improving registry with validation and lifecycle

## Current Issues to Address
- [x] Tight coupling between layout configs and store
- [x] Poor type safety with string-based component references  
- [x] No scalability - hardcoded tools and components
- [ ] Missing error boundaries and proper error handling
- [ ] Performance issues with unnecessary reloading
- [ ] No responsive layout support
- [x] Store handling too many responsibilities

## Implementation Phases (REVISED - Spike Approach)

### Phase 0: Spike Implementation ✅
- [x] **0.1 Build working plugin prototype**
  - [x] Create self-registering SeoScoreTool plugin
  - [x] Implement basic ToolRegistry
  - [x] New simplified app store
  - [x] New LayoutManager that works with plugins
  - [x] Validate it works end-to-end

### Phase 1: Extract & Formalize (IN PROGRESS)
- [ ] **1.1 Extract interfaces from spike**
  - [x] `ToolPlugin` interface (no "I" prefix per team standards)
  - [x] `LayoutMode` and `ToolLayout` types
  - [x] `ComponentLoader` type for lazy loading
  - [ ] `BaseTool` abstract class
  - [ ] Error types and boundaries

- [ ] **1.2 Improve registry from spike**
  - [x] Basic registration working
  - [ ] Add tool validation
  - [ ] Add duplicate detection
  - [ ] Implement proper lifecycle management
  - [ ] Add event emitter for tool changes

### Phase 2: Validate with Second Tool
- [ ] **2.1 Migrate existing tool to plugin**
  - [ ] Convert SpecSheetHosting to plugin format
  - [ ] Test switching between tools
  - [ ] Validate layout switching works
  - [ ] Identify any missing abstractions

- [ ] **2.2 Refine based on learnings**
  - [ ] Update interfaces if needed
  - [ ] Improve registry if needed
  - [ ] Add any missing lifecycle hooks
  - [ ] Document patterns that emerged

### Phase 3: Polish & Production
- [ ] **3.1 Error handling & UX**
  - [ ] Error boundary components
  - [ ] Fallback UI components
  - [ ] Loading states per slot
  - [ ] User-friendly error messages
  - [ ] Recovery mechanisms

- [ ] **3.2 Performance optimizations**
  - [ ] Component caching to prevent reloads
  - [ ] Memory leak prevention
  - [ ] Bundle splitting per tool
  - [ ] Lazy loading optimization

- [ ] **3.3 Advanced features**
  - [ ] Tool discovery from plugins folder
  - [ ] Hot reload support for development
  - [ ] Responsive layout support
  - [ ] Layout transition animations
  - [ ] Event bus for tool communication

### Phase 4: Cleanup & Documentation
- [ ] **4.1 Remove old system**
  - [ ] Delete old tool.store.ts
  - [ ] Remove old LayoutManager
  - [ ] Clean up unused components
  - [ ] Update all imports

- [ ] **4.2 Documentation**
  - [ ] Developer guide for creating tools
  - [ ] Architecture documentation
  - [ ] API reference
  - [ ] Migration guide from v0

## Key Architecture Principles

### 1. **Inversion of Control (IoC)**
Tools declare their requirements; the system fulfills them.

### 2. **Open/Closed Principle**
- Open for extension: Easy to add new tools
- Closed for modification: Core system remains stable

### 3. **Single Responsibility**
Each module has one clear purpose:
- Registry: Manages registration
- Engine: Handles layouts
- Store: Manages state
- Tools: Implement business logic

### 4. **Type Safety First**
Everything is strongly typed with TypeScript discriminated unions and generics.

### 5. **Progressive Enhancement**
System works with basic functionality and enhances as plugins load.

## Success Criteria
- [ ] New tools can be added without modifying core code
- [ ] All component references are type-safe
- [ ] Failed tools don't crash the application
- [ ] Layout switching is performant (<100ms)
- [ ] Memory usage remains stable during tool switching
- [ ] Developer can create new tool in <30 minutes
- [ ] 100% backward compatibility or clear migration path

## File Structure (Proposed)
```
src/
├── core/
│   ├── types/           # Core interfaces and types
│   ├── registry/        # Registry implementations
│   ├── layout-engine/   # Layout system
│   └── errors/          # Error handling
├── plugins/
│   ├── tools/           # Tool plugins
│   │   ├── seo-score/
│   │   ├── spec-sheet/
│   │   └── [new-tools]/
│   └── components/      # Shared components
├── stores/
│   └── app.store.ts     # Simplified state management
└── layouts/
    ├── LayoutManager.vue
    └── [layout-components]/
```

## Notes
- Start small, iterate frequently
- Each phase should be independently testable
- Do not be concerned with making sure the old code works. We are forging ahead on a new path. Once we've refactored the
  - old piece in our new architecture cleanup and remove the old one
- Get feedback after each phase before proceeding
