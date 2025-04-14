import type { ColumnOptions } from "./column-creation/types"
import type { ColumnSizeState } from "./types"

export const DEFAULT_COLUMN_SIZE:ColumnSizeState = {
    width: null,
    minWidth: 100,
    maxWidth: 700,
    grow: true
}

export const DEFAULT_COLUMN_OPTIONS:ColumnOptions = {
    calculateFacets:  false,
    searchable: true,
    groupable:  true,
    sortable:  false,
    filterable:  false,
    pinnable:  true,
    moveable:  true,
    hideable:  true,
    resizable:  true,
    visible: true, 
    align: "center",
    pinning: {
      position: 'none',
      offset: 0
    }
}

export const DEFAULT_FUSE_OPTIONS = {
    threshold: 0.3,     // Sensitivity threshold for fuzzy matching (lower is more strict)
    location: 0,        // Starting position for search in each string
    distance: 100,      // Maximum distance to consider for matching
    includeScore: true, // Include score in search results
    useExtendedSearch: true, // Enable extended search capabilities (supports wildcards)
    ignoreLocation: true,    // Ignore the starting position of the match
    findAllMatches: true,    // Find all matches rather than just the first one
}