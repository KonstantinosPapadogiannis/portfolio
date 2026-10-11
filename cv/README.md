# Public CV

The source of the PDF the website serves at
`/downloads/konstantinos-papadogiannis-cv.pdf`
(`public/downloads/konstantinos-papadogiannis-cv.pdf`, committed).

| File                                | What it is                                          |
| ----------------------------------- | --------------------------------------------------- |
| `konstantinos-papadogiannis-cv.tex` | The CV, English                                     |
| `kpcv.cls`                          | Layout class, derived from Awesome CV 1.6.1 (LPPL)  |
| `fonts/`                            | Source Sans 3, the six faces the class uses (OFL)   |
| `build.sh`                          | Builds the PDF, checks it, copies it to `public/`   |

## What the public version leaves out

It is a separate copy of the personal CV, which stays outside this
repository. The public one:

- shows only the contact details the website already shows: city, email,
  LinkedIn and GitHub. No phone number.
- links no project repository. The ErgoHub and energy entries describe the
  work without a link until those repositories are cleaned up and checked.
- keeps the PDF free of build details (no TeX banner, no file names, no local
  paths) and writes plain objects, so its links and document information can
  be read in the file.

The academic record is the approved one: average 7.51 / 10 and bachelor's
thesis 10 / 10.

## Building

Requirements: TeX Live with LuaLaTeX, `fontspec`, `polyglossia`,
`luaotfload`, `fontawesome5` and `accsupp`; `pdftotext` (poppler) for the
text check.

```sh
./cv/build.sh
```

If `luaotfload` or `fontawesome5` is installed in a separate tree rather
than in TeX Live itself, point `TEXMFHOME` at it:

```sh
TEXMFHOME=/path/to/texmf ./cv/build.sh
```

The script builds in a temporary directory, so no auxiliary files are left
behind. Before it copies the PDF to `public/downloads/` it stops with an
error if:

- a link points anywhere other than the email address, the LinkedIn profile
  or the GitHub profile,
- the file contains a local path,
- the text contains a phone number or a repository address.

The dates in the PDF are those of the last commit that changed `cv/`.

After rebuilding, check the result, then run `pnpm test:e2e`:
`tests/resume.spec.ts` reads the committed PDF and checks the same rules
again.
