import { Index } from "flexsearch";

export interface SearchResult {
    title: string;
    icon?: string;
    command: string;
    args?: unknown[];
}

export interface SearchResultDB {
    [id: string]: SearchResult
}

export class SearchCategory {
    db: SearchResultDB;
    index: Index;

    constructor(db: SearchResultDB) {
        this.index = new Index({tokenize: "full"});
        this.db = db;
        Object.entries(this.db).forEach(([id, item]) => this.index.addAsync(id, item.title));
    }

    search(query: string, count: number) {
        const result = this.index.search(query, count);
        return result.map(id => {return {...this.db[id], id: id}});
    }

}