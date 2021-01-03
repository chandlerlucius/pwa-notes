
export default class Transaction {
    READ = 'readonly';
    READ_WRITE = 'readwrite';

    constructor(dbName) {
        this.dbName = dbName;
    }

    async getAllFromDb(objectStoreName) {
        const objectStore = await this.openDbAndGetObjectStore(objectStoreName, this.READ);

        return new Promise((accept, reject) => {
            const request = objectStore.getAll();
            this.handleRequest(request, accept, reject);
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
                    db.createObjectStore(objectStoreName, {autoIncrement: true});
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
}