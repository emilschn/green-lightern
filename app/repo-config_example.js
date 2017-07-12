module.exports = {
    'url': 'https://github.com/...', // The repo URL you want to optimize
    'id': '...', // The id (will be used for the folder)
    'newBranch': 'optimization', // The name of the new branch that will be pushed
    'localPath': 'temp', // The local folder where you want to clone the repo
	'folders': [ // The repo folder list where there are images to optimize
		'images/',
		'images/common/',
		'images/footer/',
		'images/navbar/',
		'images/partage/',
		'images/reseaux/',
		'images/slider/',
		'images/template-project/',
		'images/template-project-list/'
	],
	'commitMessage': 'Images optimization for a better world!' // The message that will be used for the commit
}