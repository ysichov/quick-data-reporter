import {
    DataRow,
    EntityType,
    EntityMetadata,
    FilterCond,
    SortCond,
    ColumnConfig,
    AggregationCond,
    EntityColMetadata
} from "./ServiceModel";

/**
 * Describes an entity which is configurable
 */
export interface ConfigurableEntity {
    /**
     * Current filter items
     */
    filterItems: FilterCond[];
    /**
     * Current sort items
     */
    sortItems: SortCond[];
    /**
     * Current column configuration
     */
    columnsItems: ColumnConfig[];
    /**
     * Current group items
     */
    aggregationItems: AggregationCond[];
}

/**
 * Describes an entity
 */
export default class Entity implements ConfigurableEntity {
    /**
     * The name of an entity
     */
    name: string;
    /**
     * Type of an entity
     */
    type: EntityType;
    /**
     * Metadata of an entity
     */
    metadata: EntityMetadata = { colMetadata: [] };
    /**
     * Data rows of an entity
     */
    rows: DataRow[] = [];
    filterItems: FilterCond[] = [];
    sortItems: SortCond[] = [];
    columnsItems: ColumnConfig[] = [];
    aggregationItems: AggregationCond[] = [];
    /**
     * Returns all visible columns
     */
    get visibleColMetadata(): EntityColMetadata[] {
        const visibleColKeys = this.columnsItems.filter(col => col.visible).map(col => col.columnKey);
        return this.metadata.colMetadata.filter(colItem => visibleColKeys.includes(colItem.name));
    }
}
