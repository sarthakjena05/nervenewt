/*
 * Product demo video slot.
 * When the video is ready: put the file in /public (e.g. public/nervenewt-demo.mp4,
 * optionally a poster image) and set VIDEO_SRC / POSTER_SRC below.
 */
const VIDEO_SRC = "";
const POSTER_SRC = "";

export function DemoVideo() {
  return (
    <div className="mx-auto max-w-[960px]">
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-ink">
        {VIDEO_SRC ? (
          <video
            className="h-full w-full object-cover"
            src={VIDEO_SRC}
            poster={POSTER_SRC || undefined}
            controls
            playsInline
            preload="metadata"
          >
            NerveNewt product demo
          </video>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-center">
            <span aria-hidden className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20">
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-paper/80">
                <path d="M8 5.5v13l10.5-6.5z" />
              </svg>
            </span>
            <p className="text-[15px] font-medium text-paper">Product demo</p>
            <p className="font-mono text-[12px] tracking-wide text-white/50 uppercase">Video coming soon</p>
          </div>
        )}
      </div>
    </div>
  );
}
