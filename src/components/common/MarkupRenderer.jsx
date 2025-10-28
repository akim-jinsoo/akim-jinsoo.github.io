import React from "react";

// Simple markup renderer for project detail pages.
// Supported directives:
// /section Title            -> <h2>
// /subsection Title         -> <h3>
// /list                     -> begin ordered list block
// /endlist                  -> end ordered list block
// /bullet                   -> begin unordered list block
// /endbullet                -> end unordered list block
// list lines use indentation (tabs or 2 spaces) for nesting
// /image URL [opt1,opt2]    -> image box, opts: aspect=16:9, height=300, crop=center
// /video URL [caption]      -> video element with optional caption text
// /caption Text[, italic]   -> caption rendered beneath previous image (or standalone)

const buildNestedFromLines = (lines) => {
  const root = [];
  const stack = [{ level: -1, children: root }];

  lines.forEach(({ level, text }) => {
    const node = { text, children: [] };
    while (stack.length && level <= stack[stack.length - 1].level) stack.pop();
    stack[stack.length - 1].children.push(node);
    stack.push({ level, children: node.children });
  });

  return root;
};

const renderNestedList = (items, level = 0, ordered = true, keyPrefix = "") => {
  if (!items || !items.length) return null;
  const olTypes = ["decimal", "lower-alpha", "lower-roman"];
  const ulTypes = ["disc", "circle", "square"];
  const Tag = ordered ? "ol" : "ul";
  const style = { listStyleType: ordered ? olTypes[level % olTypes.length] : ulTypes[level % ulTypes.length], paddingLeft: 20 };
  return (
    <Tag style={style} key={`${keyPrefix}L${level}`}>
      {items.map((it, idx) => (
        <li key={`${keyPrefix}L${level}-I${idx}`}>
          {it.text}
          {it.children && it.children.length ? renderNestedList(it.children, level + 1, ordered, `${keyPrefix}${idx}-`) : null}
        </li>
      ))}
    </Tag>
  );
};

const parseToNodes = (content = "") => {
  const lines = content.split(/\r?\n/);
  const nodes = [];
  let inList = null;
  let listItems = [];

  const flushList = () => {
    if (!inList) return;
    const nested = buildNestedFromLines(listItems);
    nodes.push({ type: inList === "ordered" ? "olist" : "ulist", items: nested });
    inList = null;
    listItems = [];
  };

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushList();
      nodes.push({ type: "br" });
      continue;
    }

    if (line.startsWith("/section ")) {
      flushList();
      nodes.push({ type: "h2", text: line.replace(/^\/section\s+/, "") });
      continue;
    }
    if (line.startsWith("/subsection ")) {
      flushList();
      nodes.push({ type: "h3", text: line.replace(/^\/subsection\s+/, "") });
      continue;
    }

    if (line === "/list") {
      flushList();
      inList = "ordered";
      listItems = [];
      continue;
    }
    if (line === "/endlist") {
      flushList();
      continue;
    }
    if (line === "/bullet") {
      flushList();
      inList = "bullet";
      listItems = [];
      continue;
    }
    if (line === "/endbullet") {
      flushList();
      continue;
    }

    if (line.startsWith("/image ")) {
      flushList();
      const m = rawLine.match(/^\/image\s+(\S+)(?:\s+(.+))?$/);
      if (m) {
        const url = m[1];
        const optsRaw = (m[2] || "").trim();
        let aspect = null;
        let height = null;
        let crop = null;
        if (optsRaw) {
          const opts = optsRaw.split(",").map((s) => s.trim()).filter(Boolean);
          opts.forEach((o) => {
            const [k, v] = o.split(/=\s*/).map((s) => s.trim());
            if (!v && k.match(/^\d+[:\\/]\d+$/)) aspect = k;
            else if (k.toLowerCase() === "aspect") aspect = v || null;
            else if (k.toLowerCase() === "height") {
              const n = parseInt(v || k, 10);
              if (!Number.isNaN(n)) height = n;
            } else if (k.toLowerCase() === "crop") crop = v || null;
          });
        }
        nodes.push({ type: "image", url, aspect, height, crop });
        continue;
      }
    }

    if (line.startsWith("/video ")) {
      flushList();
      const m = rawLine.match(/^\/video\s+(\S+)(?:\s+(.+))?$/);
      if (m) {
        nodes.push({ type: "video", url: m[1], caption: m[2] ? m[2].trim() : "" });
        continue;
      }
    }

    if (line.startsWith("/caption ")) {
      flushList();
      const m = rawLine.match(/^\/caption\s+(.+)$/);
      if (m) {
        let rest = m[1].trim();
        let captionText = "";
        let italic = false;
        if (rest.startsWith('"') || rest.startsWith("'")) {
          const quote = rest[0];
          const endIdx = rest.indexOf(quote, 1);
          if (endIdx > 0) {
            captionText = rest.slice(1, endIdx);
            rest = rest.slice(endIdx + 1).trim();
          } else {
            captionText = rest.slice(1);
            rest = "";
          }
        } else {
          const parts = rest.split(",");
          captionText = parts.shift().trim();
          rest = parts.join(",").trim();
        }
        if (rest) {
          const opts = rest.split(",").map((s) => s.trim()).filter(Boolean);
          opts.forEach((o) => {
            if (o.toLowerCase() === "italic" || o.toLowerCase() === "italic=true" || o === "1") italic = true;
          });
        }
        nodes.push({ type: "caption", text: captionText, italic });
        continue;
      }
    }

    if (inList === "ordered" || inList === "bullet") {
      const leading = rawLine.match(/^[\t ]*/)[0];
      const tabCount = (leading.match(/\t/g) || []).length;
      const spaceCount = (leading.match(/ /g) || []).length;
      const level = tabCount + Math.floor(spaceCount / 2);
      const text = rawLine.trim();
      listItems.push({ level, text });
      continue;
    }

    flushList();
    nodes.push({ type: "p", text: rawLine });
  }

  flushList();
  return nodes;
};

