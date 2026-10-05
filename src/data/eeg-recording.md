# Recorded EEG demo

The demo replays the first 60 seconds of AF7 from participant S001, eyes-open baseline S001R01, EEG Motor Movement/Imagery Dataset v1.0.0. This is a research EEG recording, not a Muse recording or a live participant. Original rate: 160 Hz. EDF physical scaling is preserved in microvolts; no generated waves, filtering, resampling, or interpolation is added to the samples. Playback loops after 60 seconds and clears the chart at the boundary.

Source: https://physionet.org/content/eegmmidb/1.0.0/
Original file: https://physionet.org/files/eegmmidb/1.0.0/S001/S001R01.edf
SHA-256: 4743b736131a7e147c150e8b37711029b6cda5e356c4b3e8261a03cdcaaf8b0c

Attribution: Schalk, G. (2009). EEG Motor Movement/Imagery Dataset (version 1.0.0). PhysioNet. https://doi.org/10.13026/C28G6P
BCI2000: Schalk et al., IEEE Transactions on Biomedical Engineering 51(6):1034–1043 (2004).

License: Open Data Commons Attribution License v1.0, https://opendatacommons.org/licenses/by/1-0/
This extracted channel is made available under the same attribution license. Retain this notice with the data.

Reproduce: node scripts/extract-eeg.mjs path/to/S001R01.edf

The game maps absolute voltage crossings above 60 µV to jumps, with a 700 ms debounce. This is an illustrative amplitude mapping, not a validated blink, focus, or eye-state detector. The chart automatically scales vertically to fit the visible samples and displays its microvolt range.
