
export default class Transaction {
    READ = 'readonly';
    READ_WRITE = 'readwrite';

    constructor(dbName) {
        this.dbName = dbName;
    }

    async getAllFromDb(objectStoreName, indexName) {
        const objectStore = await this.openDbAndGetObjectStore(objectStoreName, this.READ);

        return new Promise((accept, reject) => {
            let request;
            if(indexName) {
                const index = objectStore.index(indexedDB);
                request = index.openCursor();
            } else {
                request = objectStore.openCursor();
            }
            this.handleCursorRequest(request, accept, reject);
        });
    }

    async getOneFromDb(objectStoreName, key) {
        const objectStore = await this.openDbAndGetObjectStore(objectStoreName, this.READ);

        return new Promise((accept, reject) => {
            const request = objectStore.get(key);
            this.handleRequest(request, accept, reject);
        });
    }

    async updateOrAddToDb(objectStoreName, key, value) {
        const objectStore = await this.openDbAndGetObjectStore(objectStoreName, this.READ_WRITE);

        return new Promise((accept, reject) => {
            const request = key ? objectStore.put(value, key) : objectStore.put(value);
            this.handleRequest(request, accept, reject);
        });
    }

    async openDbAndGetObjectStore(objectStoreName, transactionType) {
        const db = await this.openDb(objectStoreName);
        const transaction = db.transaction(objectStoreName, transactionType);
        return transaction.objectStore(objectStoreName);
    }

    async openDb(objectStoreName) {
        return new Promise((accept, reject) => {
            const request = indexedDB.open(this.dbName);
            request.onupgradeneeded = function() {
                const db = this.result;
                if(!db.objectStoreNames.contains(objectStoreName)) {
                    const objectStore = db.createObjectStore(objectStoreName, {autoIncrement: true});
                    objectStore.createIndex('created', 'created', {unique: false});
                }
            }
            this.handleRequest(request, accept, reject);
        });
    }

    handleRequest(request, accept, reject) {
        request.onerror = function() {
            console.error("Error: ", this.error);
            reject(this.error)
        }
        request.onsuccess = function() {
            accept(this.result);
        }
    }

    handleCursorRequest(request, accept, reject) {
        const array = new Array();
        request.onerror = function() {
            console.error("Error: ", this.error);
            reject(this.error)
        }
        request.onsuccess = function() {
            const cursor = this.result;
            if(cursor) {
                const data = {
                    key: cursor.primaryKey,
                    value: cursor.value
                };
                array.push(data);
                cursor.continue();
            } else {
                accept(array);
            }
        }
    }
}