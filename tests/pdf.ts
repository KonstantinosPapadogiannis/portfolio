import { inflateSync } from "node:zlib";

// Just enough of a PDF reader for the CV that cv/build.sh writes: plain
// objects (no object streams), Flate content streams and Type0 fonts with
// ToUnicode maps. It reads the text in drawing order, the link targets and
// the document information, so tests can check what the file says without a
// PDF library.

type PdfObject = { dict: string; stream?: Buffer };

function readObjects(file: Buffer) {
  const source = file.toString("latin1");
  const objects = new Map<number, PdfObject>();
  const header = /(?:^|\s)(\d+) 0 obj\b/g;
  for (let match; (match = header.exec(source)); ) {
    const start = match.index + match[0].length;
    const end = source.indexOf("endobj", start);
    // Resume after the object, so stream data is never read as objects.
    header.lastIndex = end;
    const body = source.slice(start, end);
    const streamAt = body.search(/stream\r?\n/);
    if (streamAt === -1) {
      objects.set(Number(match[1]), { dict: body.trim() });
      continue;
    }
    const dict = body.slice(0, streamAt);
    const length = Number(/\/Length (\d+)/.exec(dict)?.[1]);
    const dataStart = start + streamAt + body.slice(streamAt).indexOf("\n") + 1;
    let data = file.subarray(dataStart, dataStart + length);
    if (dict.includes("/FlateDecode")) data = inflateSync(data);
    objects.set(Number(match[1]), { dict, stream: data });
  }
  return { source, objects };
}

const utf16 = (hex: string) =>
  Buffer.from(hex, "hex").swap16().toString("utf16le");

function readToUnicode(cmap: string) {
  const map = new Map<number, string>();
  for (const block of cmap.matchAll(/beginbfchar([\s\S]*?)endbfchar/g)) {
    for (const [, code, text] of block[1].matchAll(/<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>/g)) {
      map.set(parseInt(code, 16), utf16(text));
    }
  }
  for (const block of cmap.matchAll(/beginbfrange([\s\S]*?)endbfrange/g)) {
    for (const [, low, high, target] of block[1].matchAll(
      /<([0-9A-Fa-f]+)>\s*<([0-9A-Fa-f]+)>\s*(<[0-9A-Fa-f]+>|\[[^\]]*\])/g,
    )) {
      const first = parseInt(low, 16);
      const last = parseInt(high, 16);
      const targets = target.startsWith("[")
        ? [...target.matchAll(/<([0-9A-Fa-f]+)>/g)].map((t) => utf16(t[1]))
        : null;
      for (let code = first; code <= last; code++) {
        if (targets) {
          map.set(code, targets[code - first] ?? "");
        } else {
          const base = Buffer.from(target.slice(1, -1), "hex");
          base.writeUInt16BE(base.readUInt16BE(base.length - 2) + code - first, base.length - 2);
          map.set(code, utf16(base.toString("hex")));
        }
      }
    }
  }
  return map;
}

const ref = (dict: string, key: string) =>
  Number(new RegExp(`/${key}\\s+(\\d+) 0 R`).exec(dict)?.[1]);

// A literal PDF string, as the document information and link targets use it:
// backslash escapes, octal codes and, behind a byte-order mark, UTF-16.
function decodeLiteral(raw: string) {
  const bytes: number[] = [];
  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    if (char !== "\\") {
      bytes.push(char.charCodeAt(0));
      continue;
    }
    const octal = /^[0-7]{1,3}/.exec(raw.slice(i + 1));
    if (octal) {
      bytes.push(parseInt(octal[0], 8));
      i += octal[0].length;
    } else {
      const next = raw[++i];
      const escapes: Record<string, number> = { n: 10, r: 13, t: 9, b: 8, f: 12 };
      bytes.push(escapes[next] ?? next.charCodeAt(0));
    }
  }
  const buffer = Buffer.from(bytes);
  return buffer[0] === 0xfe && buffer[1] === 0xff
    ? buffer.subarray(2).swap16().toString("utf16le")
    : buffer.toString("latin1");
}

