import {Operation, OperationType} from "../operation";
import {ObjectTraversingUtil} from "../object-traversing-util";
import {SyncableTree} from "../../syncable/syncable-tree";

export const INVALID_OPERATION_TYPE = 'The passed operation has no type.';

export class OperationUtil {

    /**
     * determinate how to process the given operation
     * throws an error if no valid operation type is passed
     * @param syncedNode the node to transform on
     * @param operation the operation to proceed
     */
    public static transform<T>(syncedNode: SyncableTree<T>, operation: Operation): void {
        switch (operation.type) {
            case OperationType.INSERT:
                OperationUtil.insert(syncedNode, operation);
                break;
            case OperationType.FULL_REPLACEMENT:
                OperationUtil.fullReplacement(syncedNode, operation);
                break;
            case OperationType.DELETE:
                OperationUtil.delete(syncedNode, operation);
                break;
            default:
                throw new Error(INVALID_OPERATION_TYPE);
        }
    }

    /**
     * will insert the value passed to the operation after the desired start index or at the end of the value to modify, if the passed index can not be reached
     * will treat all values as string
     * @param syncedNode the node in which the operation will be inserted
     * @param operation the insertion operation
     */
    private static insert<T>(syncedNode: SyncableTree<T>, operation: Operation): void {
        const oldValue = '' + ObjectTraversingUtil.findValue(syncedNode, operation.objectPath);
        const opIndex: number = operation.range ? operation.range.start || 0 : 0;
        const index = Math.min(opIndex, oldValue.length);
        const updatedValue = oldValue.slice(0, index) + operation.data + oldValue.slice(index);
        ObjectTraversingUtil.applyValue(syncedNode, operation.objectPath, updatedValue);
    }

    /**
     * removes the value or object at the given path
     * @param syncedNode the node to remove on
     * @param operation the delete operation
     */
    private static delete<T>(syncedNode: SyncableTree<T>, operation: Operation): void {
        const obj = ObjectTraversingUtil.findWrappingObject(syncedNode, operation.objectPath);
        const lastKeyOrIndex = operation.objectPath[operation.objectPath.length - 1];
        if (Array.isArray(obj)) {
            obj.splice(+lastKeyOrIndex, 1);
        } else {
            delete obj[lastKeyOrIndex];
        }
    }

    /**
     * fully replaces a value by another one
     * @param syncedNode the node to perform the replacement on
     * @param operation the replacement operation
     */
    private static fullReplacement<T>(syncedNode: SyncableTree<T>, operation: Operation): void {
        ObjectTraversingUtil.applyValue(syncedNode, operation.objectPath, operation.data);
    }
}