import React from "react";

// Markup renderer supporting directives:
// /section Title        -> <h2>
// /subsection Title     -> <h3>
// /list                 -> begin ordered list block
// /endlist              -> end ordered list block
// /bullet               -> begin bullet list block
// /endbullet            -> end bullet list block
// Lines inside list/bullet can be prefixed with tabs (\t) to indicate nesting.
// /image URL [alt text] -> <img>
// /video URL [caption]  -> <video controls>

const buildNestedFromLines = (lines) => {
  const root = [];
  const stack = [{ level: -1, children: root }];

  for (const item of lines) {
    const node = { text: item.text, children: [] };
    const level = item.level;

    while (stack.length && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(node);
    stack.push({ level, children: node.children });
  }

  return root;
};

const listStyleForLevel = (level, ordered = true) => {
  if (!ordered) {
    const styles = ["disc", "circle", "square"];
    return styles[level % styles.length];
  }
  const styles = ["decimal", "lower-alpha", "lower-roman", "lower-alpha"];
  return styles[level % styles.length];
};

const renderNestedList = (items, level = 0, ordered = true, keyPrefix = "") => {
  if (!items || items.length === 0) return null;
  const Tag = ordered ? "ol" : "ul";
  const listStyle = listStyleForLevel(level, ordered);
  return (
    <Tag key={keyPrefix + level} style={{ listStyleType: listStyle }}>
      {items.map((it, idx) => (
        <li key={`${keyPrefix}${level}-${idx}`}>
          {it.text}
          {it.children && it.children.length > 0 ? renderNestedList(it.children, level + 1, ordered, `${keyPrefix}${idx}-`) : null}
        </li>
      ))}
    </Tag>
  );
};

const parseToNodes = (content) => {
  if (!content) return [];
  const lines = content.split(/\r?\n/);
  const nodes = [];
  let inList = false; // false | 'ordered' | 'bullet'
  let listItems = [];

  const flushList = () => {
    if (inList && Array.isArray(listItems) && listItems.length > 0) {
      const nested = buildNestedFromLines(listItems);
      nodes.push({ type: inList === "ordered" ? "olist" : "ulist", items: nested });
      listItems = [];
      inList = false;
    }
  };

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") {
      flushList();
      nodes.push({ type: "br" });
      continue;
    }

    if (line.startsWith("/section ")) {
      flushList();
      nodes.push({ type: "h2", text: line.replace("/section ", "") });
      continue;
    }

    if (line.startsWith("/subsection ")) {
      flushList();
      nodes.push({ type: "h3", text: line.replace("/subsection ", "") });
      continue;
    }

    if (line === "/list") {
      flushList();
      inList = "ordered";
      listItems = [];
      continue;
    }

    if (line === "/endlist") {
      if (inList === "ordered") {
        const nested = buildNestedFromLines(listItems);
        nodes.push({ type: "olist", items: nested });
        listItems = [];
        inList = false;
      }
      continue;
    }

    if (line === "/bullet") {
      flushList();
      inList = "bullet";
      listItems = [];
      continue;
    }

    if (line === "/endbullet") {
      if (inList === "bullet") {
        const nested = buildNestedFromLines(listItems);
        nodes.push({ type: "ulist", items: nested });
        listItems = [];
        inList = false;
      }
      continue;
    }

    if (line.startsWith("/image ")) {
      flushList();
      const m = line.match(/^\/image\s+(\S+)(?:\s+(.+))?$/);
      if (m) {
        nodes.push({ type: "image", url: m[1], alt: m[2] || "" });
        continue;
      }
    }

    if (line.startsWith("/video ")) {
      flushList();
      const m = line.match(/^\/video\s+(\S+)(?:\s+(.+))?$/);
      if (m) {
        nodes.push({ type: "video", url: m[1], caption: m[2] || "" });
        continue;
      }
    }

    if (inList === "ordered" || inList === "bullet") {
      // Support both tabs and spaces for indentation. 2 spaces == 1 indent level.
      const leading = rawLine.match(/^[\t ]*/)[0];
      const tabCount = (leading.match(/\t/g) || []).length;
      const spaceCount = (leading.match(/ /g) || []).length;
      const level = tabCount + Math.floor(spaceCount / 2);
      const text = line;
      listItems.push({ level, text });
      continue;
    }

    // default paragraph
    flushList();
    nodes.push({ type: "p", text: line });
  }

  flushList();
  return nodes;
};

const MarkupRenderer = ({ content }) => {
  const nodes = parseToNodes(content);

  const resolveMediaUrl = (url) => {
    if (!url) return url;
    // If url is already absolute (starts with / or http), leave it.
    if (/^\w+:\/\//.test(url) || url.startsWith("/")) return url;
    // If url is relative like ./image.png or ../image.png, map to public root by stripping leading ./ or ../ segments
    // Accept one or more occurrences of "./" or "../" at the start and remove them.
    return "/" + url.replace(/^(?:\.\/|\.\.\/)+/, "");
  };

  return (
    <div className="markup-renderer">
      {nodes.map((node, idx) => {
        switch (node.type) {
          case "h2":
            return (
              <h2 key={idx} className="markup-section">
                {node.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={idx} className="markup-subsection">
                {node.text}
              </h3>
            );
          case "olist":
            return (
              <div key={idx} className="markup-olist">
                {renderNestedList(node.items, 0, true, `olist-${idx}-`)}
              </div>
            );
          case "ulist":
            return (
              <div key={idx} className="markup-ulist">
                {renderNestedList(node.items, 0, false, `ulist-${idx}-`)}
              </div>
            );
          case "image":
            return (
              <div key={idx} className="markup-image">
                <img src={resolveMediaUrl(node.url)} alt={node.alt || ""} style={{ maxWidth: "100%", height: "auto", borderRadius: 8 }} />
              </div>
            );
          case "video":
            return (
              <div key={idx} className="markup-video">
                <video controls src={resolveMediaUrl(node.url)} style={{ width: "100%", borderRadius: 8 }} />
                {node.caption ? <div className="video-caption">{node.caption}</div> : null}
              </div>
            );
          case "p":
            return (
              <p key={idx} className="markup-paragraph">
                {node.text}
              </p>
            );
          case "br":
            return <div key={idx} style={{ height: 12 }} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export default MarkupRenderer;

