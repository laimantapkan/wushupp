import { AppState } from '../types';
import { initialAppState } from '../data/initialData';

const CLIENT_ID = 'client-' + Math.random().toString(36).substring(2, 9);

export class ApiService {
  private static ws: WebSocket | null = null;
  private static listeners: Array<(state: AppState) => void> = [];
  private static statusListeners: Array<(connected: boolean) => void> = [];
  private static isConnected = false;
  private static currentState: AppState = initialAppState;

  static init(onStateChange: (state: AppState) => void, onStatusChange?: (connected: boolean) => void) {
    this.listeners.push(onStateChange);
    if (onStatusChange) {
      this.statusListeners.push(onStatusChange);
      onStatusChange(this.isConnected);
    }

    if (!this.ws) {
      this.connectWebSocket();
    } else if (this.currentState) {
      onStateChange(this.currentState);
    }
  }

  static removeListener(onStateChange: (state: AppState) => void) {
    this.listeners = this.listeners.filter((l) => l !== onStateChange);
  }

  private static connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        this.isConnected = true;
        this.notifyStatus(true);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'STATE_INIT' || data.type === 'STATE_UPDATE') {
            this.currentState = data.state;
            this.notifyListeners(data.state);
          }
        } catch (e) {
          console.error('Error parsing WS message:', e);
        }
      };

      ws.onclose = () => {
        this.isConnected = false;
        this.notifyStatus(false);
        this.ws = null;
        // Reconnect after 3s
        setTimeout(() => this.connectWebSocket(), 3000);
      };

      ws.onerror = () => {
        this.isConnected = false;
        this.notifyStatus(false);
      };
    } catch (e) {
      console.warn('WebSocket connection failed, using HTTP fallback', e);
      this.fetchStateHttp();
    }
  }

  private static notifyListeners(state: AppState) {
    this.listeners.forEach((listener) => listener(state));
  }

  private static notifyStatus(connected: boolean) {
    this.statusListeners.forEach((listener) => listener(connected));
  }

  static async fetchStateHttp(): Promise<AppState> {
    try {
      const res = await fetch('/api/state');
      if (res.ok) {
        const state = await res.json();
        this.currentState = state;
        this.notifyListeners(state);
        return state;
      }
    } catch (e) {
      console.error('HTTP fetch state error:', e);
    }
    return this.currentState;
  }

  static updateState(newState: AppState) {
    this.currentState = newState;
    this.notifyListeners(newState);

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: 'UPDATE_STATE',
          state: newState,
          clientId: CLIENT_ID,
        })
      );
    } else {
      // Fallback REST POST
      fetch('/api/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newState),
      }).catch((e) => console.error('Failed to post state via REST:', e));
    }
  }

  static resetData() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'RESET_STATE', clientId: CLIENT_ID }));
    } else {
      fetch('/api/reset', { method: 'POST' })
        .then((res) => res.json())
        .then((data) => {
          if (data.state) {
            this.currentState = data.state;
            this.notifyListeners(data.state);
          }
        });
    }
  }
}
