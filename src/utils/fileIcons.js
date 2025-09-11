import React from 'react';
// Replaced react-icons with simple emoji/text alternatives for better performance
// Simple emoji/text icons to replace react-icons
const FileIcons = {
  // Folders
  folder: '📁',
  folderOpen: '📂',
  
  // File types
  file: '📄',
  code: '💻',
  json: '🔗',
  markdown: '📝',
  html: '🌐',
  css: '🎨',
  js: '🟨',
  ts: '🔷',
  jsx: '⚛️',
  tsx: '⚛️',
  py: '🐍',
  docker: '🐳',
  git: '📁',
  config: '⚙️',
  package: '📦',
  database: '🗄️',
  terminal: '💻',
  lock: '🔒',
  rocket: '🚀'
};

/**
 * Get the appropriate icon for a file based on its extension and name
 * @param {string} fileName - The name of the file
 * @param {boolean} isDirectory - Whether this is a directory
 * @param {boolean} isOpen - Whether directory is open (for folder icons)
 * @returns {string} Emoji icon
 */
export function getFileIcon(fileName, isDirectory = false, isOpen = false) {
	if (isDirectory) {
		return isOpen ? FileIcons.folderOpen : FileIcons.folder;
	}
  
	const extension = fileName.split('.').pop()?.toLowerCase() || '';
	const baseName = fileName.toLowerCase();
  
	// Special files by name
	if (baseName === 'package.json') return FileIcons.package;
	if (baseName === 'readme.md' || baseName === 'readme.txt') return FileIcons.markdown;
	if (baseName === 'dockerfile') return FileIcons.docker;
	if (baseName === 'docker-compose.yml' || baseName === 'docker-compose.yaml') return FileIcons.docker;
	if (baseName === '.env' || baseName.startsWith('.env.')) return FileIcons.lock;
	if (baseName === '.gitignore') return FileIcons.git;
	if (baseName === 'vite.config.js' || baseName === 'vite.config.ts') return FileIcons.config;
	if (baseName === 'next.config.js' || baseName === 'next.config.ts') return FileIcons.config;
	if (baseName === 'setup.sh' || baseName.endsWith('.sh')) return FileIcons.terminal;
	if (baseName === 'requirements.txt') return FileIcons.py;
	if (baseName === 'yarn.lock' || baseName === 'package-lock.json') return FileIcons.lock;
	if (baseName === 'index.html') return FileIcons.html;
	if (baseName === 'tsconfig.json') return FileIcons.ts;
	if (baseName === '.eslintrc.js' || baseName === '.eslintrc.cjs' || baseName === '.eslintrc.json') return FileIcons.config;
	if (baseName === 'server.js' || baseName === 'main.py') return FileIcons.terminal;
	if (baseName === 'schema.sql') return FileIcons.database;
  
	// Extensions
	switch (extension) {
		case 'js':
			return FileIcons.js;
		case 'jsx':
			return FileIcons.jsx;
		case 'ts':
			return FileIcons.ts;
		case 'tsx':
			return FileIcons.tsx;
		case 'py':
			return FileIcons.py;
		case 'css':
			return FileIcons.css;
		case 'html':
			return FileIcons.html;
		case 'json':
			return FileIcons.json;
		case 'md':
			return FileIcons.markdown;
		case 'txt':
			return FileIcons.file;
		case 'sql':
			return FileIcons.database;
		case 'env':
			return FileIcons.lock;
		case 'sh':
		case 'bash':
		case 'zsh':
			return FileIcons.terminal;
		case 'yml':
		case 'yaml':
			return FileIcons.config;
		case 'toml':
			return FileIcons.config;
		case 'xml':
			return FileIcons.code;
		case 'php':
			return '🐘';
		case 'go':
			return '🐹';
		case 'rs':
			return '🦀';
		case 'java':
			return '☕';
		case 'rb':
			return '💎';
		case 'cs':
			return '🔷';
		default:
			return FileIcons.file;
	}
}

/**
 * Get the appropriate folder icon based on folder name
 * @param {string} folderName - The name of the folder
 * @param {boolean} isOpen - Whether the folder is expanded
 * @returns {string} Emoji icon
 */
