export type ContactSubmission = {
  id: number;
  inquiryType: string;
  firstName: string;
  lastName: string;
  organizationName: string;
  jobTitle: string;
  comments: string;
  email: string;
  phoneNumber: string;
  submittedAt: number;
};

const DB_NAME = "civiclens";
const DB_VERSION = 1;
const STORE_NAME = "contact_submissions";

function openContactDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveContactSubmission(
  submission: Omit<ContactSubmission, "id" | "submittedAt">,
): Promise<void> {
  const db = await openContactDb();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);

  const entry: Omit<ContactSubmission, "id"> = {
    ...submission,
    submittedAt: Date.now(),
  };

  await new Promise<void>((resolve, reject) => {
    const request = store.add(entry);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });

  db.close();
}

