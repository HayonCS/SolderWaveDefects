import { NodeDefect, REST_API_URL, SolderProblems } from "./definitions";
import { dateTimeToString } from "./utils";

export type DefectLog = {
  id: number;
  dateTime: Date;
  partNumber: string;
  boardNumber: string;
  refDesignator: string;
  componentNumber: string;
  componentType: string;
  componentName: string;
  componentDesc: string;
  node: number;
  nodeName: string;
  nodeDesc: string;
  defect: string | SolderProblems;
};

export type DefectPart = {
  id: number;
  dateTime: Date;
  partNumber: string;
  boardNumber: string;
  refDesignators: string[];
  componentNumbers: string[];
  componentTypes: string[];
  componentNames: string[];
  componentDescs: string[];
  nodes: number[];
  nodeNames: string[];
  nodeDescs: string[];
  defects: (string | SolderProblems)[];
};

export async function getDefectLogsAll(): Promise<DefectLog[]> {
  const url = REST_API_URL + "/api/get_defect_logs";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let logs: DefectLog[] = [];
  if (!response.ok) {
    return logs;
  }
  const result = await response.json();
  if (result && result.length > 0) {
    result.forEach((log: any) => {
      if (log.length > 0) {
        const obj: DefectLog = {
          id: +log[0],
          dateTime: new Date(log[1]),
          partNumber: log[2],
          boardNumber: log[3],
          refDesignator: log[4],
          componentNumber: log[5],
          componentType: log[6],
          componentName: log[7],
          componentDesc: log[8],
          node: +log[9],
          nodeName: log[10],
          nodeDesc: log[11],
          defect: log[12],
        };
        logs.push(obj);
      }
    });
  }
  return logs;
}

export async function getDefectLogs(
  startDate: Date,
  endDate: Date
): Promise<DefectLog[]> {
  const url =
    REST_API_URL +
    `/api/get_defect_logs/${dateTimeToString(startDate)}/${dateTimeToString(
      endDate
    )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let logs: DefectLog[] = [];
  if (!response.ok) {
    return logs;
  }
  const result = await response.json();
  if (result && result.length > 0) {
    result.forEach((log: any) => {
      if (log.length > 0) {
        const obj: DefectLog = {
          id: +log[0],
          dateTime: new Date(log[1]),
          partNumber: log[2],
          boardNumber: log[3],
          refDesignator: log[4],
          componentNumber: log[5],
          componentType: log[6],
          componentName: log[7],
          componentDesc: log[8],
          node: +log[9],
          nodeName: log[10],
          nodeDesc: log[11],
          defect: log[12],
        };
        logs.push(obj);
      }
    });
  }
  return logs;
}

export async function getDefectLogsSpecific(
  startDate: Date,
  endDate: Date,
  partNumber: string
): Promise<DefectLog[]> {
  const url =
    REST_API_URL +
    `/api/get_defect_logs/${dateTimeToString(startDate)}/${dateTimeToString(
      endDate
    )}/${partNumber}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let logs: DefectLog[] = [];
  if (!response.ok) {
    return logs;
  }
  const result = await response.json();
  if (result && result.length > 0) {
    result.forEach((log: any) => {
      if (log.length > 0) {
        const obj: DefectLog = {
          id: +log[0],
          dateTime: new Date(log[1]),
          partNumber: log[2],
          boardNumber: log[3],
          refDesignator: log[4],
          componentNumber: log[5],
          componentType: log[6],
          componentName: log[7],
          componentDesc: log[8],
          node: +log[9],
          nodeName: log[10],
          nodeDesc: log[11],
          defect: log[12],
        };
        logs.push(obj);
      }
    });
  }
  return logs;
}

export async function getDefectPartsAll(): Promise<DefectPart[]> {
  const url = REST_API_URL + "/api/get_defect_parts";
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let parts: DefectPart[] = [];
  if (!response.ok) {
    return parts;
  }
  const result = await response.json();
  if (result && result.length > 0) {
    result.forEach((part: any) => {
      if (part.length > 0) {
        const obj: DefectPart = {
          id: +part[0],
          dateTime: new Date(part[1]),
          partNumber: part[2],
          boardNumber: part[3],
          refDesignators: String(part[4]).split(","),
          componentNumbers: String(part[5]).split(","),
          componentTypes: String(part[6]).split(","),
          componentNames: String(part[7]).split(","),
          componentDescs: String(part[8]).split(","),
          nodes: String(part[9])
            .split(",")
            .map((x) => +x),
          nodeNames: String(part[10]).split(","),
          nodeDescs: String(part[11]).split(","),
          defects: String(part[12]).split(","),
        };
        parts.push(obj);
      }
    });
  }
  return parts;
}

