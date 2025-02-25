import Fuse from "fuse.js";
import { DatagridCore } from "../index.svelte";
import { debounce } from "../utils.svelte";


export type GlobalSearchPluginConfig = {
    manual?: boolean;
    value?: string;
    delay?: number;
    fuzzy?: boolean;
    fuseInstance?: Fuse<any>;
    onGlobalSearchChange?(value: string): void;
}


/**
 * Manages global search functionality with fuzzy searching using Fuse.js.
 */
export class GlobalSearchFeature<TOriginalRow = any> {
    datagrid: DatagridCore<TOriginalRow>;
    #value = $state('');
    manual: boolean = $state(false);

    // State for storing the current search value
    get value(){
        return this.#value;
    }
    set value(val){
        this.#value = val;
        this.handleSearch?.();
    }

    // State for the search debounce delay (in milliseconds)
    delay = $state(300);

    // State for toggling fuzzy search behavior
    fuzzy = $state(false);

    // The instance of Fuse.js for performing the search
    fuseInstance: Fuse<any> | null = $state(null)

    onGlobalSearchChange: (value: string) => void = () => { };

    constructor(datagrid: DatagridCore<TOriginalRow>,config?: GlobalSearchPluginConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: GlobalSearchPluginConfig) {
        this.manual = config?.manual ?? this.manual;
        this.value = config?.value ?? this.value;
        this.delay = config?.delay ?? this.delay;
        this.fuzzy = config?.fuzzy ?? this.fuzzy;
        this.fuseInstance = config?.fuseInstance ?? this.fuseInstance;
        this.onGlobalSearchChange = config?.onGlobalSearchChange ?? this.onGlobalSearchChange;
        this.handleSearch = debounce(()=>this.applySearch(), 1)//this.delay);
    }

    /**
     * Sets the Fuse.js instance used for performing searches.
     * @param fuseInstance - The Fuse.js instance to use for searching.
     */
    setFuseInstance(fuseInstance: Fuse<any> | null): void {
        this.fuseInstance = fuseInstance;
    }

    applySearch(){
        this.datagrid.features.pagination.goToFirstPage();
        this.datagrid.cache.invalidate('filteredData');
        this.datagrid.processors.data.executeFullDataTransformation();
        this.onGlobalSearchChange?.(this.#value);
    }
    handleSearch: () => void;
}
