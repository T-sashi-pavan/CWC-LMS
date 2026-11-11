"""Turn the roadmap .docx files into structured JSON.

The 11 documents come in two layouts and this reads both:
  A) "Phase 1: Title" headings, modules are Heading 2, "Practical Project / Lab:" and "Phase Outcome:" lines.
  B) numbered sections ("1. Program Overview") and "PHASE 1: TITLE" headings, "Module n:" Heading 2s and a
     "Practical Projects" bullet list.
No third-party dependency: a .docx is a zip with word/document.xml.
"""
import re
import zipfile
from xml.etree import ElementTree as ET

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"

PHASE_RE = re.compile(r"^phase\s*(\d+)\s*[:\-–—.]\s*(.+)$", re.I)
LEADING_NO = re.compile(r"^\d+\s*[.)]\s*")
KV_RE = re.compile(r"^([A-Za-z][A-Za-z /&\-]{1,40}):\s+(.+)$")


def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.replace(" ", " ")).strip()


def read_blocks(path):
    """Body in document order: ('Heading1'|'Heading2'|'ListBullet'|'', text) and ('TABLE', rows)."""
    root = ET.fromstring(zipfile.ZipFile(path).read("word/document.xml"))
    blocks = []
    for ch in root.find(W + "body"):
        if ch.tag == W + "p":
            st = ch.find(f"{W}pPr/{W}pStyle")
            style = st.get(W + "val") if st is not None else ""
            text = _clean("".join(t.text or "" for t in ch.iter(W + "t")))
            if text:
                blocks.append((style, text))
        elif ch.tag == W + "tbl":
            rows = [[_clean("".join(t.text or "" for t in tc.iter(W + "t"))) for tc in tr.iter(W + "tc")]
                    for tr in ch.iter(W + "tr")]
            blocks.append(("TABLE", rows))
    return blocks


def _split_items(text):
    """'NumPy, Pandas; Scikit-learn' -> ['NumPy', 'Pandas', 'Scikit-learn'] (keeps '(a, b)' groups intact)."""
    out, depth, cur = [], 0, ""
    for ch in text:
        if ch in "([":
            depth += 1
        elif ch in ")]":
            depth = max(0, depth - 1)
        if ch in ",;" and depth == 0:
            if cur.strip():
                out.append(cur.strip())
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur.strip())
    return out


def _table(rows):
    """First column = category, the rest = items."""
    items = []
    for r in rows[1:] if len(rows) > 1 else rows:
        if len(r) >= 2 and r[0]:
            items.append({"category": r[0], "items": _split_items(" ".join(r[1:]))})
    return items


def _bullets_and_paras(blocks):
    bullets = [t for s, t in blocks if s == "ListBullet"]
    paras = [t for s, t in blocks if s == "" and isinstance(t, str)]
    return paras, bullets


def _kv(text):
    m = KV_RE.match(text)
    return (m[1].strip(), m[2].strip()) if m else (None, text)


def _parse_phase(n, title, blocks):
    phase = {"n": n, "title": title.strip(), "objective": "", "modules": [], "lab": "", "projects": [], "outcome": ""}
    module = None
    for style, text in blocks:
        if style == "Heading2":
            low = text.lower()
            if low.startswith("practical project"):          # layout B: list of projects
                module = {"title": text, "_projects": True, "bullets": []}
            else:
                module = {"title": re.sub(r"^module\s*\d+\s*[:\-–]\s*", "", text, flags=re.I), "bullets": []}
            phase["modules"].append(module)
        elif style == "ListBullet":
            if module is not None:
                module["bullets"].append(text)
        elif style == "" and isinstance(text, str):
            low = text.lower()
            if low.startswith("phase outcome"):
                phase["outcome"] = text.split(":", 1)[1].strip()
            elif low.startswith("practical project"):        # layout A: single lab paragraph
                phase["lab"] = text.split(":", 1)[1].strip()
            elif low.startswith("objective"):
                phase["objective"] = text.split(":", 1)[1].strip()
            elif not phase["objective"]:
                phase["objective"] = text
    # move the layout-B "Practical Projects" pseudo-module into phase.projects
    keep = []
    for m in phase["modules"]:
        if m.pop("_projects", False):
            phase["projects"] = m["bullets"]
        else:
            keep.append(m)
    phase["modules"] = keep
    return phase


