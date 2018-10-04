import {expect} from "chai";
import {INVALID_OPERATION_TYPE, OperationUtil} from "../../../lib/operation/operations/operation-util";
import {Operation, OperationType} from "../../../lib";
import {SyncableTree} from "../../../lib/syncable/syncable-tree";
import {root} from "rxjs/internal-compatibility";

describe('OperationUtil should perform the expected operations correctly', () => {

    let syncTree: SyncableTree<string>;
    let firstChild: SyncableTree<string>;
    let secondChild: SyncableTree<string>;
    let expectedRootData: string;
    let expectedFirstChildData: string;
    let expectedSecondChildDta: string;
    let exptedInsertion: string;
    let insertion: Operation;
    let init: Operation;
    let replacement: Operation;
    let deletion: Operation;

    beforeEach(() => {
        expectedRootData = 'Test';
        expectedFirstChildData = 'first_child';
        expectedSecondChildDta = 'second_child';
        exptedInsertion = 'Test';

        syncTree = SyncableTree.root(expectedRootData);
        firstChild = syncTree.addChild(expectedFirstChildData);
        secondChild = syncTree.addChild(expectedSecondChildDta);

        //this should transform the string 'first_child' to 'fTestirst_child'
        insertion = firstChild.createInsertion(1, exptedInsertion);

        init = {
            range: {
                start: -1,
                end: -1
            },
            type: OperationType.INIT,
            // data: {
            //     children: []
            // }
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
        const expected = 'fTestirst_child';
        OperationUtil.transform(syncTree, insertion);
        expect(syncTree.children[0].data).to.equal(expected);
    });

    it('should insert the desired string at the end with an empty string', function () {
        firstChild.data = '';
        OperationUtil.transform(syncTree, insertion);
        expect(firstChild.data).to.equal(exptedInsertion);
    });
    //
    it('should insert the desired string at the end with a way too high starting index', function () {
        if (!insertion.range) {
            insertion.range = {start: 0, end: 0};
        }
        insertion.range.start = 999;
        const expected = expectedFirstChildData + exptedInsertion;
        OperationUtil.transform(syncTree, insertion);
        expect(firstChild.data).to.equal(expected);
    });
    //
    // it('should reinit without breaking the old reference', function () {
    //     expectedRootData = 'foobar';
    //     const oldRef = syncTree;
    //     OperationUtil.transform(syncTree, init);
    //     expect(oldRef).to.equal(syncTree);
    //     expect(syncTree.test).to.not.be.ok;
    //     expect(syncTree['foo']).to.be.ok;
    //     expect(syncTree['foo']['bar']).to.equal(expectedRootData);
    // });
    //
    // it('should fully replace the value at the given path', function () {
    //     OperationUtil.transform(syncTree, replacement);
    //     expect(syncTree.test[1]).to.equal(expectedRootData);
    // });
    //
    // it('should fully replace the value at the given path with object', function () {
    //     expectedRootData = 'ect';
    //     replacement.data = {obj: 'ect'};
    //     OperationUtil.transform(syncTree, replacement);
    //     expect(syncTree.test[1]['obj']).to.equal(expectedRootData);
    // });
    //
    // it('should remove from an array correctly', function () {
    //     OperationUtil.transform(syncTree, deletion);
    //     expect(syncTree.test[1]).to.not.be.ok;
    //     expect(syncTree.test.length).to.equal(1);
    // });
    //
    // it('should remove objects correctly', function () {
    //     deletion.objectPath = ['test'];
    //     OperationUtil.transform(syncTree, deletion);
    //     expect(syncTree.test).to.not.be.ok;
    // });
});