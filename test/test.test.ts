import { assert, expect } from './chai';
import { deployments, ethers, getNamedAccounts } from 'hardhat';

describe('A Suite Name', () => {
	it('A Test Case Name', async () => {
		await deployments.fixture('ContractName');
		const constract = await ethers.getContract('ContractName');

		const { deployer } = await getNamedAccounts();
	});
});
