// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title  Voting
 * @notice A simple, transparent on-chain election contract.
 *         - The deployer (owner) can add candidates before / during the election.
 *         - Each Ethereum address may cast exactly one vote.
 *         - Anyone can read the live leaderboard via getAllCandidates().
 * @dev    Designed for the BCT Mini-Project — runs on Hardhat localhost & Sepolia.
 */
contract Voting {
    // ──────────────────────────────────────────────
    //  Data Structures
    // ──────────────────────────────────────────────

    /// @notice Represents a single election candidate.
    struct Candidate {
        uint256 id;        // 1-based unique identifier
        string  name;      // Human-readable display name
        uint256 voteCount; // Accumulated votes
    }

    // ──────────────────────────────────────────────
    //  State Variables
    // ──────────────────────────────────────────────

    /// @notice The account that deployed this contract (election administrator).
    address public owner;

    /// @notice Packed array of all registered candidates (index = candidateId - 1).
    Candidate[] private candidates;

    /// @notice Tracks whether an address has already voted.
    mapping(address => bool) public hasVoted;

    // ──────────────────────────────────────────────
    //  Events
    // ──────────────────────────────────────────────

    /// @notice Emitted when a new candidate is registered.
    event CandidateAdded(uint256 indexed id, string name);

    /// @notice Emitted when a vote is successfully cast.
    event VoteCast(address indexed voter, uint256 indexed candidateId);

    // ──────────────────────────────────────────────
    //  Modifiers
    // ──────────────────────────────────────────────

    /// @dev Restricts a function to the contract owner.
    modifier onlyOwner() {
        require(msg.sender == owner, "Voting: caller is not the owner");
        _;
    }

    /// @dev Prevents an address from voting more than once.
    modifier notVoted() {
        require(!hasVoted[msg.sender], "Voting: address has already voted");
        _;
    }

    // ──────────────────────────────────────────────
    //  Constructor
    // ──────────────────────────────────────────────

    /**
     * @notice Deploys the contract and sets the owner.
     *         Optionally bootstraps a list of initial candidates.
     * @param initialCandidates Array of candidate names to register at deploy time.
     */
    constructor(string[] memory initialCandidates) {
        owner = msg.sender;

        // Register any candidates supplied at deploy time.
        for (uint256 i = 0; i < initialCandidates.length; i++) {
            _addCandidate(initialCandidates[i]);
        }
    }

    // ──────────────────────────────────────────────
    //  Owner Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Registers a new candidate.
     * @dev    Only the owner may call this function.
     * @param  _name Display name of the candidate (must be non-empty).
     */
    function addCandidate(string calldata _name) external onlyOwner {
        require(bytes(_name).length > 0, "Voting: candidate name cannot be empty");
        _addCandidate(_name);
    }

    // ──────────────────────────────────────────────
    //  Voter Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Cast a vote for the candidate with the given ID.
     * @dev    Reverts if the caller has already voted or if the candidateId
     *         is out of range.
     * @param  _candidateId The 1-based ID of the target candidate.
     */
    function vote(uint256 _candidateId) external notVoted {
        require(
            _candidateId > 0 && _candidateId <= candidates.length,
            "Voting: invalid candidate ID"
        );

        // Mark sender as having voted BEFORE state change (CEI pattern).
        hasVoted[msg.sender] = true;

        // Increment vote count (ID is 1-based; array index is 0-based).
        candidates[_candidateId - 1].voteCount += 1;

        emit VoteCast(msg.sender, _candidateId);
    }

    // ──────────────────────────────────────────────
    //  View / Pure Functions
    // ──────────────────────────────────────────────

    /**
     * @notice Returns the complete list of candidates with live vote counts.
     * @return An array of Candidate structs — the live leaderboard.
     */
    function getAllCandidates() external view returns (Candidate[] memory) {
        return candidates;
    }

    /**
     * @notice Returns the total number of registered candidates.
     */
    function getCandidateCount() external view returns (uint256) {
        return candidates.length;
    }

    /**
     * @notice Returns a single candidate by their 1-based ID.
     * @param  _candidateId The 1-based ID of the candidate.
     */
    function getCandidate(uint256 _candidateId)
        external
        view
        returns (Candidate memory)
    {
        require(
            _candidateId > 0 && _candidateId <= candidates.length,
            "Voting: invalid candidate ID"
        );
        return candidates[_candidateId - 1];
    }

    // ──────────────────────────────────────────────
    //  Internal Helpers
    // ──────────────────────────────────────────────

    /**
     * @dev Shared internal logic for adding a candidate.
     *      Assigns a sequential 1-based ID automatically.
     */
    function _addCandidate(string memory _name) internal {
        uint256 newId = candidates.length + 1;
        candidates.push(Candidate({ id: newId, name: _name, voteCount: 0 }));
        emit CandidateAdded(newId, _name);
    }
}
