import React from "react";
const FAQ_ITEMS = [
  {
    q: "Is NerveNewt available to use yet",
    a: "You can try the browser demo today, with simulated signals or a Muse 2. The broader platform is in development. Request early access if you'd like to build with us.",
  },
  {
    q: "Do you make a headset",
    a: "No. NerveNewt is a software layer, not hardware. The goal is to work with biosensing devices that already exist, not to build another one.",
  },
  {
    q: "What hardware will it support",
    a: "We're actively prototyping with the Muse 2 and expanding toward OpenBCI, with EMG and ECG on our roadmap. Request early access above if you're building with a specific device.",
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
