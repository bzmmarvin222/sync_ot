import {expect} from "chai";
import {INVALID_OPERATION_TYPE, OperationUtil} from "../../../lib/operation/operations/operation-util";
import {Operation} from "../../../lib/operation/operation";
import {OperationType} from "../../../lib/operation/operation-type";

describe('OperationUtil should perform the expected operations correctly', () => {

    let objectToSync: { test: string[] };
    let expected: string;
    let insertion: Operation;

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

});