function getFolderIcon(folderName, isOpen = false) {
	const name = folderName.toLowerCase().replace('/', '').trim();
  
	// Special folder names
	if (name === 'node_modules') return '📦';
	if (name === 'src' || name === 'source') return isOpen ? FileIcons.folderOpen : FileIcons.folder;
	if (name === 'components') return '⚛️';
	if (name === 'pages') return '📄';
	if (name === 'api' || name === 'server') return '🖥️';
	if (name === 'styles' || name === 'css') return '🎨';
	if (name === 'assets' || name === 'static' || name === 'public') return '🗃️';
	if (name === 'utils' || name === 'lib' || name === 'helpers') return '🔧';
	if (name === 'tests' || name === 'test' || name === '__tests__') return '🧪';
	if (name === 'docs' || name === 'documentation') return '📚';
	if (name === 'config' || name === 'configuration') return '⚙️';
	if (name === 'data') return '🗄️';
	if (name === 'agents') return '🤖';
	if (name === 'routes') return '🛣️';
	if (name === 'middleware') return '🔗';
	if (name === 'models') return '🗄️';
	if (name === 'controllers') return '🎮';
	if (name === 'views' || name === 'templates') return '🖼️';
	if (name === '.github') return '🐙';
	if (name === '.vscode' || name === '.vs') return '💙';
  
	// Default folder icons
	return isOpen ? FileIcons.folderOpen : FileIcons.folder;
}

/**
 * Get color for file icons based on file type
 * @param {string} fileName 
 * @param {boolean} isDirectory 
 * @returns {string} CSS color value
 */
export function getFileIconColor(fileName, isDirectory = false) {
	if (isDirectory) {
		return getFolderIconColor(fileName);
	}
  
	const extension = fileName.split('.').pop()?.toLowerCase() || '';
	const baseName = fileName.toLowerCase();
  
	// Special files
	if (baseName === 'package.json') return '#cb3837'; // npm red
	if (baseName === 'dockerfile' || baseName.includes('docker-compose')) return '#0db7ed'; // docker blue
	if (baseName.includes('.env')) return '#ffd500'; // env yellow
	if (baseName === '.gitignore') return '#f05033'; // git orange
	if (baseName === 'vite.config.js' || baseName === 'vite.config.ts') return '#646cff'; // vite purple
	if (baseName === 'next.config.js' || baseName === 'next.config.ts') return '#000000'; // next.js black
	if (baseName.endsWith('.sh')) return '#4eaa25'; // terminal green
	if (baseName === 'requirements.txt') return '#3776ab'; // python blue
	if (baseName === 'tsconfig.json') return '#3178c6'; // typescript blue
	if (baseName.includes('.eslintrc')) return '#4b32c3'; // eslint purple
	if (baseName === 'server.js' || baseName === 'main.py') return '#68a063'; // server green
	if (baseName === 'schema.sql') return '#336791'; // sql blue
  
	// Extensions
	switch (extension) {
		case 'js': return '#f7df1e'; // JS yellow
		case 'jsx': return '#61dafb'; // React blue
		case 'ts': return '#3178c6'; // TS blue
		case 'tsx': return '#3178c6'; // TS blue
		case 'py': return '#3776ab'; // Python blue
		case 'css': return '#1572b6'; // CSS blue
		case 'html': return '#e34f26'; // HTML orange
		case 'json': return '#000000'; // JSON black
		case 'md': return '#083fa1'; // Markdown blue
		case 'sql': return '#336791'; // SQL blue
		case 'yml':
		case 'yaml': return '#cb171e'; // YAML red
		case 'php': return '#777bb4'; // PHP purple
		case 'go': return '#00add8'; // Go cyan
		case 'rs': return '#000000'; // Rust black
		case 'java': return '#ed8b00'; // Java orange
		case 'rb': return '#cc342d'; // Ruby red
		case 'cs': return '#239120'; // C# green
		default: return '#6c757d'; // Default gray
	}
}

/**
 * Get color for folder icons
 * @param {string} folderName 
 * @returns {string} CSS color value
 */
export function getFolderIconColor(folderName) {
	const name = folderName.toLowerCase().replace('/', '').trim();
  
	if (name === 'node_modules') return '#8cc84b'; // Node green
	if (name === 'components') return '#61dafb'; // React blue
	if (name === 'api' || name === 'server') return '#68a063'; // Server green
	if (name === 'styles' || name === 'css') return '#1572b6'; // CSS blue
	if (name === 'agents') return '#ff6b6b'; // Agents red
	if (name === 'data' || name === 'models') return '#336791'; // Database blue
	if (name === '.github') return '#24292e'; // GitHub dark
  
	// Default folder color
	return '#ffc107'; // Folder yellow
}

// Optional explicit exports aggregator (helps if tooling had stale state)
export default {};
