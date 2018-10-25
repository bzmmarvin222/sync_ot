export type ObjectPath = (number | string)[];

const INVALID_PATH_ARGUMENT = 'The following path fragment is invalid.';
const NOT_AN_OBJECT = 'Found nothing or something that is not a valid object.';
export const OBJECT_TRAVERSING_ERROR = 'The provided path could not be traversed.';

export class ObjectTraversingUtil {
    /**
     * traverses the given path down and updates the value found there
     * throws an error if the path can not be traversed
     * @param obj the object to traverse
     * @param objPath the path to traverse on the object
     * @param value the value to be applied
     */
    public static applyValue(obj: object, objPath: ObjectPath, value: any): void {
        objPath = objPath || [];
        this.checkPath(objPath);
        const wrapping = this.findWrappingObject(obj, objPath);
        wrapping[objPath[objPath.length - 1]] = value;
    }

    /**
     * traverses the given path down to searched value at the end of the path
     * throws an error if the path can not be traversed
     * @param obj the object to traverse
     * @param objPath the path to traverse on the object
     * @return the value at the end of the path
     */
    public static findValue(obj: object, objPath: ObjectPath): any {
        objPath = objPath || [];
        this.checkPath(objPath);
        const wrapping = this.findWrappingObject(obj, objPath);
        return wrapping[objPath[objPath.length - 1]];
    }

    /**
     * traverses the given path down to the last wrapping object
     * throws an error if the path can not be traversed
     * @param obj the object to traverse
     * @param objPath the path to traverse on the object
     * @return the wrapping object of the paths end
     */
    public static findWrappingObject(obj: object, objPath: ObjectPath): any {
        objPath = objPath || [];

        let i = 0;
        let curr: any = obj;
        while (i < objPath.length - 1) {
            curr = curr[objPath[i]];
            this.checkForObj(curr);
            i++;
        }
        this.checkForObj(curr);
        return curr;
    }

    /**
     * checks if the found content of an objects field is an object itself
     * @param toCheck the found object to check
     */
    private static checkForObj(toCheck: any): void {
        if (!toCheck || typeof toCheck !== 'object') {
            console.error(NOT_AN_OBJECT);
            console.error(toCheck);
            throw new Error(OBJECT_TRAVERSING_ERROR);
        }
    }

    /**
     * checks if the provided path has at least a length of 1
     * @param objPath path to check
     */
    private static checkPath(objPath: ObjectPath): void {
        if (objPath.length < 1) {
            console.error(INVALID_PATH_ARGUMENT);
            console.error(objPath);
            throw new Error(OBJECT_TRAVERSING_ERROR);
        }
    }
}