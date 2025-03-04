import ajaxUtil from "./ajaxUtil";
import {
    QueryResult,
    DbEntity,
    EntityMetadata,
    EntityVariant,
    EntityType,
    ValueHelpMetadata,
    FieldMetadata,
    QueryRequest as QueryRequestData,
    EntitySearchScope
} from "../model/ServiceModel";

const BASE_SRV_URL = "/sap/zqdrtrest/entities";
const SUB_ENTITY_SRV_URL = `${BASE_SRV_URL}/{type}/{name}`;

type EntitiesSearchReqParams = {
    $top: number;
    $filter?: string;
    entityType?: EntityType;
    scope?: EntitySearchScope;
};

/**
 * Service to get meta data information about database entities
 */
export default class EntityService {
    /**
     * Retrieves metadata for entity
     * @param type type of the entity
     * @param name the name of the entity
     * @returns Promise with object from the response
     */
    async getMetadata(type: string, name: string): Promise<EntityMetadata> {
        const response = await ajaxUtil.send(
            `${SUB_ENTITY_SRV_URL.replace("{type}", type).replace("{name}", encodeURIComponent(name))}/metadata`,
            {
                method: "GET"
            }
        );
        if (response?.data?.fields) {
            const metadata: EntityMetadata = {
                entity: response.data.entity,
                fields: (response.data.fields as Record<string, any>[]).map(f => Object.assign(new FieldMetadata(), f))
            };

            if (response.data.parameters) {
                metadata.parameters = (response.data.parameters as Record<string, any>[]).map(f =>
                    Object.assign(new FieldMetadata(), f)
                );
            }

            return metadata;
        } else {
            return null;
        }
    }

    /**
     * Retrieves entity data
     * @param type type of the entity
     * @param entity the name of the entity
     * @param queryRequestData the data to be passed in the data request
     * @returns the object from the response if response was ok
     */
    async getEntityData(type: string, entity: string, queryRequest?: QueryRequestData): Promise<QueryResult> {
        const csrfToken = await ajaxUtil.fetchCSRF();
        const response = await ajaxUtil.send(
            `${SUB_ENTITY_SRV_URL.replace("{type}", type).replace("{name}", encodeURIComponent(entity))}/queryResult`,
            {
                method: "POST",
                csrfToken,
                data: queryRequest ? JSON.stringify(queryRequest) : undefined
            }
        );
        return response?.data;
    }

    /**
     * Retrieves value help metadata for a field in a DB entity
     *
     * @param entityName the name of an entity (DB table/DB view/CDS view)
     * @param entityType the type of the entity
     * @param field the name of the field for which the value help metatdata should be retrieved
     * @returns promise with metadata result of the found valuehelp
     */
    async getValueHelpMetadata(entityName: string, entityType: EntityType, field: string): Promise<ValueHelpMetadata> {
        const response = await ajaxUtil.send(
            `${SUB_ENTITY_SRV_URL.replace("{type}", entityType).replace(
                "{name}",
                encodeURIComponent(entityName)
            )}/valueHelpMetadata`,
            {
                method: "GET",
                data: { field }
            }
        );
        return response?.data;
    }

    /**
     * Retrieves variants for entity
     * @param type type of the entity
     * @param name the name of the entity
     * @returns Promise of entity variants
     */
    async getVariants(type: string, name: string): Promise<EntityVariant[]> {
        const response = await ajaxUtil.send(
            `${SUB_ENTITY_SRV_URL.replace("{type}", type).replace("{name}", encodeURIComponent(name))}/variants`,
            {
                method: "GET"
            }
        );
        return response?.data;
    }

    /**
     * Searches for DB entities
     * @param filterValue filter value to search entities
     * @param entityType the type of entities to be searched
     * @param scope search scope for the db entities
     * @returns Promise with response result
     */
    async findEntities(filterValue: string, entityType?: EntityType, scope?: EntitySearchScope): Promise<DbEntity[]> {
        const reqParams = {
            $top: 200
        } as EntitiesSearchReqParams;
        if (filterValue) {
            reqParams.$filter = filterValue;
        }
        if (entityType && entityType !== EntityType.All) {
            reqParams.entityType = entityType;
        }
        if (scope && scope !== EntitySearchScope.All) {
            reqParams.scope = scope;
        }
        const response = await ajaxUtil.send(BASE_SRV_URL, {
            method: "GET",
            data: reqParams
        });
        return response?.data;
    }

    /**
     * Marks the given entity as favorite for the current user
     * @param entityName the name of an entity
     * @param entityType the type of an entity
     */
    async createFavorite(entityName: string, entityType?: EntityType): Promise<void> {
        const csrfToken = await ajaxUtil.fetchCSRF();
        ajaxUtil.send(
            `${SUB_ENTITY_SRV_URL.replace("{type}", entityType).replace(
                "{name}",
                encodeURIComponent(entityName)
            )}/favorite`,
            {
                method: "POST",
                csrfToken
            }
        );
    }

    /**
     * Delete the given entity favorite for the current user
     * @param entityName the name of an entity
     * @param entityType the type of an entity
     */
    async deleteFavorite(entityName: string, entityType?: EntityType): Promise<void> {
        const csrfToken = await ajaxUtil.fetchCSRF();
        ajaxUtil.send(
            `${SUB_ENTITY_SRV_URL.replace("{type}", entityType).replace(
                "{name}",
                encodeURIComponent(entityName)
            )}/favorite`,
            {
                method: "DELETE",
                csrfToken
            }
        );
    }
}
