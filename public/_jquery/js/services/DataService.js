
export class DataService {
    static async fetchEntity(entityName, limit = 50) {
        try {
            const response = await fetch(`/json/entity_query_all_paging/?entity=${entityName}&limit=${limit}`);
            const data = await response.json();
            return data.rows || [];
        } catch (error) {
            console.error(`Error fetching ${entityName}:`, error);
            return [];
        }
    }

    static async fetchLookups(lookupCode) {
        try {
            const response = await fetch(`/json/lookup_query_all/?lookup_code=${lookupCode}`);
            const data = await response.json();
            return data.rows || [];
        } catch (error) {
            console.error(`Error fetching lookup ${lookupCode}:`, error);
            return [];
        }
    }
}
