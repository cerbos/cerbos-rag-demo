export interface Principal {
  id: string;
  roles: string[];
  attr: {
    name: string;
    department: string;
    region?: string;
  };
}

export const principals: Record<string, Principal> = {
  sally: {
    id: "sally",
    roles: ["USER"],
    attr: {
      name: "Sally Sales",
      department: "SALES",
      region: "EMEA",
    },
  },
  ian: {
    id: "ian",
    roles: ["ADMIN"],
    attr: {
      name: "Ian IT",
      department: "IT",
    },
  },
  frank: {
    id: "frank",
    roles: ["USER"],
    attr: {
      name: "Frank Finance",
      department: "FINANCE",
      region: "EMEA",
    },
  },
  derek: {
    id: "derek",
    roles: ["USER", "MANAGER"],
    attr: {
      name: "Derek Finance",
      department: "FINANCE",
      region: "EMEA",
    },
  },
  simon: {
    id: "simon",
    roles: ["USER", "MANAGER"],
    attr: {
      name: "Simon Sales",
      department: "SALES",
      region: "NA",
    },
  },
  mark: {
    id: "mark",
    roles: ["USER", "MANAGER"],
    attr: {
      name: "Mark Sales",
      department: "SALES",
      region: "EMEA",
    },
  },
  sydney: {
    id: "sydney",
    roles: ["USER"],
    attr: {
      name: "Sydney Sales",
      department: "SALES",
      region: "NA",
    },
  },
  // finance_team: {
  //   id: "finance_team",
  //   roles: ["USER"],
  //   attr: {
  //     department: "FINANCE",
  //     region: "EMEA",
  //   },
  // },
  // finance_manager: {
  //   id: "finance_manager",
  //   roles: ["USER", "MANAGER"],
  //   attr: {
  //     department: "FINANCE",
  //     region: "EMEA",
  //   },
  // },
};