def parse_roadmap(path):
    blocks = read_blocks(path)
    # header = everything before the first Heading 1
    first_h1 = next((i for i, (s, _) in enumerate(blocks) if s == "Heading1"), len(blocks))
    head = [t for s, t in blocks[:first_h1] if s == "" and isinstance(t, str)]
    title_lines = head[:2]
    intro = head[2:]
    meta_line = next((t for t in intro if "|" in t), "")
    summary = next((t for t in intro if "|" not in t and t.upper() != t and len(t) > 40), "")

    # group by Heading 1
    sections, cur = [], None
    for s, t in blocks[first_h1:]:
        if s == "Heading1":
            cur = {"title": t, "blocks": []}
            sections.append(cur)
        elif cur is not None:
            cur["blocks"].append((s, t))

    data = {
        "title_lines": title_lines, "meta_line": meta_line, "summary": summary,
        "facts": [], "overview": [], "target_role": {"title": "", "text": "", "competencies": []},
        "phases": [], "tech_stack": [], "projects": [], "methodology": [], "assessment": [],
        "skills": [], "careers": [], "goal": "", "extras": [],
    }

    for sec in sections:
        raw = sec["title"]
        name = LEADING_NO.sub("", raw).strip()
        low = name.lower()
        blk = sec["blocks"]
        pm = PHASE_RE.match(name)
        if pm:
            data["phases"].append(_parse_phase(int(pm[1]), pm[2], blk))
        elif "program overview" in low:
            sub = None
            for s, t in blk:
                if s == "Heading2":
                    sub = {"title": t, "paras": [], "bullets": []}
                    if low and t.lower().startswith("target role"):
                        data["target_role"]["title"] = t.split(":", 1)[-1].strip()
                    continue
                if s == "ListBullet":
                    if sub and sub["title"].lower().startswith("core competenc"):
                        data["target_role"]["competencies"].append(t)
                    elif sub:
                        sub["bullets"].append(t)
                elif s == "" and isinstance(t, str):
                    if sub is None:
                        k, v = _kv(t)
                        (data["facts"].append({"label": k, "text": v}) if k else data["overview"].append(t))
                    elif sub["title"].lower().startswith("target role"):
                        data["target_role"]["text"] = t
                    elif sub["title"].lower().startswith("core competenc"):
                        pass
                    else:
                        data["overview"].append(t)
        elif "role definition" in low or "core competencies" in low:
            paras, bullets = _bullets_and_paras(blk)
            data["target_role"]["text"] = " ".join(paras)
            data["target_role"]["competencies"] += bullets
        elif "technology stack" in low and "recommended" in low or low == "complete technology stack":
            for s, t in blk:
                if s == "TABLE":
                    data["tech_stack"] += _table(t)
        elif "portfolio project" in low:
            for s, t in blk:
                if s in ("ListBullet", ""):
                    k, v = _kv(t) if isinstance(t, str) else (None, "")
                    if isinstance(t, str):
                        data["projects"].append({"title": k or t, "text": v if k else ""})
        elif "learning methodology" in low:
            data["methodology"] += [t for s, t in blk if s in ("ListBullet", "") and isinstance(t, str)]
        elif "assessment" in low or "evaluation" in low:
            for s, t in blk:
                if s == "TABLE":   # layout B: "Evaluation Component | Weightage"
                    data["assessment"] += [f"{r[0]} — {r[1]}" for r in t[1:] if len(r) >= 2 and r[0]]
                elif s in ("ListBullet", "") and isinstance(t, str):
                    data["assessment"].append(t)
        elif "expected skills" in low:
            data["skills"] += [t for s, t in blk if s == "ListBullet"]
        elif "career opportunities" in low:
            data["careers"] += [t for s, t in blk if s == "ListBullet"]
        elif "final program goal" in low:
            data["goal"] = " ".join(t for s, t in blk if s == "" and isinstance(t, str))
        elif "complete curriculum" in low and not blk:
            continue
        else:  # anything else (e.g. Cross-Cloud Service Mapping) is kept so no content is lost
            extra = {"title": name, "paras": [], "bullets": [], "tables": []}
            for s, t in blk:
                if s == "TABLE":
                    extra["tables"].append(t)
                elif s == "ListBullet":
                    extra["bullets"].append(t)
                elif s == "Heading2":
                    extra["paras"].append(t)
                elif isinstance(t, str):
                    extra["paras"].append(t)
            data["extras"].append(extra)

    if not data["summary"] and data["overview"]:   # e.g. Automation has no one-line description
        first = data["overview"][0]
        data["summary"] = first if len(first) <= 220 else first[:220].rsplit(" ", 1)[0] + "..."

    # derived counts
    data["phase_count"] = len(data["phases"])
    data["lab_count"] = sum(1 for p in data["phases"] if p["lab"] or p["projects"])
    data["module_count"] = sum(len(p["modules"]) for p in data["phases"])
    return data
