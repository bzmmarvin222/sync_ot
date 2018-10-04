export const OBJECT_TRAVERSING_ERROR = 'The provided path could not be traversed.';

export class ObjectTraversingUtil {
    /**
     * traverses the given path down and updates the value found there
     * throws an error if the path can not be traversed
     * @param obj the object to traverse
     * @param objPath the path to traverse on the object
     * @param value the value to be applied
     */
    public static applyValue(obj: object, objPath: (string | number)[], value: any): void {
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
    public static findValue(obj: object, objPath: (string | number)[]): any {
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
    public static findWrappingObject(obj: object, objPath: (string | number)[]): any {
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
            throw new Error(OBJECT_TRAVERSING_ERROR);
        }
    }

    /**
     * checks if the provided path has at least a length of 1
     * @param objPath path to check
     */
    private static checkPath(objPath: (string | number)[]): void {
        if (objPath.length < 1) {
            throw new Error(OBJECT_TRAVERSING_ERROR);
        }
    }
}