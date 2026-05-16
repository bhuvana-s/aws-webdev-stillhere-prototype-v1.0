/**
 * StillHere — Browser IndexedDB persistence.
 *
 * Single-session prototype storage. One demo record (`DEMO_KEY`) per
 * object store keeps the data model trivial.
 *
 * Stores:
 *   - "recordings": { id, blob, mimeType, durationSec, promptId, createdAt }
 *   - "photos":     { id, blob }
 *   - "meta":       { id, title?, sealedDate?, status, buyer?, parent?, child? }
 *
 * Everything is no-op on the server (typeof indexedDB === "undefined").
 */

const DB_NAME = "stillhere";
const DB_VERSION = 1;
export const DEMO_KEY = "demo";

export type SealStatus = "draft" | "sealed" | "revealed";

export interface RecordingRecord {
  id: string;
  blob: Blob;
  mimeType: string;
  durationSec: number;
  promptId: string;
  createdAt: number;
}

export interface PhotoRecord {
  id: string;
  blob: Blob;
}

export interface BuyerInfo {
  buyerName: string;
  parentName: string;
  parentPhone: string;
  childName: string;
  childBirthdate: string;
}

export interface MetaRecord {
  id: string;
  title?: string;
  sealedDate?: string;
  status: SealStatus;
  buyer?: BuyerInfo;
}

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("IndexedDB unavailable (server context)"));
      return;
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("recordings")) {
        db.createObjectStore("recordings", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("photos")) {
        db.createObjectStore("photos", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("meta")) {
        db.createObjectStore("meta", { keyPath: "id" });
      }
    };
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
  });
}

function tx<T>(
  storeName: "recordings" | "photos" | "meta",
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> {
  return openDB().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        const request = run(store);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        transaction.oncomplete = () => db.close();
        transaction.onerror = () => reject(transaction.error);
      }),
  );
}

/* ===========================================================
   Recordings
   =========================================================== */

export async function saveRecording(
  blob: Blob,
  meta: { mimeType: string; durationSec: number; promptId: string },
): Promise<void> {
  const record: RecordingRecord = {
    id: DEMO_KEY,
    blob,
    mimeType: meta.mimeType,
    durationSec: meta.durationSec,
    promptId: meta.promptId,
    createdAt: Date.now(),
  };
  await tx("recordings", "readwrite", (s) => s.put(record));
}

export async function getRecording(): Promise<RecordingRecord | undefined> {
  return tx("recordings", "readonly", (s) =>
    s.get(DEMO_KEY),
  ) as Promise<RecordingRecord | undefined>;
}

/* ===========================================================
   Photo
   =========================================================== */

export async function savePhoto(blob: Blob): Promise<void> {
  await tx("photos", "readwrite", (s) =>
    s.put({ id: DEMO_KEY, blob } satisfies PhotoRecord),
  );
}

export async function getPhoto(): Promise<PhotoRecord | undefined> {
  return tx("photos", "readonly", (s) => s.get(DEMO_KEY)) as Promise<
    PhotoRecord | undefined
  >;
}

/* ===========================================================
   Meta (title, seal status, buyer info)
   =========================================================== */

async function getMetaRaw(): Promise<MetaRecord | undefined> {
  return tx("meta", "readonly", (s) => s.get(DEMO_KEY)) as Promise<
    MetaRecord | undefined
  >;
}

async function patchMeta(patch: Partial<MetaRecord>): Promise<MetaRecord> {
  const current = (await getMetaRaw()) ?? { id: DEMO_KEY, status: "draft" };
  const next: MetaRecord = { ...current, ...patch, id: DEMO_KEY };
  await tx("meta", "readwrite", (s) => s.put(next));
  return next;
}

export const getMeta = getMetaRaw;

export async function saveBuyerInfo(buyer: BuyerInfo): Promise<void> {
  await patchMeta({ buyer });
}

export async function getBuyerInfo(): Promise<BuyerInfo | undefined> {
  const m = await getMetaRaw();
  return m?.buyer;
}

export async function saveTitle(title: string): Promise<void> {
  await patchMeta({ title });
}

export async function sealStory(sealedDate: string): Promise<void> {
  await patchMeta({ status: "sealed", sealedDate });
}

export async function setRevealed(): Promise<void> {
  await patchMeta({ status: "revealed" });
}

/* ===========================================================
   Dev convenience: wipe everything
   =========================================================== */

export async function resetDemoData(): Promise<void> {
  if (!isBrowser()) return;
  await Promise.all([
    tx("recordings", "readwrite", (s) => s.delete(DEMO_KEY)),
    tx("photos", "readwrite", (s) => s.delete(DEMO_KEY)),
    tx("meta", "readwrite", (s) => s.delete(DEMO_KEY)),
  ]);
}
