import React from "react";
const FAQ_ITEMS = [
  {
    q: "Is NerveNewt available to use yet",
    a: "Not publicly. We're early and currently prototyping the interface with consumer EEG hardware like Muse 2. What's on this page is the direction, not a shipped product.",
  },
  {
    q: "Do you make a headset",
    a: "No. NerveNewt is a software layer, not hardware. The goal is to work with biosensing devices that already exist, not to build another one.",
  },
  {
    q: "What hardware will it support",
    a: "We're starting with EEG and designing toward EMG, ECG, and EOG. Support is planned, not guaranteed for any specific device yet.",
  },
  {
    q: "Is this reading my thoughts or emotions",
    a: "No. NerveNewt standardizes measurable signals like alpha band power or a detected blink into events. It doesn't infer thoughts, moods, or mental states.",
  },
  {
    q: "Who is this for",
    a: "Developers building applications on top of biosignal hardware, not consumers looking for an end user app.",
  },
];

export default function FAQ() {
  return (
    <section className="faq section" aria-labelledby="faq-title">
      <h2 id="faq-title">Questions, answered.</h2>
      <div className="faq-list">
        {FAQ_ITEMS.map((item) => (
          <details key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
