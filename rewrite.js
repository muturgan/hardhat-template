const fs = require('fs');
const https = require('https');
const path = require('path');

const fetchData = (urlPath) => new Promise((resolve, reject) => {
	https.get(
		`https://api.github.com/repos/${urlPath}`,
		{headers: {'user-agent': 'node'}},
		async (res) => {

			res.on('error', (err) => {
				reject(err);
			});

			const chunks = [];
			res.on('data', (chunk) => {
				chunks.push(chunk);
			});

			res.on('end', () => {
				const responseBody = Buffer.concat(chunks).toString();
				try {
					const parsed = JSON.parse(responseBody);
					resolve(parsed);
				} catch {
					reject(responseBody);
				}
			});
	});
});

const gitConfig = fs.readFileSync(path.join('.git', 'config')).toString();
const lines = gitConfig.split('\n');
const originUrl = lines.find((l) => l.includes('git@github.com'));
const originUrlPath = originUrl.split(':')[1].split('.')[0];


fetchData(originUrlPath).then(({name, description}) => {
	const packageJson = JSON.parse(fs.readFileSync('package.json').toString());
	packageJson.name = name;
	packageJson.description = description;
	packageJson.repository.url = `git+https://github.com/${originUrlPath}.git`;
	packageJson.bugs.url = `https://github.com/${originUrlPath}/issues`;
	packageJson.homepage = `https://github.com/${originUrlPath}#readme`;

	const newPackageJsonContent = JSON.stringify(packageJson, null, 2) + '\n';
	fs.writeFileSync('package.json', newPackageJsonContent);

	const packageLockJson = JSON.parse(fs.readFileSync('package-lock.json').toString());
	packageLockJson.name = name;
	const newPackageLockJsonContent = JSON.stringify(packageLockJson, null, 2) + '\n';
	fs.writeFileSync('package-lock.json', newPackageLockJsonContent);

	const newReadmeContent = `# ${name}\n${description}\n`;
	fs.writeFileSync('README.md', newReadmeContent);

	fs.unlinkSync('rewrite.js');
});
