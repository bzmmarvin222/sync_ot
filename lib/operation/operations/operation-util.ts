import {Operation} from "../operation";
import {OperationType} from "../operation-type";
import {ObjectTraversingUtil} from "../object-traversing-util";

export const INVALID_OPERATION_TYPE = 'The passed operation has no type.';

export class OperationUtil {

    /**
     * determinate how to process the given operation
     * throws an error if no valid operation type is passed
     * @param syncedObj the object to transform on
     * @param operation the operation to proceed
     */
    public static transform<T extends object>(syncedObj: T, operation: Operation): void {
        switch (operation.type) {
            case OperationType.INSERT:
                OperationUtil.insert(syncedObj, operation);
                break;
            default:
                throw new Error(INVALID_OPERATION_TYPE);
        }
    }

    /**
     * will insert the value passed to the operation after the desired start index or at the end of the value to modify, if the passed index can not be reached
     * will treat all values as string
     * @param syncedObj the object in which the operation will be inserted
     * @param operation the insertion operation
     */
    private static insert<T extends object>(syncedObj: T, operation: Operation): void {
        const oldValue = '' + ObjectTraversingUtil.findValue(syncedObj, operation.objectPath);
        const index = Math.min(operation.range.start, oldValue.length);
        const updatedValue = oldValue.slice(0, index) + operation.data + oldValue.slice(index);
        ObjectTraversingUtil.applyValue(syncedObj, operation.objectPath, updatedValue);
    }
}