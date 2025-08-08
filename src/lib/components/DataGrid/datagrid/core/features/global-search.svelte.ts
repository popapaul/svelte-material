import Fuse, { type IFuseOptions } from "fuse.js";
import type { DatagridCore } from "../index.svelte";
import { DEFAULT_FUSE_OPTIONS } from "../defaults";
import { flattenColumnStructureAndClearGroups } from "../utils.svelte";

/**
 * State representing the configuration and status of the global search feature.
 * @typedef {Object} GlobalSearchState
 * @property {boolean} isManual - Whether the search is manual.
 * @property {string} searchQuery - The current search query string.
 * @property {boolean} isFuzzySearchEnabled - Whether fuzzy search is enabled.
 * @property {number} debounceDelay - The delay in milliseconds for debouncing search input.
 * @property {Fuse<any> | null} fuseSearchEngine - The instance of Fuse.js used for search.
 */
export type GlobalSearchState = {
    /** Whether the search is manual. */
    isManual: boolean;
    /** The current search query string. */
    searchQuery: string;
    /** Whether fuzzy search is enabled. */
    isFuzzySearchEnabled: boolean;
    /** The delay in milliseconds for debouncing search input. */
    debounceDelay: number;
    /** The instance of Fuse.js used for search, or null if not initialized. */
    fuseSearchEngine: Fuse<any>;
    /** Callback function triggered when the search query changes. */
    onSearchQueryChange: (value: string) => void;
}

/**
 * Configuration options for the global search feature.
 * @typedef {Partial<GlobalSearchState>} GlobalSearchFeatureConfig
 */
export type GlobalSearchFeatureConfig = Partial<GlobalSearchState>;

/**
 * Interface representing the global search feature state.
 * @interface IGlobalSearchState
 */
export type IGlobalSearchState = { state: Partial<GlobalSearchState> };

/**
 * The GlobalSearchFeature class provides search capabilities within the datagrid,
 * including fuzzy search and manual query management.
 */
export class GlobalSearchFeature implements IGlobalSearchState {
    datagrid: DatagridCore;
    state: Partial<GlobalSearchState>;

    /**
     * Creates an instance of the GlobalSearchFeature.
     * @param {DatagridCore} datagrid - The datagrid instance to associate with the search feature.
     * @param {GlobalSearchFeatureConfig} config - Configuration options for initializing the feature.
     */
    constructor(datagrid: DatagridCore, config: GlobalSearchFeatureConfig) {
        this.datagrid = datagrid;
        this.state = $derived(config ?? {});
    }

    /**
     * Updates the current search query and triggers the search functionality.
     * Emits an event to notify other components of the query change.
     * @param {string} query - The new search query.
     */
    updateSearchQuery(query: string): void {
        this.datagrid.events.emit('onSearchQueryChange', { prevQuery: this.state.searchQuery, newQuery: query });
        this.state.searchQuery = query;
        this.state.onSearchQueryChange?.(query);
        if(!this.state.isManual)
        {
            this.datagrid.cacheManager.invalidate('filteredData');
            this.datagrid.processors.data.executeFullDataTransformation();
        }
    }

    /**
     * Initializes a new Fuse.js instance with the provided items and search keys.
     * This is used to set up the search functionality for the given data.
     * @param {T[]} items - The array of items to search through.
     * @param {string[]} keys - The keys within each item to search on.
     * @param {IFuseOptions<T>} [config=DEFAULT_FUSE_OPTIONS] - The configuration options for Fuse.js.
     * @returns {Fuse<T>} The initialized Fuse.js instance configured with search options.
     */
    initializeFuseInstance<T>(items: T[], keys: string[], config: IFuseOptions<T> = DEFAULT_FUSE_OPTIONS): Fuse<T> {
        // Configure Fuse.js options to perform fuzzy search
        return new Fuse(items, {
            keys,               // Specify which fields to search on
            ...config,          // Merge default options with provided options
        });
    }

    /**
     * Retrieves the Fuse.js search engine instance. If not yet initialized, it initializes it.
     * @returns {Fuse<any> | null} The Fuse.js instance used for search, or null if not initialized.
     */
    getFuseSearchEngine(): Fuse<any> | null {
        if (!this.state.fuseSearchEngine) {
            this.setFuseSearchEngine(this.initializeFuseInstance(this.datagrid.originalState.data || [], flattenColumnStructureAndClearGroups(this.datagrid._columns).map(col => col.columnId as string)));
        }
        return this.state.fuseSearchEngine;
    }

    /**
     * Sets the Fuse.js search engine instance for use in searching.
     * @param {Fuse<any> | null} fuseSearchEngine - The Fuse.js instance to set, or null to disable search.
     */
    setFuseSearchEngine(fuseSearchEngine: Fuse<any> | null): void {
        this.state.fuseSearchEngine = fuseSearchEngine;
    }
}
