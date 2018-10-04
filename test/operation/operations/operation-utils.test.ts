import {expect} from "chai";
import {INVALID_OPERATION_TYPE, OperationUtil} from "../../../lib/operation/operations/operation-util";
import {Operation, OperationType} from "../../../lib";
import {SyncableTree} from "../../../lib/syncable/syncable-tree";

describe('OperationUtil should perform the expected operations correctly', () => {

    let syncTree: SyncableTree<string>;
    let expectedRootData: string;
    let expectedFirstChildData: string;
    let expectedSecondChildDta: string;
    let insertion: Operation;
    let init: Operation;
    let replacement: Operation;
    let deletion: Operation;

    beforeEach(() => {
        syncTree = SyncableTree.root(expectedRootData);
        expectedRootData = 'Test';
        expectedFirstChildData = 'first_child';
        expectedSecondChildDta = 'second_child';

        //this should transform the string 'test_index_2' to 'tTestest_index_2'
        insertion = {
            range: {
                start: 1,
                //end will be ignored on insertion
                end: -1
            },
            type: OperationType.INSERT,
            data: expectedRootData,
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
            data: expectedRootData,
            objectPath: ['test', 1]
        };

        deletion = {
            range: {
                start: -1,
                end: -1
            },
            type: OperationType.DELETE,
            data: expectedRootData,
            objectPath: ['test', 1]
        };
    });

    it('should throw error if the passed operation has mismatched type', function () {
        //force tsc to let this pass
        insertion.type = null as any;
        expect(() => OperationUtil.transform(syncTree, insertion)).to.throw(INVALID_OPERATION_TYPE);
    });

    it('should insert the desired string at the desired index', function () {
        expectedRootData = 'tTestest_index_2';
        OperationUtil.transform(syncTree, insertion);
        expect(syncTree.test[1]).to.equal(expectedRootData);
    });

    it('should insert the desired string at the end with an empty string', function () {
        syncTree.test[1] = '';
        OperationUtil.transform(syncTree, insertion);
        expect(syncTree.test[1]).to.equal(expectedRootData);
    });

    it('should insert the desired string at the end with a way too high starting index', function () {
        insertion.range.start = 999;
        expectedRootData = syncTree.test[1] + expectedRootData;
        OperationUtil.transform(syncTree, insertion);
        expect(syncTree.test[1]).to.equal(expectedRootData);
    });

    it('should reinit without breaking the old reference', function () {
        expectedRootData = 'foobar';
        const oldRef = syncTree;
        OperationUtil.transform(syncTree, init);
        expect(oldRef).to.equal(syncTree);
        expect(syncTree.test).to.not.be.ok;
        expect(syncTree['foo']).to.be.ok;
        expect(syncTree['foo']['bar']).to.equal(expectedRootData);
    });

    it('should fully replace the value at the given path', function () {
        OperationUtil.transform(syncTree, replacement);
        expect(syncTree.test[1]).to.equal(expectedRootData);
    });

    it('should fully replace the value at the given path with object', function () {
        expectedRootData = 'ect';
        replacement.data = {obj: 'ect'};
        OperationUtil.transform(syncTree, replacement);
        expect(syncTree.test[1]['obj']).to.equal(expectedRootData);
    });

    it('should remove from an array correctly', function () {
        OperationUtil.transform(syncTree, deletion);
        expect(syncTree.test[1]).to.not.be.ok;
        expect(syncTree.test.length).to.equal(1);
    });

    it('should remove objects correctly', function () {
        deletion.objectPath = ['test'];
        OperationUtil.transform(syncTree, deletion);
        expect(syncTree.test).to.not.be.ok;
    });
});