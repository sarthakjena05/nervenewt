import { DeviceProvider } from "./DeviceProvider.js";
// Future adapter: emit normalized frames/events after decoding real Muse samples.
export class MuseProvider extends DeviceProvider {
  id = "muse";
  connect() {
    throw new Error(
      "Muse 2 hardware support is coming soon. Use the simulator.",
    );
  }
  disconnect() {}
}
