# AppBar Teleport Integration

The AppBar component provides several teleport targets that allow tools to inject their UI components directly into the application bar.

## Available Teleport Targets

### `#app-bar-left`
- **Location**: Left side of the AppBar, after the navigation links
- **Use for**: Tool-specific navigation items, breadcrumbs, or context indicators

### `#app-bar-actions`
- **Location**: Right side of the AppBar, before the tool selector
- **Use for**: Primary tool actions, toggle buttons, quick actions

### `#app-bar-settings`
- **Location**: Right side of the AppBar, between tool selector and user menu
- **Use for**: Tool-specific settings, configuration dropdowns, options

## Usage Example

```vue
<template>
  <!-- Your tool component -->
  <div>
    <!-- Teleport actions to AppBar -->
    <Teleport to="#app-bar-actions">
      <button @click="performAction" class="px-2 py-1 bg-blue-600 text-white rounded">
        Action
      </button>
    </Teleport>

    <!-- Teleport settings to AppBar -->
    <Teleport to="#app-bar-settings">
      <select v-model="setting" class="bg-gray-800 text-white px-2 py-1 rounded">
        <option value="option1">Option 1</option>
        <option value="option2">Option 2</option>
      </select>
    </Teleport>

    <!-- Your main tool content -->
    <div class="tool-content">
      <!-- ... -->
    </div>
  </div>
</template>
```

## Styling Guidelines

- Use dark theme colors (bg-gray-800, text-white, etc.) to match AppBar
- Keep components small and compact (text-xs, px-2 py-1)
- Use transitions for hover effects
- Maintain consistent spacing with space-x-2

## Benefits

1. **Contextual**: Tool-specific controls appear only when the tool is active
2. **Consistent**: All tools use the same AppBar layout and styling
3. **Clean**: Main tool content focuses on functionality, not chrome
4. **Accessible**: Controls are in expected locations (top navigation)