// test/Voting.test.js
// ──────────────────────────────────────────────────────────────────────────────
// Chai + Hardhat test suite for Voting.sol
//
// Run:  npx hardhat test
//       npm test
//
// Coverage areas:
//   1. Deployment  — owner set correctly, candidates seeded from constructor
//   2. addCandidate — onlyOwner guard, empty-name guard, correct state update
//   3. vote        — happy-path count increment, double-vote revert,
//                    out-of-range ID revert, emits VoteCast event
//   4. getAllCandidates / getCandidate — view functions return correct data
// ──────────────────────────────────────────────────────────────────────────────

const { expect }        = require("chai");
const { ethers }        = require("hardhat");
const { loadFixture }   = require("@nomicfoundation/hardhat-toolbox/network-helpers");

// ── Shared fixture ─────────────────────────────────────────────────────────────
// loadFixture deploys once and snapshots the chain state, then
// re-uses the snapshot for every test → super fast, no re-deploy overhead.
async function deployVotingFixture() {
  // Get named signers from Hardhat's built-in accounts
  const [owner, voter1, voter2, voter3, nonOwner] = await ethers.getSigners();

  // Seed two candidates at construction time
  const initialCandidates = ["Alice Johnson", "Bob Martinez"];
  const VotingFactory     = await ethers.getContractFactory("Voting");
  const voting            = await VotingFactory.deploy(initialCandidates);

  await voting.waitForDeployment();

  return { voting, owner, voter1, voter2, voter3, nonOwner, initialCandidates };
}

// ══════════════════════════════════════════════════════════════════════════════
describe("Voting Contract", function () {

  // ── 1. Deployment ──────────────────────────────────────────────────────────
  describe("Deployment", function () {

    it("should set the deployer as the owner", async function () {
      const { voting, owner } = await loadFixture(deployVotingFixture);
      expect(await voting.owner()).to.equal(owner.address);
    });

    it("should register the constructor candidates with correct IDs and zero votes", async function () {
      const { voting, initialCandidates } = await loadFixture(deployVotingFixture);

      const candidates = await voting.getAllCandidates();

      // Correct count
      expect(candidates.length).to.equal(initialCandidates.length);

      // Each candidate has sequential 1-based ID, matching name, and 0 votes
      for (let i = 0; i < initialCandidates.length; i++) {
        expect(candidates[i].id).to.equal(BigInt(i + 1));
        expect(candidates[i].name).to.equal(initialCandidates[i]);
        expect(candidates[i].voteCount).to.equal(0n);
      }
    });

    it("should report correct candidate count", async function () {
      const { voting, initialCandidates } = await loadFixture(deployVotingFixture);
      expect(await voting.getCandidateCount()).to.equal(initialCandidates.length);
    });

  });

  // ── 2. addCandidate ────────────────────────────────────────────────────────
  describe("addCandidate", function () {

    it("should allow the owner to add a new candidate", async function () {
      const { voting } = await loadFixture(deployVotingFixture);

      await voting.addCandidate("Carol Williams");

      const candidates = await voting.getAllCandidates();
      expect(candidates.length).to.equal(3);
      expect(candidates[2].name).to.equal("Carol Williams");
      expect(candidates[2].id).to.equal(3n);
    });

    it("should emit CandidateAdded event with correct args", async function () {
      const { voting } = await loadFixture(deployVotingFixture);

      await expect(voting.addCandidate("David Lee"))
        .to.emit(voting, "CandidateAdded")
        .withArgs(3n, "David Lee");
    });

    it("should REVERT when a non-owner tries to add a candidate", async function () {
      const { voting, nonOwner } = await loadFixture(deployVotingFixture);

      await expect(
        voting.connect(nonOwner).addCandidate("Hacker Pete")
      ).to.be.revertedWith("Voting: caller is not the owner");
    });

    it("should REVERT when an empty name is supplied", async function () {
      const { voting } = await loadFixture(deployVotingFixture);

      await expect(
        voting.addCandidate("")
      ).to.be.revertedWith("Voting: candidate name cannot be empty");
    });

  });

  // ── 3. vote ────────────────────────────────────────────────────────────────
  describe("vote", function () {

    it("should increment the correct candidate's vote count by 1", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);

      // Vote for candidate #1 (Alice Johnson)
      await voting.connect(voter1).vote(1);

      const aliceAfter = await voting.getCandidate(1);
      expect(aliceAfter.voteCount).to.equal(1n);

      // Candidate #2 (Bob) should remain at 0
      const bobAfter = await voting.getCandidate(2);
      expect(bobAfter.voteCount).to.equal(0n);
    });

    it("should accumulate votes from multiple different voters", async function () {
      const { voting, voter1, voter2, voter3 } = await loadFixture(deployVotingFixture);

      // All three vote for candidate #2 (Bob Martinez)
      await voting.connect(voter1).vote(2);
      await voting.connect(voter2).vote(2);
      await voting.connect(voter3).vote(2);

      const bob = await voting.getCandidate(2);
      expect(bob.voteCount).to.equal(3n);
    });

    it("should emit VoteCast event with correct voter address and candidate ID", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);

      await expect(voting.connect(voter1).vote(1))
        .to.emit(voting, "VoteCast")
        .withArgs(voter1.address, 1n);
    });

    it("should mark the voter address as hasVoted = true after voting", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);

      expect(await voting.hasVoted(voter1.address)).to.be.false;

      await voting.connect(voter1).vote(1);

      expect(await voting.hasVoted(voter1.address)).to.be.true;
    });

    // ── CRITICAL: Double-vote prevention ──────────────────────────────────
    it("⛔  should REVERT when the same address tries to vote twice", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);

      // First vote — should succeed
      await voting.connect(voter1).vote(1);

      // Second vote — must revert with the double-vote error
      await expect(
        voting.connect(voter1).vote(2)     // even for a different candidate
      ).to.be.revertedWith("Voting: address has already voted");
    });

    it("⛔  should REVERT for candidate ID = 0 (out of range)", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);

      await expect(
        voting.connect(voter1).vote(0)
      ).to.be.revertedWith("Voting: invalid candidate ID");
    });

    it("⛔  should REVERT for candidate ID greater than candidate count", async function () {
      const { voting, voter1 } = await loadFixture(deployVotingFixture);

      await expect(
        voting.connect(voter1).vote(999)
      ).to.be.revertedWith("Voting: invalid candidate ID");
    });

  });

  // ── 4. getAllCandidates / getCandidate ─────────────────────────────────────
  describe("View Functions", function () {

    it("getAllCandidates should reflect updated vote counts", async function () {
      const { voting, voter1, voter2 } = await loadFixture(deployVotingFixture);

      await voting.connect(voter1).vote(1);
      await voting.connect(voter2).vote(1);

      const candidates = await voting.getAllCandidates();
      expect(candidates[0].voteCount).to.equal(2n); // Alice = 2
      expect(candidates[1].voteCount).to.equal(0n); // Bob   = 0
    });

    it("getCandidate should REVERT for out-of-range ID", async function () {
      const { voting } = await loadFixture(deployVotingFixture);

      await expect(
        voting.getCandidate(0)
      ).to.be.revertedWith("Voting: invalid candidate ID");

      await expect(
        voting.getCandidate(99)
      ).to.be.revertedWith("Voting: invalid candidate ID");
    });

  });

});
