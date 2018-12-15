import {expect} from "chai";
import {OBJECT_TRAVERSING_ERROR, ObjectTraversingUtil} from "../../src/operation/object-traversing-util";

describe('ObjectTraversingUtil should traverse and set values of objects correctly', () => {

    let objectToModify: { test: string[] };
    let expected: string;

    beforeEach(() => {
        objectToModify = {
            test: [
                'test_index_1',
                'test_index_2'
            ]
        };
        expected = 'Test';
    });

    it('should update value correctly in object', function () {
        ObjectTraversingUtil.applyValue(objectToModify, ['test', 1], expected);
        expect(objectToModify.test[1]).to.equal(expected);
    });

    it('should throw an error if the provided path does not exist in object tree', function () {
        expect(() => ObjectTraversingUtil.applyValue(objectToModify, ['foobar', 1], expected)).to.throw(OBJECT_TRAVERSING_ERROR);
    });

    it('should throw an error if the provided path has passed a non object while traversing', function () {
        const objectWithPrimitive = {test: 'now with primitive'};
        expect(() => ObjectTraversingUtil.applyValue(objectWithPrimitive, ['test', 1], expected)).to.throw(OBJECT_TRAVERSING_ERROR);
    });

    it('should throw an error if an empty or no path is provided on applying a value', function () {
        expect(() => ObjectTraversingUtil.applyValue(objectToModify, [], expected)).to.throw(OBJECT_TRAVERSING_ERROR);
    });

    it('should find value correctly in object', function () {
        expected = 'test_index_2';
        ObjectTraversingUtil.findValue(objectToModify, ['test', 1]);
        expect(objectToModify.test[1]).to.equal(expected);
    });

    it('should throw an error if the path to a searched value is not valid', function () {
        expect(() => ObjectTraversingUtil.findValue(objectToModify, [])).to.throw(OBJECT_TRAVERSING_ERROR);
    });

    it('should return the passed object if an empty or no path is provided', function () {
        const found = ObjectTraversingUtil.findWrappingObject(objectToModify, []);
        expect(found).to.equal(objectToModify);
    });
});