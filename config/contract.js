const CONTRACT_ADDRESS = "0x4260411c694A5ed6916386E4Ed201645eE6C46D2";

const CONTRACT_ABI = [
  "event Deposited(address indexed user, uint256 amount, uint256 unlockTime)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "function deposit(uint256 _lockTime) external payable",
  "function withdraw() external",
  "function getDeposit(address _user) external view returns (tuple(uint256 amount, uint256 unlockTime))"
];

export { CONTRACT_ADDRESS, CONTRACT_ABI }; 