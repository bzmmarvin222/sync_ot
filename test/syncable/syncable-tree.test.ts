import {expect} from "chai";
import {CHILD_KEY, DATA_KEY, SyncableTree} from "../../lib/syncable/syncable-tree";
import {Operation, OperationType} from "../../lib";


describe('SyncableTree should perform the expected operations correctly', () => {

    let expectedRootData: string;
    let expectedFirstChildData: string;
    let expectedSecondChildDta: string;

    beforeEach(() => {
        expectedRootData = 'Test';
        expectedFirstChildData = 'first_child';
        expectedSecondChildDta = 'second_child';
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
});