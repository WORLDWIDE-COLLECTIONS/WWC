const messages = [
  "Worldwide Collection",
  "Free shipping over ₦150,000",
  "New season, new silhouettes",
  "Designed everywhere · worn anywhere",
  "MEN'S & WOMEN'S ESSENTIALS",
];

export function AnnouncementBar() {
  const track = [...messages, ...messages];

  return (
    <div className="overflow-hidden border-b border-ink bg-ink text-paper">
      <div className="flex w-max animate-marquee items-center py-2.5 will-change-transform">
        {track.map((message, index) => (
          <span
            key={`${message}-${index}`}
            className="eyebrow flex items-center gap-10 whitespace-nowrap pr-10 text-paper/80"
          >
            {message}
            <span aria-hidden="true" className="text-gilt-soft">
              ✦
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
