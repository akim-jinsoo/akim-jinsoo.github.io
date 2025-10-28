import React from "react";

// Simple markup renderer supporting the following directives (one per line):
// /section Title       -> <h2>Title</h2>
// /subsection Title    -> <h3>Title</h3>
// /list                -> begin unordered list
// /endlist             -> end unordered list
// /bullet Item text    -> <li>Item text</li>
// Blank lines create paragraph breaks for plain text.
// Any other line is treated as a paragraph.

const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const parseToNodes = (content) => {
  if (!content) return [];
  const lines = content.split(/\r?\n/);
  const nodes = [];
  let inList = false;
  let listItems = [];

  const flushList = () => {
    if (inList) {
      nodes.push({ type: "ul", items: listItems.slice() });
      listItems = [];
      inList = false;
    }
  };

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (line === "") {
      // blank line - flush any open list and add a paragraph break marker
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
      // start list
      flushList();
      inList = true;
      listItems = [];
      continue;
    }

    if (line === "/endlist") {
      flushList();
      continue;
    }

    if (line.startsWith("/bullet ")) {
      // bullet inside list (if list not started, start it implicitly)
      const item = line.replace("/bullet ", "");
      if (!inList) {
        inList = true;
        listItems = [];
      }
      listItems.push(item);
      continue;
    }

    // default: paragraph line
    flushList();
    nodes.push({ type: "p", text: line });
  }

  // flush at end
  flushList();

  return nodes;
};

const MarkupRenderer = ({ content }) => {
  const nodes = parseToNodes(content);

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
          case "ul":
            return (
              <ul key={idx} className="markup-list">
                {node.items.map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
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
