import {expect} from "chai";
import {INVALID_OPERATION_TYPE, OperationUtil} from "../../../lib/operation/operations/operation-util";
import {Operation} from "../../../lib";
import {SyncableTree} from "../../../lib/syncable/syncable-tree";

describe('OperationUtil should perform the expected operations correctly', () => {

    let syncTree: SyncableTree<string>;
    let firstChild: SyncableTree<string>;
    let secondChild: SyncableTree<string>;
    let expectedRootData: string;
    let expectedFirstChildData: string;
    let expectedSecondChildDta: string;
    let exptedInsertion: string;
    let expectedReplacement: string;
    let expectedAppend: string;
    let insertion: Operation;
    let replacement: Operation;
    let nodeDeletion: Operation;
    let nodeDataDeletion: Operation;
    let append: Operation;

    beforeEach(() => {
        expectedRootData = 'Test';
        expectedFirstChildData = 'first_child';
        expectedSecondChildDta = 'second_child';
        exptedInsertion = 'Test';
        expectedReplacement = 'TestReplacement';
        expectedAppend = 'TestAppend';

        syncTree = SyncableTree.root(expectedRootData);
        firstChild = syncTree.addChild(expectedFirstChildData);
        secondChild = syncTree.addChild(expectedSecondChildDta);

        //this should transform the string 'first_child' to 'fTestirst_child'
        insertion = firstChild.createInsertion(1, exptedInsertion);
        replacement = firstChild.createReplacement(expectedReplacement);
        nodeDeletion = firstChild.createNodeDeletion();
        nodeDataDeletion = firstChild.createNodeDataDeletion();
        append = firstChild.createChildAppend(expectedAppend);
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

    it('should insert the desired string at the end with a way too high starting index', function () {
        if (!insertion.range) {
            insertion.range = {start: 0, end: 0};
        }
        insertion.range.start = 999;
        const expected = expectedFirstChildData + exptedInsertion;
        OperationUtil.transform(syncTree, insertion);
        expect(firstChild.data).to.equal(expected);
    });

    it('should fully replace the data at the given path', function () {
        OperationUtil.transform(syncTree, replacement);
        expect(firstChild.data).to.equal(expectedReplacement);
    });

    it('should remove a node correctly', function () {
        OperationUtil.transform(syncTree, nodeDeletion);
        expect(syncTree.children.length).to.equal(1);
        expect(syncTree.children.indexOf(firstChild)).to.equal(-1);
    });

    it('should remove data from a node correctly', function () {
        OperationUtil.transform(syncTree, nodeDataDeletion);
        expect(firstChild.data).to.be.not.ok;
    });

    it('should add a new child to a node correctly', function () {
        OperationUtil.transform(syncTree, append);
        expect(firstChild.children.length).to.equal(1);
        expect(firstChild.children[0].data).to.equal(expectedAppend);
    });

    it('should not perfom any operation if the id does not match the found node', function () {
        const length = syncTree.children.length;
        nodeDeletion.nodeId = 'test';
        OperationUtil.transform(syncTree, nodeDeletion);
        expect(syncTree.children[0]).to.equal(firstChild);
        expect(syncTree.children.length).to.equal(length);
    });
});