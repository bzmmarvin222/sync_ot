import {Operation, OperationType} from "../operation";
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
            case OperationType.INIT:
                OperationUtil.clone(syncedObj, operation);
                break;
            case OperationType.FULL_REPLACEMENT:
                OperationUtil.fullReplacement(syncedObj, operation);
                break;
            case OperationType.DELETE:
                OperationUtil.delete(syncedObj, operation);
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

    /**
     * removes all values with it's keys from an object and then reassigns the data from the passed operation to keep the reference intact
     * @param syncedObj the object to clear and refill
     * @param operation the operation to get the data from
     */
    private static clone<T extends object>(syncedObj: T, operation: Operation): void {
        Object.keys(syncedObj)
            .forEach((key: string) => {
                delete (syncedObj[key]);
            });
        Object.keys(operation.data)
            .forEach((key: string) => {
                syncedObj[key] = operation.data[key];
            });
    }

    /**
     * removes the value or object at the given path
     * @param syncedObj the object to remove on
     * @param operation the delete operation
     */
    private static delete<T extends object>(syncedObj: T, operation: Operation): void {
        const obj = ObjectTraversingUtil.findWrappingObject(syncedObj, operation.objectPath);
        const lastKeyOrIndex = operation.objectPath[operation.objectPath.length - 1];
        if (Array.isArray(obj)) {
            obj.splice(+lastKeyOrIndex, 1);
        } else {
            delete obj[lastKeyOrIndex];
        }
    }

    /**
     * fully replaces a value by another one
     * @param syncedObj the object to perform the replacement on
     * @param operation the replacement operation
     */
    private static fullReplacement<T extends object>(syncedObj: T, operation: Operation): void {
        ObjectTraversingUtil.applyValue(syncedObj, operation.objectPath, operation.data);
    }
}