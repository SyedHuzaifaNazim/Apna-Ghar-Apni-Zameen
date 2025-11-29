import { analyticsService } from './analyticsService';
import { storageService } from './storageService';

export interface OfflineAction {
  id: string;
  type: string;
  payload: Record<string, any>;
  createdAt: number;
  retries: number;
  status: 'pending' | 'failed';
}

type OfflineProcessor = (action: OfflineAction) => Promise<void>;

const QUEUE_STORAGE_KEY = 'offline_action_queue';

class OfflineQueueService {
  private subscribers = new Set<(queue: OfflineAction[]) => void>();
  private processors = new Map<string, OfflineProcessor>();

  private async saveQueue(queue: OfflineAction[]): Promise<void> {
    await storageService.setItem(QUEUE_STORAGE_KEY, queue);
    this.notifySubscribers(queue);
  }

  private notifySubscribers(queue: OfflineAction[]): void {
    this.subscribers.forEach(listener => listener(queue));
  }

  registerProcessor(type: string, processor: OfflineProcessor): () => void {
    this.processors.set(type, processor);
    return () => {
      this.processors.delete(type);
    };
  }

  async getQueue(): Promise<OfflineAction[]> {
    const queue = await storageService.getItem<OfflineAction[]>(QUEUE_STORAGE_KEY);
    return queue ?? [];
  }

  async getQueueLength(): Promise<number> {
    const queue = await this.getQueue();
    return queue.length;
  }

  async enqueue(type: string, payload: Record<string, any>): Promise<OfflineAction> {
    const queue = await this.getQueue();
    const action: OfflineAction = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type,
      payload,
      createdAt: Date.now(),
      retries: 0,
      status: 'pending',
    };

    queue.push(action);
    await this.saveQueue(queue);
    return action;
  }

  async remove(actionId: string): Promise<void> {
    const queue = await this.getQueue();
    const filtered = queue.filter(action => action.id !== actionId);
    await this.saveQueue(filtered);
  }

  async markFailed(actionId: string): Promise<void> {
    const queue = await this.getQueue();
    const updated = queue.map(action =>
      action.id === actionId
        ? { ...action, retries: action.retries + 1, status: 'failed' as const }
        : action
    );
    await this.saveQueue(updated);
  }

  subscribe(listener: (queue: OfflineAction[]) => void): () => void {
    this.subscribers.add(listener);

    return () => {
      this.subscribers.delete(listener);
    };
  }

  async clear(): Promise<void> {
    await this.saveQueue([]);
  }

  private async executeAction(action: OfflineAction): Promise<void> {
    const processor = this.processors.get(action.type);

    if (processor) {
      await processor(action);
      return;
    }

    await analyticsService.track('offline_action_synced', {
      action_type: action.type,
      created_at: action.createdAt,
    });
  }

  async processQueue(): Promise<void> {
    const queue = await this.getQueue();

    for (const action of queue) {
      try {
        await this.executeAction(action);
        await this.remove(action.id);
      } catch (error) {
        await this.markFailed(action.id);
        await analyticsService.trackError(error as Error, {
          context: 'offline_queue_process',
          action_type: action.type,
        });
      }
    }
  }
}

export const offlineQueueService = new OfflineQueueService();


