from html.parser import HTMLParser
import re

with open("/tmp/app_with_modal.html") as f:
    raw = f.read()

class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag = tag
        self.attrs = dict(attrs)
        self.parent = parent
        self.children = []
        self.text = ""

class TreeBuilder(HTMLParser):
    def __init__(self):
        super().__init__()
        self.root = Node("DOCUMENT", {})
        self.current = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.children.append(node)
        self.current = node

    def handle_endtag(self, tag):
        if self.current.parent:
            self.current = self.current.parent

    def handle_data(self, data):
        self.current.text += data

tb = TreeBuilder()
tb.feed(raw)

root_div = None
for c in tb.root.children:
    if c.tag == "div" and c.attrs.get("id") == "root":
        root_div = c

def get_nth(node, tag, n):
    if not node: return None
    count = 0
    for child in node.children:
        if child.tag == tag:
            count += 1
            if count == n:
                return child
    return None

def resolve_selector(path_str):
    cur = root_div
    parts = [p.strip() for p in path_str.split(">")]
    for p in parts[1:]:
        m = re.match(r"^([a-z0-9_-]+)(?:#[a-z0-9_-]+)?:nth-of-type\((\d+)\)$", p)
        if not m:
            print("Failed to parse part:", p)
            return None
        tag, n = m.group(1), int(m.group(2))
        cur = get_nth(cur, tag, n)
        if not cur:
            return None
    return cur

selectors = [
    ("CSS 1", "div#root:nth-of-type(1) > div:nth-of-type(1) > header:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1)"),
    ("CSS 2", "div#root:nth-of-type(1) > div:nth-of-type(1) > header:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)"),
    ("CSS 3", "div#root:nth-of-type(1) > div:nth-of-type(1) > header:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > button#playback-toggle-btn:nth-of-type(2)"),
    ("CSS 4", "div#root:nth-of-type(1) > div:nth-of-type(1) > header:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > button#info-modal-btn:nth-of-type(5)"),
    ("CSS 5", "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1)"),
    ("CSS 6", "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2)"),
    ("CSS 7", "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(2)"),
    ("CSS 8", "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(3)"),
    ("CSS 9", "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1)"),
    ("CSS 10", "div#root:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)"),
    ("CSS 11", "div#root:nth-of-type(1) > div:nth-of-type(1) > main:nth-of-type(1) > div:nth-of-type(1) > div:nth-of-type(2)")
]

for name, sel in selectors:
    node = resolve_selector(sel)
    if node:
        print("=== " + name + " ===")
        print("Tag:", node.tag, "ID:", node.attrs.get('id'), "Class:", node.attrs.get('class'))
        full_text = " ".join(node.text.split())
        print("Text snippet:", full_text[:120])
    else:
        print("=== " + name + " === NOT FOUND")
