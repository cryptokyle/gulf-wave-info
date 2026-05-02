export default async () => {
  // NDBC latest obs file (rebuilt frequently)
  const upstream = "https://www.ndbc.noaa.gov/data/latest_obs/latest_obs.txt";

  try {
    const r = await fetch(upstream, {
      headers: {
        "User-Agent": "gulf-wave-buoy-viewer/1.0 (Netlify Function)",
      },
    });

    if (!r.ok) {
      return new Response("Upstream error fetching NDBC latest_obs.txt", { status: 502 });
    }

    const txt = await r.text();

    // Be polite to NDBC: cache a little so many users don't hammer them.
    // NDBC asks consumers to limit retrievals to a minimal level.
    return new Response(txt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (e) {
    return new Response(`Proxy failed: ${String(e)}`, { status: 500 });
  }
};
