/** Providers emit normalized frames and semantic events; consumers never parse device packets. */
export class DeviceProvider {
  listeners = new Set();
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
  emit(message) {
    this.listeners.forEach((listener) => listener(message));
  }
  connect() {
    throw new Error("Provider must implement connect()");
  }
  disconnect() {
    throw new Error("Provider must implement disconnect()");
  }
}
