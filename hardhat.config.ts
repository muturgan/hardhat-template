import dotenv from 'dotenv';
import { HardhatUserConfig } from 'hardhat/config';
import { HARDHAT_PROVIDER_URL } from './constants';

import 'hardhat-deploy';
import 'hardhat-deploy-ethers';
import '@typechain/hardhat';
import 'solidity-coverage';
import '@nomiclabs/hardhat-etherscan';

dotenv.config();


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
	solidity: {
		version: '0.8.15',
		settings: {
			optimizer: {
				enabled: true,
				runs: 200,
			},
		},
	},
	defaultNetwork: 'hardhat',
	networks: {
		hardhat: {
			// the url is 'http://localhost:8545' but you should not define it
		},
		localhost: {
			url: HARDHAT_PROVIDER_URL,
		},
		rinkeby: {
			url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
			accounts: [process.env.DEPLOYER_PRIVATE_KEY as string],
		},
	},
	etherscan: {
		apiKey: process.env.ETHERSCAN_API_KEY,
	},
	namedAccounts: {
		deployer: 0,
		user1: 1,
		user2: 2,
	},
};

export default config;
