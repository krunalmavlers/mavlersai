import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { createSupabaseAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

const ONE_YEAR = 'public, max-age=31536000, s-maxage=31536000, immutable';

// Raster types we can safely transcode/resize with sharp. SVG (scalable),
// animated GIF, and PDF are served untouched.
const TRANSCODABLE = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/tiff']);

type Fmt = 'webp' | 'avif' | 'png' | 'jpeg' | 'original';

const CTYPE: Record<Exclude<Fmt, 'original'>, string> = {
  webp: 'image/webp',
  avif: 'image/avif',
  png: 'image/png',
  jpeg: 'image/jpeg',
};

// Tuned for crisp edges on retina rather than smallest-possible bytes. 4:4:4
// chroma (below) matters most for coloured text, logos and UI screenshots,
// where the default 4:2:0 subsampling visibly smears edges.
const QUALITY: Record<Exclude<Fmt, 'original' | 'png'>, number> = {
  webp: 84,
  avif: 58,
  jpeg: 84,
};

function clampInt(raw: string | null, min: number, max: number): number | null {
  if (!raw) return null;
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n)) return null;
  return Math.min(max, Math.max(min, n));
}

/**
 * Serves media from the Supabase `media` bucket under our own domain
 * (https://mavlers.ai/images/...), transparently optimizing raster images:
 *
 *  - Negotiates next-gen formats (AVIF > WebP) from the Accept header, or an
 *    explicit `?fm=webp|avif|png|jpeg|original`.
 *  - Optional resize with `?w=<px>` (16–2048, never upscales).
 *  - Compresses with tuned per-format quality.
 *  - Hard, immutable CDN caching (uploaded filenames are uuid-unique).
 *
 * Storage stays in Supabase; only the public URL is rebranded and the bytes
 * are optimized on the way out.
 */
export async function GET(
  req: Request,
  { params }: { params: { path: string[] } },
) {
  const objectPath = (params.path || []).map(decodeURIComponent).join('/');
  if (!objectPath || objectPath.includes('..')) {
    return new NextResponse('Not found', { status: 404 });
  }

  const db = createSupabaseAdminClient();
  const { data, error } = await db.storage.from('media').download(objectPath);
  if (error || !data) {
    return new NextResponse('Not found', { status: 404 });
  }

  const sourceType = data.type || 'application/octet-stream';
  const input = Buffer.from(await data.arrayBuffer());

  // Non-raster (SVG/PDF/GIF/etc.) — serve as-is.
  if (!TRANSCODABLE.has(sourceType)) {
    return new NextResponse(input, {
      headers: { 'Content-Type': sourceType, 'Cache-Control': ONE_YEAR },
    });
  }

  const url = new URL(req.url);
  const accept = req.headers.get('accept') || '';
  const fmParam = url.searchParams.get('fm') as Fmt | null;

  let target: Fmt;
  if (fmParam && ['webp', 'avif', 'png', 'jpeg', 'original'].includes(fmParam)) {
    target = fmParam;
  } else if (accept.includes('image/avif')) {
    target = 'avif';
  } else if (accept.includes('image/webp')) {
    target = 'webp';
  } else {
    target = 'webp'; // sane default for the ~97% of clients that support it
  }

  const width = clampInt(url.searchParams.get('w'), 16, 2048);
  // `h` suits height-constrained art (logos rendered at a fixed height with
  // width:auto), where the caller can't know the aspect ratio up front.
  const height = clampInt(url.searchParams.get('h'), 16, 2048);
  const quality = clampInt(url.searchParams.get('q'), 30, 95);

  try {
    let pipeline = sharp(input, { animated: false }).rotate(); // honor EXIF orientation
    if (width || height) {
      // Lanczos downscale always softens a little. A mild unsharp restores the
      // edge definition, which is the difference between "resized" and "crisp"
      // once the result is shown at 2x on a retina panel.
      pipeline = pipeline
        .resize({
          width: width ?? undefined,
          height: height ?? undefined,
          fit: 'inside',
          withoutEnlargement: true,
          kernel: 'lanczos3',
        })
        .sharpen({ sigma: 0.6, m1: 0.4, m2: 0.8 });
    }

    let outType: string;
    if (target === 'original') {
      outType = sourceType;
    } else if (target === 'png') {
      // No `palette` — quantising to 256 colours bands gradients and haloes
      // anti-aliased edges, which reads as blurriness on a high-DPI screen.
      pipeline = pipeline.png({ compressionLevel: 9 });
      outType = CTYPE.png;
    } else if (target === 'jpeg') {
      pipeline = pipeline.jpeg({
        quality: quality ?? QUALITY.jpeg,
        mozjpeg: true,
        chromaSubsampling: '4:4:4',
      });
      outType = CTYPE.jpeg;
    } else if (target === 'avif') {
      pipeline = pipeline.avif({
        quality: quality ?? QUALITY.avif,
        chromaSubsampling: '4:4:4',
      });
      outType = CTYPE.avif;
    } else {
      pipeline = pipeline.webp({
        quality: quality ?? QUALITY.webp,
        smartSubsample: true,
      });
      outType = CTYPE.webp;
    }

    const output = new Uint8Array(await pipeline.toBuffer());
    return new NextResponse(output, {
      headers: {
        'Content-Type': outType,
        'Cache-Control': ONE_YEAR,
        Vary: 'Accept',
      },
    });
  } catch {
    // If sharp can't process it, fall back to the raw bytes.
    return new NextResponse(input, {
      headers: { 'Content-Type': sourceType, 'Cache-Control': ONE_YEAR },
    });
  }
}
