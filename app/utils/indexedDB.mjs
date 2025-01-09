export function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        return reject('IndexedDB not supported');
      }
  
      const request = indexedDB.open('myDatabase', 1);
  
      request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('myObjectStore')) {
          db.createObjectStore('myObjectStore', { keyPath: 'id' });
        }
      };
  
      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
  
      request.onerror = function (event) {
        reject(event.target.errorCode);
      };
    });
  }
  
  export function addData(db, data) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'], 'readwrite');
      const objectStore = transaction.objectStore('myObjectStore');
      const request = objectStore.add(data);
  
      request.onsuccess = function () {
        resolve();
      };
  
      request.onerror = function (event) {
        reject(event.target.errorCode);
      };
    });
  }
  
  export function getData(db, id) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'], 'readonly');
      const objectStore = transaction.objectStore('myObjectStore');
      const request = objectStore.get(id);
  
      request.onsuccess = function (event) {
        resolve(event.target.result);
      };
  
      request.onerror = function (event) {
        reject(event.target.errorCode);
      };
    });
  }
  
  export function addSignature(db, signatureData) {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['myObjectStore'], 'readwrite');
      const objectStore = transaction.objectStore('myObjectStore');
      const request = objectStore.add(signatureData);
  
      request.onsuccess = function () {
        resolve();
      };
  
      request.onerror = function (event) {
        reject(event.target.errorCode);
      };
    });
  }

  export function getAllSignatures(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['myObjectStore'], 'readonly');
    const objectStore = transaction.objectStore('myObjectStore');
    const request = objectStore.getAll();

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject(event.target.errorCode);
    };
  });
}