export function readPdf(file: Buffer) {
  const { source, objects } = readObjects(file);

  const pages = [...objects.values()].filter((o) => /\/Type\s*\/Page\b/.test(o.dict));
  const lines: string[] = [];
  for (const page of pages) {
    const resources = objects.get(ref(page.dict, "Resources"))?.dict ?? "";
    const fontList = /\/Font\s*<<([^>]*)>>/.exec(resources)?.[1] ?? "";
    const fonts = new Map<string, Map<number, string>>();
    for (const [, name, id] of fontList.matchAll(/\/(\S+)\s+(\d+) 0 R/g)) {
      const cmap = objects.get(ref(objects.get(Number(id))?.dict ?? "", "ToUnicode"));
      fonts.set(name, cmap?.stream ? readToUnicode(cmap.stream.toString("latin1")) : new Map());
    }

    const content = objects.get(ref(page.dict, "Contents"))?.stream?.toString("latin1") ?? "";
    let font = new Map<number, string>();
    let line = "";
    let lastY: number | null = null;
    // Marked content with an ActualText replaces what it draws (the icons
    // carry an empty one); depth counts nested marked content inside it.
    let replaced = -1;
    let depth = 0;
    const tokens = content.matchAll(
      /\/(\S+)\s+[\d.]+\s+Tf|[\d.-]+\s+[\d.-]+\s+[\d.-]+\s+[\d.-]+\s+[\d.-]+\s+([\d.-]+)\s+Tm|\[((?:<[0-9A-Fa-f]*>|[\s\d.-])*)\]\s*TJ|<([0-9A-Fa-f]*)>\s*Tj|\/ActualText\s*\(((?:\\.|[^\\)])*)\)\s*>>\s*BDC|\bBDC\b|\bBMC\b|\bEMC\b/g,
    );
    const show = (hex: string) => {
      for (let i = 0; i + 4 <= hex.length; i += 4) line += font.get(parseInt(hex.slice(i, i + 4), 16)) ?? "";
    };
    for (const token of tokens) {
      const [text, fontName, y, array, single, actualText] = token;
      if (fontName !== undefined) {
        font = fonts.get(fontName) ?? new Map();
      } else if (y !== undefined) {
        // A new line when the baseline moves; a gap between pieces of one line.
        if (lastY !== null && Math.abs(Number(y) - lastY) > 1) {
          lines.push(line);
          line = "";
        } else if (line) {
          line += " ";
        }
        lastY = Number(y);
      } else if (actualText !== undefined) {
        if (replaced === -1) {
          line += decodeLiteral(actualText);
          replaced = depth;
        }
        depth++;
      } else if (/^(BDC|BMC)$/.test(text)) {
        depth++;
      } else if (text === "EMC") {
        depth--;
        if (depth === replaced) replaced = -1;
      } else if (replaced === -1 && array !== undefined) {
        for (const [, hex, adjust] of array.matchAll(/<([0-9A-Fa-f]*)>|(-?[\d.]+)/g)) {
          // TeX writes each word space as a kern of about a fifth of an em;
          // kerning and letter spacing stay well under that.
          if (hex !== undefined) show(hex);
          else if (Number(adjust) < -120) line += " ";
        }
      } else if (replaced === -1 && single !== undefined) {
        show(single);
      }
    }
    lines.push(line);
  }

  const info = objects.get(ref(source.slice(source.lastIndexOf("trailer")), "Info"))?.dict ?? "";
  const information = Object.fromEntries(
    [...info.matchAll(/\/(\w+)\s*\(((?:\\.|[^\\)])*)\)/g)].map(([, key, value]) => [
      key,
      decodeLiteral(value),
    ]),
  );

  return {
    pages: pages.length,
    text: lines.map((l) => l.replace(/\s+/g, " ").trim()).join("\n"),
    links: [...source.matchAll(/\/URI\s*\(((?:\\.|[^\\)])*)\)/g)].map((m) => decodeLiteral(m[1])),
    information,
    raw: source,
  };
}
