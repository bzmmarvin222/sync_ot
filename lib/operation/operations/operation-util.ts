import {Operation, OperationType} from "../operation";
import {ObjectTraversingUtil} from "../object-traversing-util";
import {SyncableTree} from "../..";

export const INVALID_OPERATION_TYPE = 'The passed operation has no type.';

export class OperationUtil {

    /**
     * determinate how to process the given operation
     * throws an error if no valid operation type is passed
     * does nothing if the operations node id does not equal the found node
     * @param root the tree root
     * @param operation the operation to proceed
     */
    public static transform<T>(root: SyncableTree<T>, operation: Operation): void {
        const nodeToPerfomOn: SyncableTree<T> = root.findNode(operation.objectPath);

        if (operation.nodeId !== operation.nodeId.toString()) {
            return;
        }

        switch (operation.type) {
            case OperationType.INSERT:
                OperationUtil.insert(root, operation, nodeToPerfomOn);
                break;
            case OperationType.FULL_REPLACEMENT:
                OperationUtil.fullReplacement(root, operation, nodeToPerfomOn);
                break;
            case OperationType.CHILD_APPEND:
                OperationUtil.appendChild(root, operation, nodeToPerfomOn);
                break;
            case OperationType.DELETE:
                OperationUtil.delete(root, operation, nodeToPerfomOn);
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
     * @param nodeToPerformOn the actually affected node
     */
    private static insert<T>(root: SyncableTree<T>, operation: Operation, nodeToPerformOn: SyncableTree<T>): void {
        const oldValue = '' + ObjectTraversingUtil.findValue(root, operation.objectPath);
        const opIndex: number = operation.range ? operation.range.start || 0 : 0;
        const index = Math.min(opIndex, oldValue.length);
        const updatedValue = oldValue.slice(0, index) + operation.data + oldValue.slice(index);
        ObjectTraversingUtil.applyValue(root, operation.objectPath, updatedValue);
        nodeToPerformOn.emitUpdates();
    }

    /**
     * removes the value or object at the given path
     * @param root the tree root
     * @param operation the delete operation
     * @param nodeToPerformOn the actually affected node
     */
    private static delete<T>(root: SyncableTree<T>, operation: Operation, nodeToPerformOn: SyncableTree<T>): void {
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
     * @param nodeToPerformOn the actually affected node
     */
    private static fullReplacement<T>(root: SyncableTree<T>, operation: Operation, nodeToPerformOn: SyncableTree<T>): void {
        ObjectTraversingUtil.applyValue(root, operation.objectPath, operation.data);
        nodeToPerformOn.emitUpdates();
    }

    /**
     * adds a child to the given node
     * this operation can be performed on the root
     * @param root the tree root
     * @param operation the child append operation
     * @param nodeToPerformOn the actually affected node
     */
    private static appendChild<T>(root: SyncableTree<T>, operation: Operation, nodeToPerformOn: SyncableTree<T>): void {
        const hasPath: boolean = operation.objectPath && operation.objectPath.length > 0;
        let node: SyncableTree<T> = root;
        if (hasPath) {
            node = ObjectTraversingUtil.findValue(root, operation.objectPath) as SyncableTree<T>;
        }
        node.addChild(operation.data);
    }
}