import {Operation, OperationType} from "../operation";
import {ObjectTraversingUtil} from "../object-traversing-util";
import {SyncableTree} from "../..";

export const INVALID_OPERATION_TYPE = 'The passed operation has no type.';

export class OperationUtil {

    /**
     * determinate how to process the given operation
     * throws an error if no valid operation type is passed
     * @param root the tree root
     * @param operation the operation to proceed
     */
    public static transform<T>(root: SyncableTree<T>, operation: Operation): void {
        switch (operation.type) {
            case OperationType.INSERT:
                OperationUtil.insert(root, operation);
                break;
            case OperationType.FULL_REPLACEMENT:
                OperationUtil.fullReplacement(root, operation);
                break;
            case OperationType.CHILD_APPEND:
                OperationUtil.appendChild(root, operation);
                break;
            case OperationType.DELETE:
                OperationUtil.delete(root, operation);
                break;
            default:
                throw new Error(INVALID_OPERATION_TYPE);
        }
    }

    /**
     * will insert the value passed to the operation after the desired start index or at the end of the value to modify, if the passed index can not be reached
     * will treat all values as string
     * @param root the tree root
     * @param operation the insertion operation
     */
    private static insert<T>(root: SyncableTree<T>, operation: Operation): void {
        const oldValue = '' + ObjectTraversingUtil.findValue(root, operation.objectPath);
        const opIndex: number = operation.range ? operation.range.start || 0 : 0;
        const index = Math.min(opIndex, oldValue.length);
        const updatedValue = oldValue.slice(0, index) + operation.data + oldValue.slice(index);
        ObjectTraversingUtil.applyValue(root, operation.objectPath, updatedValue);
        root.findNode(operation.objectPath).emitUpdates();
    }

    /**
     * removes the value or object at the given path
     * @param root the tree root
     * @param operation the delete operation
     */
    private static delete<T>(root: SyncableTree<T>, operation: Operation): void {
        const obj = ObjectTraversingUtil.findWrappingObject(root, operation.objectPath);
        const lastKeyOrIndex = operation.objectPath[operation.objectPath.length - 1];
        if (Array.isArray(obj)) {
            obj.splice(+lastKeyOrIndex, 1);
        } else {
            obj[lastKeyOrIndex] = undefined;
        }
    }

    /**
     * fully replaces a value by another one
     * @param root the tree root
     * @param operation the replacement operation
     */
    private static fullReplacement<T>(root: SyncableTree<T>, operation: Operation): void {
        ObjectTraversingUtil.applyValue(root, operation.objectPath, operation.data);
        root.findNode(operation.objectPath).emitUpdates();
    }

    /**
     * adds a child to the given node
     * this operation can be performed on the root
     * @param root the tree root
     * @param operation the child append operation
     */
    private static appendChild<T>(root: SyncableTree<T>, operation: Operation): void {
        const hasPath: boolean = operation.objectPath && operation.objectPath.length > 0;
        let node: SyncableTree<T> = root;
        if (hasPath) {
            node = ObjectTraversingUtil.findValue(root, operation.objectPath) as SyncableTree<T>;
        }
        node.addChild(operation.data);
    }
}