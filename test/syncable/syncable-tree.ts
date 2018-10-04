import {expect} from "chai";
import {SyncableTree} from "../../lib/syncable/syncable-tree";


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
        const treePath: number[] = syncTree.getPathFromRoot();
        expect(treePath.length).to.equal(0);
    });

    it('should return the tree path from root as [0] on first child', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const child = syncTree.addChild(expectedFirstChildData);
        const treePath: number[] = child.getPathFromRoot();
        expect(treePath.length).to.equal(1);
        expect(treePath[0]).to.equal(0);
    });

    it('should return the tree path from root as [1] on second child', function () {
        const syncTree: SyncableTree<string> = SyncableTree.root(expectedRootData);
        const firstChild = syncTree.addChild(expectedFirstChildData);
        const secondChild = syncTree.addChild(expectedFirstChildData);
        const treePath: number[] = secondChild.getPathFromRoot();
        expect(treePath.length).to.equal(1);
        expect(treePath[0]).to.equal(1);
    });
});