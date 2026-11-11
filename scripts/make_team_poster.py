"""Design the welcome pop-up poster: Chaitanya sir in the centre, the students around him.

    python scripts/make_team_poster.py            # -> frontend/public/greetings/chaitanya-and-students.webp

This is a designed collage of REAL photos (not an AI image): brand/chaitanya-portrait.png in the middle and the
student headshots from frontend/public/students around him. To use a real group photo instead, drop it in
frontend/public/greetings/ and point the entry in frontend/src/data/greetings.js at it.
A bigger portrait (at least 600 x 600 px) makes the centre photo sharper than the 160 px one we started with.
"""
import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "frontend" / "public" / "greetings" / "chaitanya-and-students.webp"
PORTRAIT = ROOT / "brand" / "chaitanya-portrait.png"
STUDENTS = sorted((ROOT / "frontend" / "public" / "students").glob("*.webp"))
LOGO = ROOT / "brand" / "png" / "cwc-logo-horizontal-light.png"
FONT_B = r"C:\Windows\Fonts\segoeuib.ttf"
FONT_K = r"C:\Windows\Fonts\seguibl.ttf"

S = 2                       # draw at 2x, then shrink: smooth circle edges
W = H = 1080 * S
CREAM, PAPER, INK = (244, 237, 225), (251, 248, 243), (27, 24, 21)
ORANGE, ORANGE_D, GOLD = (200, 90, 18), (162, 69, 12), (232, 160, 58)


def font(path, size):
    return ImageFont.truetype(path, size * S)


def circle_photo(path, d, border=6, ring=(255, 255, 255)):
    """Square-cropped photo (face-biased) cut to a circle with a coloured ring."""
    d *= S
    im = Image.open(path).convert("RGB")
    im = ImageOps.fit(im, (d, d), Image.LANCZOS, centering=(0.5, 0.3))
    mask = Image.new("L", (d * 2, d * 2), 0)
    ImageDraw.Draw(mask).ellipse((0, 0, d * 2 - 1, d * 2 - 1), fill=255)
    mask = mask.resize((d, d), Image.LANCZOS)
    b = border * S
    out = Image.new("RGBA", (d + 2 * b, d + 2 * b), (0, 0, 0, 0))
    rm = Image.new("L", (out.width * 2, out.height * 2), 0)
    ImageDraw.Draw(rm).ellipse((0, 0, out.width * 2 - 1, out.height * 2 - 1), fill=255)
    out.paste(Image.new("RGBA", out.size, ring + (255,)), (0, 0), rm.resize(out.size, Image.LANCZOS))
    out.paste(im, (b, b), mask)
    return out


def soft_ellipse(canvas, box, color, blur, alpha=255):
    """Blurred ellipse in a solid colour: blur the mask, not the colour, so there are no dark edges."""
    m = Image.new("L", canvas.size, 0)
    ImageDraw.Draw(m).ellipse(box, fill=alpha)
    m = m.filter(ImageFilter.GaussianBlur(blur * S))
    canvas.paste(Image.new("RGB", canvas.size, color), (0, 0), m)


def shadow(canvas, box, blur=18, alpha=70, dy=10):
    x0, y0, x1, y1 = box
    soft_ellipse(canvas, (x0, y0 + dy * S, x1, y1 + dy * S), (120, 70, 25), blur, alpha)


def sparkle(d, cx, cy, r, fill):
    pts = []
    for i in range(8):
        a = math.pi / 4 * i - math.pi / 2
        rad = r if i % 2 == 0 else r * 0.28
        pts.append((cx + rad * math.cos(a), cy + rad * math.sin(a)))
    d.polygon(pts, fill=fill)


def centred(d, y, text, fnt, fill, spacing=0):
    w = d.textlength(text, font=fnt) + spacing * (len(text) - 1) * S
    x = (W - w) / 2
    if not spacing:
        d.text((x, y), text, font=fnt, fill=fill)
        return
    for ch in text:
        d.text((x, y), ch, font=fnt, fill=fill)
        x += d.textlength(ch, font=fnt) + spacing * S


