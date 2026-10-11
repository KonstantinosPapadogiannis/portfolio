// What must never appear in anything the site publishes, written as
// patterns rather than values, so this file reveals nothing itself.

// An international or Greek mobile number.
export const phone = /(\+|\b00)\d{2}[\s\d]{8,}|\b69\d([\s.-]?\d){7}\b/;
// A university email address.
export const universityAddress = /hua\.gr/i;
// A student number, alone or as the start of a university address.
export const studentNumber = /\bi[tf]\d{5,8}\b/i;
// A link to a single repository rather than the GitHub profile.
export const repositoryLink = /github\.com\/[^\s/"'<]+\/[^\s/"'<]+/i;
// Any year before 2000 in the text: nothing on the site is that old, so a
// birth year never slips in.
export const earlyYear = /\b19\d\d\b/;
// An age.
export const age = /\b\d{2}\s*(years old|χρονών|ετών)\b/i;
// A degree classification or a credit count, which the site does not state.
export const classification = /Λίαν|Very Good|Excellent|Άριστα|\bECTS\b|\d{2,3}\s*\/\s*2[34]0\b/i;
// A path on a computer or a file URL.
export const localPath = /\/home\/[a-z]|\/Users\/[A-Z]|file:\/\/\//;
// Hosts of the course deployments, which no longer run.
export const deploymentHost = /duckdns\.org|azurecr\.io|cloudapp\.azure\.com|hub\.docker\.com/i;

// The only email address the site may show.
export const publicEmail = "konstantinospapadogiannis.dev@gmail.com";
export const email = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;
