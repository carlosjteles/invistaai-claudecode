#!/usr/bin/env python3
"""Gera src/app/assets/css/bootstrap.purged.css com só as regras do Bootstrap
cujas classes aparecem no código do site.

Uso (na raiz do projeto, depois de `npm install`):
    python3 scripts/purge-bootstrap.py

Rode de novo sempre que usar uma classe do Bootstrap que o site ainda não usava
(ex.: um componente novo como modal, toast ou carousel).
"""
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.environ.get("BOOTSTRAP_CSS", os.path.join(ROOT, "node_modules/bootstrap/dist/css/bootstrap.css"))
OUT = os.path.join(ROOT, "src/app/assets/css/bootstrap.purged.css")

# Classes que o JavaScript/bibliotecas adicionam e que não aparecem como texto no código
SAFELIST = {"show", "showing", "hiding", "fade", "collapsing", "collapsed", "active", "disabled",
            "open", "was-validated", "is-valid", "is-invalid", "dropdown-menu-end", "nav-sticky"}

def tokens():
    used = set(SAFELIST)
    files = glob.glob(os.path.join(ROOT, "src/**/*.js"), recursive=True) + \
            glob.glob(os.path.join(ROOT, "src/**/*.scss"), recursive=True)
    for f in files:
        used.update(re.findall(r"[A-Za-z][A-Za-z0-9_-]*", open(f, encoding="utf-8").read()))
    return used

def strip_comments(css):
    return re.sub(r"/\*.*?\*/", "", css, flags=re.S)

def blocks(css):
    """Divide em (prelude, corpo) no nível atual, respeitando chaves aninhadas."""
    i, n, out = 0, len(css), []
    while i < n:
        j = css.find("{", i)
        if j == -1:
            break
        prelude = css[i:j].strip()
        depth, k = 1, j + 1
        while k < n and depth:
            if css[k] == "{": depth += 1
            elif css[k] == "}": depth -= 1
            k += 1
        out.append((prelude, css[j + 1:k - 1]))
        i = k
    return out

def keep_selector(sel, used):
    classes = re.findall(r"\.(-?[_a-zA-Z][_a-zA-Z0-9-]*)", sel)
    return all(c in used for c in classes)

def purge(css, used):
    out = []
    for prelude, body in blocks(css):
        if prelude.startswith("@media") or prelude.startswith("@supports") or prelude.startswith("@container"):
            inner = purge(body, used)
            if inner.strip():
                out.append(f"{prelude}{{{inner}}}")
        elif prelude.startswith("@"):
            out.append(f"{prelude}{{{body}}}")  # @keyframes, @font-face etc.
        else:
            sels = [s.strip() for s in prelude.split(",")]
            kept = [s for s in sels if keep_selector(s, used)]
            if kept:
                out.append(f"{','.join(kept)}{{{body.strip()}}}")
    return "\n".join(out)

if __name__ == "__main__":
    css = strip_comments(open(SRC, encoding="utf-8").read())
    res = purge(css, tokens())
    header = "/* Bootstrap 5.3 (MIT) reduzido por scripts/purge-bootstrap.py: só as classes usadas no site. */\n"
    open(OUT, "w", encoding="utf-8").write(header + res + "\n")
    print(f"{len(css)//1024} KB -> {len(res)//1024} KB  ({OUT})")
