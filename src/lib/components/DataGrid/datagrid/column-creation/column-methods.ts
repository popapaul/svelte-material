import type { AnyColumn, GroupColumn } from "../types";

export const isColumnVisible = (column: AnyColumn<any>): boolean => {
    return column.state.visible === true;
}

export const isColumnSortable = (column: AnyColumn<any>): boolean => {
    
    if (column.options.sortable) {
        return true
    }
    return false
}

export const isColumnFilterable = (column: AnyColumn<any>): boolean => {
    if (column.options.filterable !== null || column.options.filterable !== false) {
        return true
    }
    return false
}

export function isDescendantOf(possibleDescendant: GroupColumn<any>, ancestor: GroupColumn<any>): boolean {
    if (!possibleDescendant) return false;

    // Check if the possible descendant is a direct child of the ancestor
    if (ancestor.columns.includes(possibleDescendant)) return true;

    // Recursively check if the possible descendant is a descendant of any group columns
    return ancestor.columns
        .filter((col): col is GroupColumn<any> => col.type === 'group') // Type guard to ensure we only check GroupColumn types
        .some(childGroup => isDescendantOf(possibleDescendant, childGroup)); // Recursive call for group columns
}