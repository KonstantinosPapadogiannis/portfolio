// The academic record under About. Grades are out of ten, from the
// university record; course and group names live in the message
// dictionaries under the same keys. Only the average is public: no course
// or ECTS counts.
export const education = {
  average: 7.51,
  thesis: 10,
} as const;

// Strong results across the degree, grouped by field rather than listed as a
// transcript. Thesis I and II are left out: the thesis has its own grade.
export const academicHighlights = [
  {
    key: "systems",
    courses: [
      { key: "devops", grade: 10 },
      { key: "parallel", grade: 10 },
      { key: "cloud", grade: 9 },
      { key: "distributed", grade: 8 },
    ],
  },
  {
    key: "computing",
    courses: [
      { key: "numerical", grade: 10 },
      { key: "programming2", grade: 9 },
      { key: "oop1", grade: 9 },
      { key: "simulation", grade: 8 },
    ],
  },
  {
    key: "data",
    courses: [
      { key: "dataMining", grade: 9 },
      { key: "vision", grade: 9 },
      { key: "retrieval", grade: 9 },
    ],
  },
  {
    key: "networks",
    courses: [
      { key: "economics", grade: 9 },
      { key: "evaluation", grade: 9 },
      { key: "telecom", grade: 8 },
      { key: "signals", grade: 8 },
      { key: "security", grade: 8 },
    ],
  },
] as const;
