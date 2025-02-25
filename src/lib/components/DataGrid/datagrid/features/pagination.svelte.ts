import type { DatagridCore } from "../index.svelte";



export type PaginationPluginConfig = {
    manual?: boolean;
    // The current page number (starts at page 1)
    page?: number;
    // The data count number
    count?: number;
    // The number of items per page (initially set to 20)
    pageSize?: number;
    // Available page size options (e.g., [10, 20, 50, 100])
    pageSizes?: number[];
    // Total number of pages in the current data set
    pageCount?: number;
    // The total count of rows visible in the current data set
    visibleRowsCount?: number;

    autoResetPage?: boolean;
    onPaginationChange?(config: PaginationFeature<any>): void;
}

/**
 * Manages pagination functionality within the data grid.
 */
export class PaginationFeature<TOriginalRow = any> implements PaginationPluginConfig {
    // The instance of the data grid associated with this feature
    datagrid: DatagridCore<TOriginalRow>;

    #pageSize = $state(20);

    pageSizes = $state([10, 20, 50, 100]);

    visibleRowsCount = $state(0);

    #page = $state(1);

    #count = $state(0);

    manual = $state(false);

    autoResetPage = $state(false);
   
    onPaginationChange: (config: PaginationFeature<any>) => void = () => { };

    set pageSize(value:number){
        this.#pageSize = value;
        this.onPaginationChange(this);
    }
    get pageSize(){
        return this.#pageSize;
    }

    set page(value:number){
        this.#page = value;
        this.onPaginationChange(this);
    }
    get page(){
        return this.#page;
    }

    get count(){
        return this.manual ? this.#count : this.datagrid.cache.rows.length;
    };

    set count(value:number) {
        this.#count  = value;
    }

    get pageCount(){
        return Math.ceil(this.#count / this.pageSize);
    }


    /**
     * Constructor for setting up the data grid and initializing states.
     * @param datagrid - The data grid instance to associate with this pagination feature.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: PaginationPluginConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: PaginationPluginConfig) {
        this.onPaginationChange = config?.onPaginationChange ?? this.onPaginationChange;
        this.manual = config?.manual ?? this.manual;
        this.pageSizes = config?.pageSizes ?? this.pageSizes;
        this.visibleRowsCount = config?.visibleRowsCount ?? this.visibleRowsCount;
        this.#pageSize = config?.pageSize ?? this?.pageSize;
        this.#count = config?.count ?? this.count;
        this.#page = config?.page ?? this.page;
        this.autoResetPage = config?.autoResetPage ?? this.autoResetPage;
    }


    /**
     * Checks if it's possible to go to the previous page.
     * @returns {boolean} - True if the current page is the first page, false otherwise.
     */
    canGoToPrevPage(): boolean {
        return this.page === 1;
    }

    /**
     * Checks if it's possible to go to the next page.
     * @returns {boolean} - True if the current page is the last page, false otherwise.
     */
    canGoToNextPage(): boolean {
        return this.page === this.pageCount;
    }

    /**
     * Goes to the specified page.
     * If the page is the same as the current one, no action is taken.
     * @param {number} page - The page number to go to.
     */
    goToPage(page: number): void {
        if (page === this.page) return; // No action if already on the specified page
        this.page = page;
    }

    /**
     * Goes to the next page if possible.
     * If the next page is the last one, no action is taken.
     */
    goToNextPage(): void {
        if (this.canGoToNextPage()) return;
        this.goToPage(this.page + 1);
    }

    /**
     * Goes to the previous page if possible.
     * If the current page is the first page, no action is taken.
     */
    goToPrevPage(): void {
        if (this.canGoToPrevPage()) return;
        this.goToPage(this.page - 1);
    }

    /**
     * Goes to the first page.
     */
    goToFirstPage(): void {
        this.goToPage(1);
    }

    /**
     * Goes to the last page.
     */
    goToLastPage(): void {
        this.goToPage(this.pageCount);
    }

    /**
     * Adjusts the current page to the closest valid page, ensuring the page
     * is within the range of 1 and the maximum number of pages.
     */
    goToClosestPage(): void {
        const closestPage = Math.min(this.page, this.pageCount); // Ensure the page is within valid bounds
        this.goToPage(closestPage);
    }

    /**
     * Calculates the total number of pages based on the data length and page size.
     * @param {Array<any>} data - The dataset to calculate pages from.
     * @returns {number} - The total number of pages.
     */
    getPageCount(data: Array<any>): number {
        return Math.ceil(data.length / this.pageSize);
    }

    /**
     * Sets a new page size and adjusts the pagination accordingly.
     * When the page size is changed, it also ensures that the current page is valid.
     * @param {number} newSize - The new page size to set.
     */
    setPageSize(newSize: number): void {
        if (newSize === this.pageSize) return; // No action if the page size is the same
        this.pageSize = newSize;
        // Recalculate pagination and ensure the page is within the valid range after the page size change
        this.goToClosestPage();
    }
}
