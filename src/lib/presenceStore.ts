export type PresenceStatus = "active" | "idle";

export interface OnlineUserSnapshot {
  userId: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  currentPath: string;
  status: PresenceStatus;
  connectedAt: number;
  lastSeen: number;
  tabsCount: number;
}

export type PresenceEventType =
  | "USER_ONLINE"
  | "USER_OFFLINE"
  | "USER_UPDATED";

export interface PresenceEvent {
  type: PresenceEventType;
  user: OnlineUserSnapshot;
  onlineUsers: OnlineUserSnapshot[];
  timestamp: number;
}

type PresenceListener = (event: PresenceEvent) => void;

interface TabSession {
  tabId: string;
  path: string;
  status: PresenceStatus;
  lastSeen: number;
}

interface InternalUserPresence {
  userId: string;
  email: string;
  name: string;
  role: string;
  plan: string;
  connectedAt: number;
  lastSeen: number;
  tabs: Map<string, TabSession>;
}

export interface HeartbeatPayload {
  userId: string;
  email: string;
  name: string;
  role?: string;
  plan?: string;
  path?: string;
  tabId?: string;
  status?: PresenceStatus;
}

const SESSION_TTL_MS = 50_000; // 50s without heartbeat => offline
const SWEEP_INTERVAL_MS = 15_000; // Check for expired sessions every 15s

class PresenceStore {
  private users = new Map<string, InternalUserPresence>();
  private listeners = new Set<PresenceListener>();
  private sweepTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.startSweepTimer();
  }

  private startSweepTimer() {
    if (this.sweepTimer) return;
    this.sweepTimer = setInterval(() => {
      this.pruneExpired();
    }, SWEEP_INTERVAL_MS);

    if (typeof this.sweepTimer.unref === "function") {
      this.sweepTimer.unref();
    }
  }

  private toSnapshot(entry: InternalUserPresence): OnlineUserSnapshot {
    let latestTab: TabSession | null = null;
    let hasActiveTab = false;

    for (const tab of entry.tabs.values()) {
      if (tab.status === "active") {
        hasActiveTab = true;
      }
      if (!latestTab || tab.lastSeen >= latestTab.lastSeen) {
        latestTab = tab;
      }
    }

    return {
      userId: entry.userId,
      email: entry.email,
      name: entry.name,
      role: entry.role,
      plan: entry.plan,
      currentPath: latestTab?.path || "/",
      status: hasActiveTab ? "active" : "idle",
      connectedAt: entry.connectedAt,
      lastSeen: entry.lastSeen,
      tabsCount: entry.tabs.size,
    };
  }

  private emit(type: PresenceEventType, user: OnlineUserSnapshot) {
    const onlineUsers = this.getOnlineUsers(false);
    const event: PresenceEvent = {
      type,
      user,
      onlineUsers,
      timestamp: Date.now(),
    };

    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (err) {
        console.error("[PresenceStore] Error notifying listener:", err);
      }
    }
  }

  public pruneExpired(now = Date.now()): void {
    const expiredUsers: OnlineUserSnapshot[] = [];

    for (const [key, entry] of this.users.entries()) {
      let tabsRemoved = false;

      for (const [tabId, tab] of entry.tabs.entries()) {
        if (now - tab.lastSeen > SESSION_TTL_MS) {
          entry.tabs.delete(tabId);
          tabsRemoved = true;
        }
      }

      if (entry.tabs.size === 0) {
        const snapshot = this.toSnapshot(entry);
        this.users.delete(key);
        expiredUsers.push(snapshot);
      } else if (tabsRemoved) {
        this.emit("USER_UPDATED", this.toSnapshot(entry));
      }
    }

    for (const snapshot of expiredUsers) {
      this.emit("USER_OFFLINE", snapshot);
    }
  }

  public heartbeat(payload: HeartbeatPayload): OnlineUserSnapshot {
    const now = Date.now();
    this.pruneExpired(now);

    const key = payload.userId || payload.email;
    const tabId = payload.tabId || "default";
    const path = payload.path || "/";
    const status: PresenceStatus = payload.status === "idle" ? "idle" : "active";

    const existing = this.users.get(key);

    if (!existing) {
      const tabs = new Map<string, TabSession>();
      tabs.set(tabId, { tabId, path, status, lastSeen: now });

      const created: InternalUserPresence = {
        userId: payload.userId,
        email: payload.email,
        name: payload.name || payload.email,
        role: payload.role || "user",
        plan: payload.plan || "free",
        connectedAt: now,
        lastSeen: now,
        tabs,
      };

      this.users.set(key, created);
      const snapshot = this.toSnapshot(created);
      this.emit("USER_ONLINE", snapshot);
      return snapshot;
    }

    const prevSnapshot = this.toSnapshot(existing);

    existing.email = payload.email || existing.email;
    existing.name = payload.name || existing.name;
    existing.role = payload.role || existing.role;
    existing.plan = payload.plan || existing.plan;
    existing.lastSeen = now;
    existing.tabs.set(tabId, { tabId, path, status, lastSeen: now });

    const nextSnapshot = this.toSnapshot(existing);
    const meaningfulChange =
      prevSnapshot.currentPath !== nextSnapshot.currentPath ||
      prevSnapshot.status !== nextSnapshot.status ||
      prevSnapshot.tabsCount !== nextSnapshot.tabsCount ||
      prevSnapshot.name !== nextSnapshot.name ||
      prevSnapshot.plan !== nextSnapshot.plan;

    if (meaningfulChange) {
      this.emit("USER_UPDATED", nextSnapshot);
    }

    return nextSnapshot;
  }

  public markOffline(userKey: string, tabId?: string): void {
    if (!userKey) return;
    const existing = this.users.get(userKey);
    if (!existing) return;

    if (tabId) {
      existing.tabs.delete(tabId);
      if (existing.tabs.size > 0) {
        this.emit("USER_UPDATED", this.toSnapshot(existing));
        return;
      }
    }

    const snapshot = this.toSnapshot(existing);
    this.users.delete(userKey);
    this.emit("USER_OFFLINE", snapshot);
  }

  public getOnlineUsers(runPrune = true): OnlineUserSnapshot[] {
    if (runPrune) {
      this.pruneExpired();
    }

    return Array.from(this.users.values())
      .map((entry) => this.toSnapshot(entry))
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "active" ? -1 : 1;
        }
        return b.lastSeen - a.lastSeen;
      });
  }

  public subscribe(listener: PresenceListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}

const globalForPresence = globalThis as unknown as {
  __qmenuPresenceStore?: PresenceStore;
};

export const presenceStore: PresenceStore =
  globalForPresence.__qmenuPresenceStore ||
  (globalForPresence.__qmenuPresenceStore = new PresenceStore());
