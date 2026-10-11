%% kpcv.cls
%% Curriculum vitae class for Konstantinos Papadogiannis.
%%
%% Derived from Awesome CV 1.6.1 (https://github.com/posquit0/Awesome-CV)
%% by Claud D. Park <posquit0.bj@gmail.com>, distributed under the
%% LaTeX Project Public License v1.3c (http://www.latex-project.org/lppl).
%% This is a modified version and carries a new name, as the licence asks.
%%
%% Changes from awesome-cv.cls:
%%   - A4 page, LuaLaTeX only; Source Sans 3 (SIL OFL 1.1) loaded from ./fonts
%%   - Greek through polyglossia (class option "greek"); no Roboto; contact
%%     icons from the fontawesome5 package, hidden from extracted text
%%   - single-column entries set with \hfill instead of tables, for clean
%%     text extraction by applicant tracking systems
%%   - letter-spaced section titles with a hairline rule, no colour split
%%   - regular-weight body text, one muted accent colour
\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{kpcv}[2026/10/07 v1.0 CV class derived from Awesome CV 1.6.1]

\newif\ifkp@greek
\DeclareOption{greek}{\kp@greektrue}
\DeclareOption{english}{\kp@greekfalse}
\DeclareOption*{\PassOptionsToClass{\CurrentOption}{article}}
\ProcessOptions\relax
\LoadClass[10pt]{article}

%-------------------------------------------------------------------------------
% Packages
%-------------------------------------------------------------------------------
\RequirePackage[a4paper,left=1.4cm,right=1.4cm,top=1.0cm,bottom=1.0cm]{geometry}
\RequirePackage{fontspec}
\RequirePackage{polyglossia}
\RequirePackage[dvipsnames]{xcolor}
\RequirePackage{enumitem}
\RequirePackage[protrusion=true,expansion=true]{microtype}
\RequirePackage[unicode,hidelinks]{hyperref}
\RequirePackage{fontawesome5}
\RequirePackage{accsupp}

%-------------------------------------------------------------------------------
% Languages
%-------------------------------------------------------------------------------
\ifkp@greek
  \setdefaultlanguage[variant=monotonic]{greek}
  \setotherlanguage[variant=british]{english}
\else
  \setdefaultlanguage[variant=british]{english}
  \setotherlanguage[variant=monotonic]{greek}
\fi

%-------------------------------------------------------------------------------
% Fonts: Source Sans 3 for everything; Light and Bold only in the name
%-------------------------------------------------------------------------------
\defaultfontfeatures{Ligatures=TeX}
\setmainfont{SourceSans3}[
  Path           = ./fonts/,
  Extension      = .otf,
  UprightFont    = *-Regular,
  ItalicFont     = *-It,
  BoldFont       = *-Semibold,
  BoldItalicFont = *-SemiboldIt,
]
% The name faces sit outside polyglossia: a Greek name needs Script=Greek, or the
% PDF text layer maps α, γ, δ and ι to the Latin letters that share their glyphs
\ifkp@greek
  \newfontfamily\kp@lightfont{SourceSans3-Light}[Path=./fonts/, Extension=.otf, Script=Greek]
  \newfontfamily\kp@boldfont{SourceSans3-Bold}[Path=./fonts/, Extension=.otf, Script=Greek]
\else
  \newfontfamily\kp@lightfont{SourceSans3-Light}[Path=./fonts/, Extension=.otf]
  \newfontfamily\kp@boldfont{SourceSans3-Bold}[Path=./fonts/, Extension=.otf]
\fi
\renewcommand*{\familydefault}{\rmdefault}

%-------------------------------------------------------------------------------
% Colours
%-------------------------------------------------------------------------------
\definecolor{kptext}{HTML}{1E2329}
\definecolor{kpaccent}{HTML}{1D3557}
\definecolor{kpmuted}{HTML}{58606C}
\definecolor{kprule}{HTML}{BCC3CD}

%-------------------------------------------------------------------------------
% Page and paragraph
%-------------------------------------------------------------------------------
\pagestyle{empty}
\setlength{\parindent}{0pt}
\setlength{\parskip}{0pt}
\linespread{1}
\hyphenpenalty=10000
\exhyphenpenalty=10000
\raggedright
\AtBeginDocument{\color{kptext}\raggedright}
% Single word space after full stops; set last so no language switch undoes it
\AddToHook{begindocument/end}{\frenchspacing}

%-------------------------------------------------------------------------------
% Personal data
%-------------------------------------------------------------------------------
\newcommand*{\name}[2]{\def\kp@firstname{#1}\def\kp@lastname{#2}}
\newcommand*{\headline}[1]{\def\kp@headline{#1}}
\newcommand*{\contact}[1]{\def\kp@contact{#1}}
\def\kp@headline{}
\newcommand*{\sep}{\enspace{\color{kprule}|}\enspace}
% Icon glyphs have no real codepoint; luaotfload would otherwise synthesise a
% ToUnicode entry from the glyph's internal name (e.g. "phone-alt" ->
% "Phone-Alt"), which then leaks as a fake word into copy-pasted/ATS-parsed
% text. addtounicode is read when the glyph node is finalised, not when the
% font loads, so the switch has to wrap each icon rather than the \RequirePackage.
% Without a ToUnicode entry a text extractor still reads the glyph's code as
% a character (an envelope came out as "ć"), so each icon also carries an
% empty ActualText and is skipped in copied or parsed text.
\newcommand*{\cvicon}[1]{%
  \BeginAccSupp{method=escape,ActualText={}}%
  \directlua{fonts.constructors.addtounicode = false}%
  \faIcon{#1}%
  \directlua{fonts.constructors.addtounicode = true}%
  \EndAccSupp{}}

\newcommand*{\makecvheader}{%
  \begingroup\centering
    {\fontsize{24}{27}\selectfont
      {\kp@lightfont\kp@firstname}\ {\kp@boldfont\kp@lastname}\par}%
    \ifx\kp@headline\@empty\else
      \vspace{3.5pt}%
      {\fontsize{9.4}{11}\selectfont\bfseries\color{kpaccent}%
        \addfontfeatures{LetterSpace=5}\kp@headline\par}%
    \fi
    \vspace{4pt}%
    {\fontsize{9.4}{15}\selectfont\color{kpmuted}\kp@contact\par}%
  \endgroup
  \vspace{2pt}}

%-------------------------------------------------------------------------------
% Summary paragraph under the header
%-------------------------------------------------------------------------------
\newcommand{\cvsummary}[1]{%
  \par\vspace{7pt}%
  {\fontsize{10.2}{13.2}\selectfont #1\par}}

%-------------------------------------------------------------------------------
% Sections and entries
%-------------------------------------------------------------------------------
\newcommand*{\cvsection}[1]{%
  \par\addvspace{7pt}%
  {\fontsize{10.2}{12}\selectfont\bfseries\color{kpaccent}%
    \addfontfeatures{LetterSpace=5}#1\par}%
  \nopagebreak\nointerlineskip\vspace{2.5pt}%
  {\color{kprule}\hrule height 0.5pt}%
  \nopagebreak\nointerlineskip\vspace{4pt}}

% \cventry{title}{date}{context line}{right side of the context line}
% A long title wraps inside its own column, so the date stays on the first line;
% the depth of the last title line is carried out of the box for even spacing.
\newlength{\kp@datewidth}
\newcommand*{\cventry}[4]{%
  \par\addvspace{4pt}\noindent
  \settowidth{\kp@datewidth}{#2}%
  \parbox[t]{\dimexpr\linewidth-\kp@datewidth-1.5em\relax}{%
    \raggedright\bfseries #1\par\xdef\kp@titledepth{\the\prevdepth}}%
  \hfill{\color{kpmuted}#2}\par\prevdepth=\kp@titledepth\relax\nopagebreak
  \if\relax\detokenize{#3#4}\relax\else
    \noindent{\itshape\color{kpmuted}#3}\hfill{\color{kpmuted}#4}\par\nopagebreak
  \fi}

\newlist{cvitems}{itemize}{1}
\setlist[cvitems]{
  label      = {\color{kpmuted}\textbullet},
  leftmargin = 11pt,
  labelsep   = 5pt,
  itemsep    = 1.1pt,
  parsep     = 0pt,
  topsep     = 1.2pt,
  partopsep  = 0pt,
}

% Skills: bold label, then a plain comma-separated list with a hanging indent
\newlength{\cvskilllabelwidth}
\setlength{\cvskilllabelwidth}{3.2cm}
\newcommand*{\cvskill}[2]{%
  \par\noindent\hangindent=\cvskilllabelwidth\hangafter=1
  \makebox[\cvskilllabelwidth][l]{\bfseries #1}#2\par\addvspace{1.2pt}}

\endinput
