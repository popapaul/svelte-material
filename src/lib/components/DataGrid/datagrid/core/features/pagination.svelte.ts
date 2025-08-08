import type { DatagridCore } from "../index.svelte";

/**
 * State configuration for the Pagination feature in the data grid.
 */
export type PaginationFeatureState = {
    /** Indicates whether the pagination is controlled manually. */
    manual: boolean;
    
    /** The current page number (starts at 1). */
    page: number;
    
    /** The number of rows per page. */
    pageSize: number;
    
    /** Available page size options (e.g., [10, 20, 50, 100]). */
    pageSizes: number[];
    
    /** The total number of pages available. */
    pageCount: number;
    
    /** The total number of rows across all pages. */
    totalCount: number;
    
    /** Whether the page number should automatically reset when the data changes. */
    autoResetPage: boolean;
    
    /** Callback invoked when the pagination state changes. */
    onPaginationChange(config: PaginationFeature<any>): void;
}

/**
 * Partial configuration for the Pagination feature, which may include overriding specific state properties.
 */
export type PaginationFeatureConfig = Partial<PaginationFeatureState>;

/**
 * Interface for row pinning functionality, extending PaginationFeatureState.
 */
export type IRowPinningFeature = { state: Partial<PaginationFeatureState> };

/**
 * Manages pagination functionality within the data grid, including page navigation, size adjustments, and event handling.
 */
export class PaginationFeature<TOriginalRow = any> implements IRowPinningFeature {
    /** The instance of the data grid associated with this feature. */
    datagrid: DatagridCore<TOriginalRow>;

    state: Partial<PaginationFeatureState>;

    // /** Flag indicating whether page resets automatically. */
    // autoResetPage: boolean = $state(false);

    // /** Callback function to handle changes in pagination state. */
    // onPaginationChange: (config: PaginationFeature<any>) => void = () => { };

    // /** Flag indicating whether pagination is manual. */
    // manual: boolean = $state(false);

    // /** The current page number (starts at 1). */
    // page = $state(1);

    // /** The number of rows per page (default is 10). */
    // pageSize = $state(10);

    // /** Available options for rows per page (e.g., [10, 20, 50, 100]). */
    // pageSizes = $state([10, 20, 50, 100]);

    // /** Total number of pages available. */
    // pageCount: number = $state(0);

    // /** Total count of rows across all pages. */
    // totalCount: number = $state(0);

    /**
     * Creates an instance of the PaginationFeature class.
     * @param {DatagridCore<TOriginalRow>} datagrid The data grid instance to which pagination will be applied.
     * @param {PaginationFeatureConfig} [config] Optional configuration to initialize the feature.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: PaginationFeatureConfig) {
        this.datagrid = datagrid;
  
        this.state = $derived(config);
        this.state.pageCount ??= this.getPageCount(this.datagrid.cacheManager.rows || []);
        this.state.totalCount ??= this.datagrid.cacheManager.rows.length;
        this.state.page ??= 1;
        this.state.pageSize ??= 25;
        this.state.pageSizes ??= [10, 20, 50, 100];
    }

    /**
     * Determines if the previous page can be navigated to.
     * @returns {boolean} `true` if the current page is 1, meaning no previous page exists.
     */
    canGoToPrevPage(): boolean {
        return this.state.page === 1;
    }

    /**
     * Determines if the next page can be navigated to.
     * @returns {boolean} `true` if the current page is equal to the last page, meaning no next page exists.
     */
    canGoToNextPage(): boolean {
        return this.state.page === this.state.pageCount;
    }

    /**
     * Navigates to a specific page.
     * @param {number} newPage The page number to navigate to.
     */
    goToPage(newPage: number): void {
        if (newPage === this.state.page) return; // No action if already on the specified page
        this.datagrid.events.emit('onPageChange', { prevPage: this.state.page, newPage });
        this.state.page = Math.min(
            Math.max(newPage, 1),
            this.datagrid.features.pagination.state.pageCount
        );
        if(!this.state.manual)
        this.datagrid.processors.data.handlePaginationChange()
    }

    /**
     * Navigates to the next page, if possible.
     */
    goToNextPage(): void {
        if (this.canGoToNextPage()) return;
        const newPage = this.state.page + 1;
        this.datagrid.events.emit('onPageChange', { prevPage: this.state.page, newPage });
        this.goToPage(newPage);
      
    }

    /**
     * Navigates to the previous page, if possible.
     */
    goToPrevPage(): void {
        if (this.canGoToPrevPage()) return;
        const newPage = this.state.page - 1;
        this.datagrid.events.emit('onPageChange', { prevPage: this.state.page, newPage });
        this.goToPage(newPage);
    }

    /**
     * Navigates to the first page.
     */
    goToFirstPage(): void {
        const firstPage = 1;
        this.datagrid.events.emit('onPageChange', { prevPage: this.state.page, newPage: firstPage });
        this.goToPage(firstPage);
    }

    /**
     * Navigates to the last page.
     */
    goToLastPage(): void {
        const lastPage = this.state.pageCount;
        this.datagrid.events.emit('onPageChange', { prevPage: this.state.page, newPage: lastPage });
        this.goToPage(lastPage);
    }

    /**
     * Navigates to the closest valid page, ensuring it's within the range of available pages.
     */
    goToClosestPage(): void {
        const closestPage = Math.min(this.state.page, this.state.pageCount); // Ensure the page is within valid bounds
        this.datagrid.events.emit('onPageChange', { prevPage: this.state.page, newPage: closestPage });
        this.goToPage(closestPage);
    }

    /**
     * Calculates the total number of pages based on the current data set and page size.
     * @param {Array<any>} data The dataset used for pagination calculation.
     * @returns {number} The total number of pages.
     */
    getPageCount(data: Array<any>): number {
        return Math.ceil( (this.state.manual ? this.state.totalCount : data.length) / this.state.pageSize);
    }

    /**
     * Updates the page size and adjusts pagination accordingly.
     * @param {number} newSize The new page size to set.
     */
    setPageSize(newSize: number): void {

        this.datagrid.events.emit('onPageSizeChange', { prevSize: this.state.pageSize, pageSize: newSize });
        if (newSize === this.state.pageSize) return; // No action if the page size is the same
        this.state.pageSize = newSize;

        this.state.pageCount = this.getPageCount(this.datagrid.cacheManager.rows || []);
        // Recalculate pagination and ensure the page is within the valid range after the page size change
        this.goToClosestPage();
    }
}
