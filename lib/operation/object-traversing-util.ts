export const OBJECT_TRAVERSING_ERROR = 'The provided path could not be traversed.';

export class ObjectTraversingUtil {
    public static applyValue(obj: object, objPath: (string | number)[], value: any): void {
        const wrapping = this.findWrappingObject(obj, objPath);
        wrapping[objPath[objPath.length - 1]] = value;
    }

    public static findValue(obj: object, objPath: (string | number)[]): any {
        const wrapping = this.findWrappingObject(obj, objPath);
        return wrapping[objPath[objPath.length - 1]];
    }

    private static findWrappingObject(obj: object, objPath: (string | number)[]): any {
        objPath = objPath || [];
        if (objPath.length < 1) {
            throw new Error(OBJECT_TRAVERSING_ERROR);
        }

        let i = 0;
        let curr: any = obj;
        while (i < objPath.length - 1) {
            curr = curr[objPath[i]];
            this.check(curr);
            i++;
        }
        this.check(curr);
        return curr;
    }

    private static check(toCheck: any) {
        if (!toCheck || typeof toCheck !== 'object') {
            throw new Error(OBJECT_TRAVERSING_ERROR);
        }
    }

}