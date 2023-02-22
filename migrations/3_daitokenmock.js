const DaiTokenMock = artifacts.require("DaiTokenMock");

module.exports = async function(deployer) {
//   await deployer.deploy(Migrations);
  await deployer.deploy(DaiTokenMock);
  const tokenMock = await DaiTokenMock.deployed()
  // Mint 1,000 Dai Tokens for the deployer
  await tokenMock.mint(
    '0x5B0F1409e6713d086CE33389dd4682a6a5f97685',
    '1000000000000000000000'
  )
};