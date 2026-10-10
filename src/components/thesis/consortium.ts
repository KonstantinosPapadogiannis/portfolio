// The consortium as built in the thesis repository: the seven organisations
// on subsidychannel, their MSP ids, and the three chaincodes with their
// private data collections. Identifiers are spelled as in the code. The
// display names come from thesis.architecture.organisations in the messages.

export const organisations = [
  "farmer",
  "opekepe",
  "aade",
  "region",
  "ministry",
  "bank",
  "observer",
] as const;

export type Organisation = (typeof organisations)[number];

// The six organisations that run their own infrastructure, each with a
// connector between its registry and its Fabric peer. Farmers run nothing.
export const institutions = organisations.filter(
  (key): key is Exclude<Organisation, "farmer"> => key !== "farmer",
);

export const mspIds: Record<Organisation, string> = {
  farmer: "FarmersMSP",
  opekepe: "OpekepeMSP",
  aade: "AADEMSP",
  region: "RegionalMSP",
  ministry: "MinistryMSP",
  bank: "BankMSP",
  observer: "EUObserverMSP",
};

type Collection = {
  name: string;
  members: readonly Organisation[];
};

type Chaincode = {
  name: string;
  contracts: number;
  collections: readonly Collection[];
};

// 1 + 7 + 7 = 15 contracts, 2 + 3 = 5 collections. OPEKEPE is a member of
// every collection.
export const chaincodes: readonly Chaincode[] = [
  {
    name: "policy-chaincode",
    contracts: 1,
    collections: [],
  },
  {
    name: "entitlement-chaincode",
    contracts: 7,
    collections: [
      { name: "entitlement-opekepe-aade-collection", members: ["opekepe", "aade"] },
      { name: "entitlement-opekepe-regional-collection", members: ["opekepe", "region"] },
    ],
  },
  {
    name: "subsidy-chaincode",
    contracts: 7,
    collections: [
      { name: "opekepe-aade-collection", members: ["opekepe", "aade"] },
      { name: "opekepe-regional-collection", members: ["opekepe", "region"] },
      { name: "opekepe-bank-collection", members: ["opekepe", "bank"] },
    ],
  },
];
