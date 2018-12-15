export interface Operation {
    objectPath: (string | number)[];
    type: OperationType;
    range?: OperationRange;
    data?: any;
    nodeId: string;
    affectedChildId?: string;
}

interface OperationRange {
    start?: number;
    end?: number;
}

export enum OperationType {
    INSERT = 'INSERT',
    DELETE = 'DELETE',
    REPLACE_RANGE = 'REPLACE_RANGE',
    FULL_REPLACEMENT = 'FULL_REPLACEMENT',
    INIT = 'INIT',
    CHILD_APPEND = 'CHILD_APPEND'
}