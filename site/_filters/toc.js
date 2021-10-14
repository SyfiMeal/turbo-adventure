/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview This generates our TOC by matching headings with a regexp.
 *
 * This follows a couple of rules:
 *   - we look for h2 and h3's
 *   - h2 creates a new toplevel section, and h3's can be contained within that
 *   - if a h2 has no ID, it's still displayed if it has valid h3 children with IDs
 *   - if a h3 is found without a preceding h2, it's ignored
 *
 * (Don't try this at home).
 */

const striptags = require('striptags');

// This matches a heading tag like `<h2 foo="bar">contents</h2>`. It uses backreferences so that
// the regexp catches the correct closing tag (i.e., <h2> will be closed by the nearest upcoming
// </h2>).
// It generates three groups:
//   1. the tag name, i.e., `h2` or `h3`
//   2. the attribute string part, e.g., ` id="foo" class="bar"`
//   3. the content within the tags (which might contain more tags)
const headingRe = /<(h[23])(|\s.*?)>(.*?)<\/\1>/gm;

// Matches an ID attribute, returning the value in the 1st group.
const idRe = /\bid="(.+?)"/;

// Matches e.g., " #" so we can remove it.
const trailingHashRe = /\s+#$/;

/**
 * @typedef {{
 *   title: string,
 *   id?: string,
 *   children?: TocNodeType[],
 * }}
 */
// eslint-disable-next-line no-unused-vars
let TocNodeType;

/** @param {TocNodeType} node */
const renderNode = node => {
  let escapedTitle = striptags(node.title);

  // Remove any hanging "#" which is generated by other code.
  escapedTitle = escapedTitle.trim().replace(trailingHashRe, '');

  const titlePart = node.id
    ? `<a href="#${node.id}">${escapedTitle}</a>`
    : `<span class="type--small">${escapedTitle}</span>`;

  const childrenPart = node?.children?.length
    ? renderChildren(node.children)
    : '';

  return `<li>${titlePart}${childrenPart}</li>`;
};

/** @param {TocNodeType[]} toplevel */
const renderChildren = toplevel => {
  return `<ul>${toplevel.map(renderNode).join('')}</ul>`;
};

/**
 * @param {string} raw inner HTML content of the page
 * @return {string} toc contents
 */
const toc = raw => {
  /** @type {TocNodeType[]} */
  let toplevel = [];

  /** @type {TocNodeType|null} */
  let current = null;

  for (;;) {
    const headingMatch = headingRe.exec(raw);
    if (!headingMatch) {
      break;
    }

    const htype = headingMatch[1];
    if (htype === 'h3' && current === null) {
      // We got a h3 before any h2. Ignore.
      continue;
    }

    const attr = headingMatch[2];
    const contents = headingMatch[3];

    const idMatch = idRe.exec(attr);
    const id = idMatch ? idMatch[1] : undefined;

    if (htype === 'h2') {
      current = {title: contents, id, children: []};
      toplevel.push(current);
    } else if (htype === 'h3' && id) {
      // Only push h3's if they have an ID.
      current?.children?.push({title: contents, id});
    }
  }

  // Remove h2's that don't have any IDs and don't have children.
  // h2's that have no IDs but which have valid children (i.e., IDs themselves) are allowed to stay.
  toplevel = toplevel.filter(({id, children}) => {
    return Boolean(id) || children?.length !== 0;
  });
  if (toplevel.length === 0) {
    return ''; // didn't find anything valid
  }
  return renderChildren(toplevel);
};

module.exports = {
  toc,
};
