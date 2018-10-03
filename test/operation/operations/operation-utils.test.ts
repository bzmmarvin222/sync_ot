import {expect} from "chai";
import {INVALID_OPERATION_TYPE, OperationUtil} from "../../../lib/operation/operations/operation-util";
import {Operation, OperationType} from "../../../lib";

describe('OperationUtil should perform the expected operations correctly', () => {

    let objectToSync: { test: string[] };
    let expected: string;
    let insertion: Operation;
    let init: Operation;
    let replacement: Operation;
    let deletion: Operation;

    beforeEach(() => {
        objectToSync = {
            test: [
                'test_index_1',
                'test_index_2'
            ]
        };
        expected = 'Test';

        //this should transform the string 'test_index_2' to 'tTestest_index_2'
        insertion = {
            range: {
                start: 1,
                //end will be ignored on insertion
                end: -1
            },
            type: OperationType.INSERT,
            data: expected,
            objectPath: ['test', 1]
        };

        init = {
            range: {
                start: -1,
                end: -1
            },
            type: OperationType.INIT,
            data: {foo: {bar: 'foobar'}},
            objectPath: []
        };

        replacement = {
            range: {
                start: -1,
                end: -1
            },
            type: OperationType.FULL_REPLACEMENT,
            data: expected,
            objectPath: ['test', 1]
        };

        deletion = {
            range: {
                start: -1,
                end: -1
            },
            type: OperationType.DELETE,
            data: expected,
            objectPath: ['test', 1]
        };
    });

    it('should throw error if the passed operation has mismatched type', function () {
        //force tsc to let this pass
        insertion.type = null as any;
        expect(() => OperationUtil.transform(objectToSync, insertion)).to.throw(INVALID_OPERATION_TYPE);
    });

    it('should insert the desired string at the desired index', function () {
        expected = 'tTestest_index_2';
        OperationUtil.transform(objectToSync, insertion);
        expect(objectToSync.test[1]).to.equal(expected);
    });

    it('should insert the desired string at the end with an empty string', function () {
        objectToSync.test[1] = '';
        OperationUtil.transform(objectToSync, insertion);
        expect(objectToSync.test[1]).to.equal(expected);
    });

    it('should insert the desired string at the end with a way too high starting index', function () {
        insertion.range.start = 999;
        expected = objectToSync.test[1] + expected;
        OperationUtil.transform(objectToSync, insertion);
        expect(objectToSync.test[1]).to.equal(expected);
    });

    it('should reinit without breaking the old reference', function () {
        expected = 'foobar';
        const oldRef = objectToSync;
        OperationUtil.transform(objectToSync, init);
        expect(oldRef).to.equal(objectToSync);
        expect(objectToSync.test).to.not.be.ok;
        expect(objectToSync['foo']).to.be.ok;
        expect(objectToSync['foo']['bar']).to.equal(expected);
    });

    it('should fully replace the value at the given path', function () {
        OperationUtil.transform(objectToSync, replacement);
        expect(objectToSync.test[1]).to.equal(expected);
    });

    it('should fully replace the value at the given path with object', function () {
        expected = 'ect';
        replacement.data = {obj: 'ect'};
        OperationUtil.transform(objectToSync, replacement);
        expect(objectToSync.test[1]['obj']).to.equal(expected);
    });

    it('should remove from an array correctly', function () {
        OperationUtil.transform(objectToSync, deletion);
        expect(objectToSync.test[1]).to.not.be.ok;
        expect(objectToSync.test.length).to.equal(1);
    });

    it('should remove objects correctly', function () {
        deletion.objectPath = ['test'];
        OperationUtil.transform(objectToSync, deletion);
        expect(objectToSync.test).to.not.be.ok;
    });
});