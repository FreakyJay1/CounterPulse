const QUEUE_KEY = 'offlineActionQueue';
const API_BASE = 'http://192.168.0.108:5000';

function getQueue() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY)) || [];
  } catch {
    return [];
  }
}

function setQueue(queue) {
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
}

export function queueAction(action) {
  const queue = getQueue();
  queue.push(action);
  setQueue(queue);
}

export async function processQueue() {
  const queue = getQueue();
  if (queue.length === 0) {
    console.log('[OfflineQueue] No actions to process.');
    return;
  }
  const remaining = [];
  let anySent = false;
  console.log(`[OfflineQueue] Processing ${queue.length} queued actions...`);
  for (const action of queue) {
    try {
      await sendActionToServer(action);
      console.log(`[OfflineQueue] Successfully sent action:`, action);
      anySent = true;
    } catch (err) {
      console.error('[OfflineQueue] Failed to send action:', action, err);
      remaining.push(action);
    }
  }
  setQueue(remaining);
  if (anySent) {
    window.dispatchEvent(new Event('queueProcessed'));
  }
}

async function sendActionToServer(action) {
  let url = '', method = 'POST', body = null;
  switch (action.type) {
    case 'ADD_PRODUCT':
      url = `${API_BASE}/api/products`;
      body = JSON.stringify(action.payload);
      break;
    case 'EDIT_PRODUCT':
      url = `${API_BASE}/api/products/${action.payload.id}`;
      method = 'PUT';
      body = JSON.stringify(action.payload);
      break;
    case 'REMOVE_PRODUCT':
      url = `${API_BASE}/api/products/${action.payload.id}`;
      method = 'DELETE';
      break;
    case 'LOG_SALE':
      url = `${API_BASE}/api/sales`;
      body = JSON.stringify(action.payload);
      break;
    default:
      throw new Error('Unknown action type');
  }
  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: method === 'DELETE' ? undefined : body,
  });
}

export function setupQueueSync() {
  window.addEventListener('online', processQueue);
  setInterval(() => {
    if (navigator.onLine) processQueue();
  }, 120000);
}