const resolveMediaUrl = (url) => {
  if (!url) return url;
  if (/^\w+:\/\//.test(url) || url.startsWith("/")) return url;
  return "/" + url.replace(/^(?:\.\/|\.\.\/)+/, "");
};

const MarkupRenderer = ({ content }) => {
  const nodes = parseToNodes(content || "");
  const out = [];

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const key = `node-${i}`;
    switch (node.type) {
      case "h2":
        out.push(
          <h2 key={key} className="markup-section">
            {node.text}
          </h2>
        );
        break;
      case "h3":
        out.push(
          <h3 key={key} className="markup-subsection">
            {node.text}
          </h3>
        );
        break;
      case "olist":
        out.push(
          <div key={key} className="markup-olist">
            {renderNestedList(node.items, 0, true, `olist-${i}-`)}
          </div>
        );
        break;
      case "ulist":
        out.push(
          <div key={key} className="markup-ulist">
            {renderNestedList(node.items, 0, false, `ulist-${i}-`)}
          </div>
        );
        break;
      case "image": {
        const src = resolveMediaUrl(node.url);
        const aspect = node.aspect || null;
        const height = node.height || null;
        const crop = (node.crop || "center").toLowerCase();

        const cropMap = {
          center: "50% 50%",
          top: "50% 0%",
          bottom: "50% 100%",
          left: "0% 50%",
          right: "100% 50%",
        };
        const objectPosition = cropMap[crop] || crop;

        const wrapperStyle = {
          width: "100%",
          overflow: "hidden",
          borderRadius: 8,
          position: "relative",
          background: "#eee",
        };

        if (aspect) {
          const parts = aspect.split(/[:\\/]/).map((s) => parseFloat(s));
          if (parts.length === 2 && parts.every((n) => !Number.isNaN(n) && n > 0)) {
            const [w, h] = parts;
            // Use modern CSS aspect-ratio when available
            wrapperStyle.aspectRatio = `${w} / ${h}`;
            // If height is provided, treat it as a cap (maxHeight) and allow the box to shrink
            // by not forcing width:100% so the computed width can reduce to respect the cap.
            if (height) {
              wrapperStyle.maxHeight = `${height}px`;
              wrapperStyle.maxWidth = "100%";
              wrapperStyle.width = "auto";
              wrapperStyle.margin = "0 auto";
            } else {
              // normal: fill available width
              wrapperStyle.width = "100%";
            }
          } else {
            // fallback default aspect
            wrapperStyle.aspectRatio = "16 / 9";
            if (height) {
              wrapperStyle.maxHeight = `${height}px`;
              wrapperStyle.maxWidth = "100%";
              wrapperStyle.width = "auto";
              wrapperStyle.margin = "0 auto";
            } else {
              wrapperStyle.width = "100%";
            }
          }
        } else if (height) {
          // No aspect specified: use a fixed height container and full width
          wrapperStyle.height = `${height}px`;
          wrapperStyle.width = "100%";
        } else {
          // default aspect 16:9
          wrapperStyle.aspectRatio = "16 / 9";
          wrapperStyle.width = "100%";
        }

        // Use a background-image container so the photo responsively fills and crops
        // the box (background-size: cover) — this makes cropping and aspect changes
        // behave consistently when width or maxHeight change.
        const bgStyle = {
          ...wrapperStyle,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: objectPosition,
          backgroundRepeat: "no-repeat",
        };

        out.push(<div key={key} className="markup-image" style={bgStyle} role="img" aria-label={""} />);

        // If the next node is a caption, render it directly under the image and skip it
        if (i + 1 < nodes.length && nodes[i + 1].type === "caption") {
          const cap = nodes[i + 1];
          out.push(
            <div key={`${key}-cap`} className="markup-image-caption" style={{ marginTop: 8, color: "#555", textAlign: "center", fontSize: "0.9em" }}>
              {cap.italic ? <em>{cap.text}</em> : cap.text}
            </div>
          );
          i++; // skip caption node
        }

        break;
      }
      case "video":
        out.push(
          <div key={key} className="markup-video">
            <video controls src={resolveMediaUrl(node.url)} style={{ width: "100%", borderRadius: 8 }} />
            {node.caption ? <div className="video-caption">{node.caption}</div> : null}
          </div>
        );
        break;
      case "p":
        out.push(
          <p key={key} className="markup-paragraph">
            {node.text}
          </p>
        );
        break;
      case "br":
        out.push(<div key={key} style={{ height: 12 }} />);
        break;
      case "caption":
        // standalone caption (no preceding image) — render as muted paragraph
        out.push(
          <div key={key} className="markup-image-caption" style={{ marginTop: 8, color: "#555", textAlign: "center", fontSize: "0.9em" }}>
            {node.italic ? <em>{node.text}</em> : node.text}
          </div>
        );
        break;
      default:
        break;
    }
  }

  return <div className="markup-renderer">{out}</div>;
};

export default MarkupRenderer;

