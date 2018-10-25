import {expect} from "chai";
import {CHILD_KEY, DATA_KEY, SyncableTree} from "../../lib/syncable/syncable-tree";
import {Operation, OperationType} from "../../lib";
import {Guid} from "guid-typescript/dist/guid";


describe('SyncableTree should perform the expected operations correctly', () => {

    let expectedRootData: string;
    let expectedFirstChildData: string;
    let expectedSecondChildDta: string;

    beforeEach(() => {
        expectedRootData = 'Test';
        expectedFirstChildData = 'first_child';
        expectedSecondChildDta = 'second_child';
    });

    it('should return a non recursive json representation without modifying the tree state', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const firstChild = syncTree.addChild(expectedFirstChildData);
        const secondChild = syncTree.addChild(expectedFirstChildData);
        const json: string = syncTree.toJson();
        expect(json).to.be.ok;
        expect(syncTree.children[0]).to.equal(firstChild);
        expect(firstChild.parent).to.equal(syncTree);
    });

    it('should create a fully working tree of the json representation', function () {
        let syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        let firstChild = syncTree.addChild(expectedFirstChildData);
        let secondChild = syncTree.addChild(expectedFirstChildData);
        const id: Guid = syncTree.nodeId;
        const json: string = syncTree.toJson();
        syncTree = SyncableTree.fromJson(json);
        expect(syncTree).to.be.ok;
        expect(syncTree.nodeId.equals(id)).to.be.ok;
        expect(syncTree.data).to.equal(expectedRootData);
        expect(syncTree.children.length).to.equal(2);
        expect(syncTree.children[0].data).to.equal(expectedFirstChildData);
        expect(syncTree.children[0].parent).to.equal(syncTree);
    });

    it('should create an empty root node correctly', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root();
        expect(syncTree).to.be.ok;
        expect(syncTree.children.length).to.equal(0);
        expect(syncTree.data).to.be.not.ok;
    });

    it('should create an root node with initial data correctly', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        expect(syncTree).to.be.ok;
        expect(syncTree.nodeId).to.be.ok;
        expect(syncTree.children.length).to.equal(0);
        expect(syncTree.data).to.equal(expectedRootData);
    });


    it('should append a child correctly', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const child = syncTree.addChild(expectedFirstChildData);
        expect(syncTree.children.length).to.equal(1);
        expect(syncTree.children[0].data).to.equal(expectedFirstChildData);
        expect(child.data).to.equal(expectedFirstChildData);
    });

    it('should return the tree path from root as empty array on root', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const treePath: (number | string)[] = syncTree.getPathFromRoot();
        expect(treePath.length).to.equal(0);
    });

    it('should return the tree path from root as ["children", 0] on first child', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const child = syncTree.addChild(expectedFirstChildData);
        const treePath: (number | string)[] = child.getPathFromRoot();
        expect(treePath.length).to.equal(2);
        expect(treePath[0]).to.equal(CHILD_KEY);
    });

    it('should return the tree path from root as ["children", 0] on first child and append the data accessor', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const child = syncTree.addChild(expectedFirstChildData);
        const treePath: (number | string)[] = child.getDataPathFromRoot();
        expect(treePath.length).to.equal(3);
        expect(treePath[0]).to.equal(CHILD_KEY);
        expect(treePath[1]).to.equal(0);
        expect(treePath[2]).to.equal(DATA_KEY);
    });

    it('should return the tree path from root as [1] on second child', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const firstChild = syncTree.addChild(expectedFirstChildData);
        const secondChild = syncTree.addChild(expectedFirstChildData);
        const treePath: (number | string)[] = secondChild.getPathFromRoot();
        expect(treePath.length).to.equal(2);
        expect(treePath[1]).to.equal(1);
    });

    it('should return a correct insertion operation', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const child = syncTree.addChild(expectedFirstChildData);
        const index: number = 1;
        const insertion: string = 'Test';
        const operation: Operation = child.createInsertion(index, insertion);
        expect(operation).to.be.ok;
        expect(operation.type).to.equal(OperationType.INSERT);
        const opRange = operation.range;
        expect(opRange).to.be.ok;
        expect((opRange || {}).start).to.equal(index);
        expect(operation.data).to.equal(insertion);
    });

    it('should return a correct node deletion operation', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const firstChild = syncTree.addChild(expectedFirstChildData);
        const operation: Operation = firstChild.createNodeDeletion();
        expect(operation).to.be.ok;
        expect(operation.type).to.equal(OperationType.DELETE);
        expect(operation.objectPath.length).to.equal(2);
        expect(operation.objectPath[1]).to.equal(0);
    });

    it('should return a correct node-data deletion operation', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const firstChild = syncTree.addChild(expectedFirstChildData);
        const operation: Operation = firstChild.createNodeDataDeletion();
        expect(operation).to.be.ok;
        expect(operation.type).to.equal(OperationType.DELETE);
        expect(operation.objectPath.length).to.equal(3);
        expect(operation.objectPath[2]).to.equal(DATA_KEY);
    });

    it('should return a correct replacement operation', function () {
        const expected: string = 'TestReplacement';
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const firstChild = syncTree.addChild(expectedFirstChildData);
        const operation: Operation = firstChild.createReplacement(expected);
        expect(operation).to.be.ok;
        expect(operation.type).to.equal(OperationType.FULL_REPLACEMENT);
        expect(operation.objectPath.length).to.equal(3);
        expect(operation.data).to.equal(expected);
    });

    it('should return a correct child appendation operation', function () {
        const expected: string = 'TestAppend';
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const firstChild = syncTree.addChild(expectedFirstChildData);
        const operation: Operation = firstChild.createChildAppend(expected);
        expect(operation).to.be.ok;
        expect(operation.type).to.equal(OperationType.CHILD_APPEND);
        expect(operation.objectPath.length).to.equal(2);
        expect(operation.data).to.equal(expected);
    });

    it('should emit the latest data after setting it', function (done) {
        let emits = 0;
        let expectedEmittedValue = expectedRootData;
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        syncTree.dataChanges$.subscribe(data => {
            expect(data).to.equal(expectedEmittedValue);
            emits ++;
            if (emits === 2) {
                done();
            }
        });
        expect(syncTree.data).to.equal(expectedRootData);
        expectedEmittedValue = 'Emit';
        syncTree.data = expectedEmittedValue;
    });

    it('should append additional path information for the data object if passed', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        let fromRoot = syncTree.getDataPathFromRoot();
        expect(fromRoot.length).to.equal(1);
        fromRoot = syncTree.getDataPathFromRoot('key');
        expect(fromRoot.length).to.equal(2);
        expect(fromRoot[1]).to.equal('key');
    });
});