export async function getDefectParts(
  startDate: Date,
  endDate: Date
): Promise<DefectPart[]> {
  const url =
    REST_API_URL +
    `/api/get_defect_parts/${dateTimeToString(startDate)}/${dateTimeToString(
      endDate
    )}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let parts: DefectPart[] = [];
  if (!response.ok) {
    return parts;
  }
  const result = await response.json();
  if (result && result.length > 0) {
    result.forEach((part: any) => {
      if (part.length > 0) {
        const obj: DefectPart = {
          id: +part[0],
          dateTime: new Date(part[1]),
          partNumber: part[2],
          boardNumber: part[3],
          refDesignators: String(part[4]).split(","),
          componentNumbers: String(part[5]).split(","),
          componentTypes: String(part[6]).split(","),
          componentNames: String(part[7]).split(","),
          componentDescs: String(part[8]).split(","),
          nodes: String(part[9])
            .split(",")
            .map((x) => +x),
          nodeNames: String(part[10]).split(","),
          nodeDescs: String(part[11]).split(","),
          defects: String(part[12]).split(","),
        };
        parts.push(obj);
      }
    });
  }
  return parts;
}

export async function getDefectPartsSpecific(
  startDate: Date,
  endDate: Date,
  partNumber: string
): Promise<DefectPart[]> {
  const url =
    REST_API_URL +
    `/api/get_defect_parts/${dateTimeToString(startDate)}/${dateTimeToString(
      endDate
    )}/${partNumber}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
  let parts: DefectPart[] = [];
  if (!response.ok) {
    return parts;
  }
  const result = await response.json();
  if (result && result.length > 0) {
    result.forEach((part: any) => {
      if (part.length > 0) {
        const obj: DefectPart = {
          id: +part[0],
          dateTime: new Date(part[1]),
          partNumber: part[2],
          boardNumber: part[3],
          refDesignators: String(part[4]).split(","),
          componentNumbers: String(part[5]).split(","),
          componentTypes: String(part[6]).split(","),
          componentNames: String(part[7]).split(","),
          componentDescs: String(part[8]).split(","),
          nodes: String(part[9])
            .split(",")
            .map((x) => +x),
          nodeNames: String(part[10]).split(","),
          nodeDescs: String(part[11]).split(","),
          defects: String(part[12]).split(","),
        };
        parts.push(obj);
      }
    });
  }
  return parts;
}

export async function insertDefectLog(
  partNumber: string,
  boardNumber: string,
  defect: NodeDefect
): Promise<boolean> {
  try {
    const body = JSON.stringify({
      DATETIME: dateTimeToString(new Date()),
      PART_NUMBER: partNumber,
      BOARD_NUMBER: boardNumber,
      REF_DESIGNATOR: defect.component.refDesignator,
      COMPONENT_NUMBER: defect.component.partNumber,
      COMPONENT_TYPE: defect.component.type,
      COMPONENT_NAME: defect.component.name,
      COMPONENT_DESC: defect.component.desc,
      NODE: defect.node,
      NODE_NAME: defect.name,
      NODE_DESC: defect.desc ?? "",
      DEFECT: defect.defect,
    });
    const url = REST_API_URL + "/api/insert_defect_log";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: body,
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error: any) {
    console.log(error.message);
  }
  return false;
}

export async function insertDefectLogs(
  partNumber: string,
  boardNumber: string,
  defects: NodeDefect[]
): Promise<boolean> {
  try {
    const body = JSON.stringify(
      defects.map((defect) => {
        return {
          DATETIME: dateTimeToString(new Date()),
          PART_NUMBER: partNumber,
          BOARD_NUMBER: boardNumber,
          REF_DESIGNATOR: defect.component.refDesignator,
          COMPONENT_NUMBER: defect.component.partNumber,
          COMPONENT_TYPE: defect.component.type,
          COMPONENT_NAME: defect.component.name,
          COMPONENT_DESC: defect.component.desc,
          NODE: defect.node,
          NODE_NAME: defect.name,
          NODE_DESC: defect.desc ?? "",
          DEFECT: defect.defect,
        };
      })
    );
    const url = REST_API_URL + "/api/insert_defect_logs";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: body,
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error: any) {
    console.log(error.message);
  }
  return false;
}

export async function insertDefectPart(
  partNumber: string,
  boardNumber: string,
  defects: NodeDefect[]
): Promise<boolean> {
  try {
    const body = JSON.stringify({
      DATETIME: dateTimeToString(new Date()),
      PART_NUMBER: partNumber,
      BOARD_NUMBER: boardNumber,
      REF_DESIGNATORS: defects.map((x) => x.component.refDesignator).join(","),
      COMPONENT_NUMBERS: defects.map((x) => x.component.partNumber).join(","),
      COMPONENT_TYPES: defects.map((x) => x.component.type).join(","),
      COMPONENT_NAMES: defects.map((x) => x.component.name).join(","),
      COMPONENT_DESCS: defects.map((x) => x.component.desc).join(","),
      NODES: defects.map((x) => x.node).join(","),
      NODE_NAMES: defects.map((x) => x.name).join(","),
      NODE_DESCS: defects.map((x) => x.desc).join(","),
      DEFECTS: defects.map((x) => x.defect).join(","),
    });
    const url = REST_API_URL + "/api/insert_defect_part";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: body,
    });
    if (!response.ok) {
      return false;
    }
    return true;
  } catch (error: any) {
    console.log(error.message);
  }
  return false;
}