def main():
    cv = Image.new("RGB", (W, H), CREAM)

    # soft light in the middle
    soft_ellipse(cv, (W * 0.10, H * 0.18, W * 0.90, H * 0.96), PAPER, 90)

    # corner blobs, like the festival posters
    d = ImageDraw.Draw(cv)
    d.ellipse((-330 * S, -330 * S, 250 * S, 190 * S), fill=GOLD)
    d.ellipse((-330 * S, -330 * S, 170 * S, 120 * S), fill=ORANGE)
    d.ellipse((860 * S, 880 * S, 1420 * S, 1420 * S), fill=GOLD)
    d.ellipse((930 * S, 940 * S, 1400 * S, 1400 * S), fill=ORANGE)

    # faint dots
    rnd = random.Random(7)
    for gx in range(0, 1080, 36):
        for gy in range(0, 1080, 36):
            d.ellipse(((gx - 1.2) * S, (gy - 1.2) * S, (gx + 1.2) * S, (gy + 1.2) * S), fill=(222, 208, 184))

    cx, cy, R = 540 * S, 590 * S, 322 * S

    # orbit line behind the students
    for k in range(120):
        a0, a1 = 2 * math.pi * k / 120, 2 * math.pi * (k + 0.55) / 120
        d.line([(cx + R * math.cos(a0), cy + R * math.sin(a0)), (cx + R * math.cos(a1), cy + R * math.sin(a1))], fill=GOLD, width=3 * S)

    # students around Chaitanya sir
    n = len(STUDENTS)
    start = -math.pi / 2 + math.pi / n          # first student just right of the top
    sizes = [118, 104]
    spots = []
    for i, p in enumerate(STUDENTS):
        a = start + 2 * math.pi * i / n
        dia = sizes[i % 2]
        ph = circle_photo(p, dia, border=6, ring=(255, 255, 255))
        x, y = int(cx + R * math.cos(a) - ph.width / 2), int(cy + R * math.sin(a) - ph.height / 2)
        shadow(cv, (x, y, x + ph.width, y + ph.height), blur=10, alpha=80, dy=6)
        cv.paste(ph, (x, y), ph)
        spots.append((x + ph.width / 2, y + ph.height / 2, ph.width / 2))

    # Chaitanya sir in the middle: glow, orange ring, portrait
    big = 232
    soft_ellipse(cv, (cx - 185 * S, cy - 185 * S, cx + 185 * S, cy + 185 * S), GOLD, 42, 190)
    ring = circle_photo(PORTRAIT, big, border=12, ring=ORANGE)
    # soften the upscaled 160 px source a touch less harshly
    x, y = int(cx - ring.width / 2), int(cy - ring.height / 2 - 14 * S)
    shadow(cv, (x, y, x + ring.width, y + ring.height), blur=16, alpha=110, dy=12)
    cv.paste(ring, (x, y), ring)
    d = ImageDraw.Draw(cv)

    # name pill
    pf = font(FONT_B, 30)
    name = "Chaitanya Sir"
    tw = d.textlength(name, font=pf)
    pw, ph_ = tw + 64 * S, 56 * S
    px, py = cx - pw / 2, y + ring.height - 20 * S
    d.rounded_rectangle((px, py + 6 * S, px + pw, py + ph_ + 6 * S), radius=ph_ / 2, fill=(205, 170, 120))
    d.rounded_rectangle((px, py, px + pw, py + ph_), radius=ph_ / 2, fill=INK)
    d.text((cx - tw / 2, py + 8 * S), name, font=pf, fill=(255, 247, 236))

    # sparkles in free corners of the ring
    for _ in range(60):
        sx, sy = rnd.randint(30, 1050) * S, rnd.randint(190, 1000) * S
        if any((sx - px_) ** 2 + (sy - py_) ** 2 < (pr + 22 * S) ** 2 for px_, py_, pr in spots):
            continue
        if (sx - cx) ** 2 + (sy - cy) ** 2 < (R + 80 * S) ** 2:
            continue
        sparkle(d, sx, sy, rnd.choice([9, 12, 16]) * S, rnd.choice([ORANGE, GOLD, GOLD]))

    # heading
    centred(d, 40 * S, "CAREER WITH CHAITANYA", font(FONT_B, 20), ORANGE_D, spacing=5)
    centred(d, 72 * S, "Guided by Chaitanya.", font(FONT_K, 60), INK)
    centred(d, 134 * S, "Succeeding together.", font(FONT_K, 60), ORANGE)

    # footer: tagline + logo
    centred(d, 1006 * S, "Learn.  Practise.  Get hired.  Together.", font(FONT_B, 28), INK)

    img = cv.resize((1080, 1080), Image.LANCZOS)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "WEBP", quality=88, method=6)
    print(f"{n} students around Chaitanya sir -> {OUT.relative_to(ROOT)} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
