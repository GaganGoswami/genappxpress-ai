import React from 'react';
// Using VS Code Icons set from react-icons for file type recognition
import { 
  VscFile, 
  VscFileCode, 
  VscJson, 
  VscMarkdown,
  VscSymbolClass,
  VscSymbolMethod,
  VscDatabase,
  VscGear,
  VscPackage,
  VscTextSize,
  VscBrowser,
  VscTerminal,
  VscLock,
  VscGitIgnore,
  VscRocket
} from 'react-icons/vsc';
import { 
  FaFolder, 
  FaFolderOpen,
  FaReact, 
  FaNodeJs, 
  FaPython,
  FaJs,
  FaCss3,
  FaHtml5,
  FaDocker,
  FaGithub
} from 'react-icons/fa';
import { 
  SiTypescript,
  SiTailwindcss,
  SiVite,
  SiExpress,
  SiFastapi,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiSupabase,
  SiNextdotjs,
  SiNuxtdotjs,
  SiSvelte,
  SiVuedotjs,
  SiAngular,
  SiDjango,
  SiFlask,
  SiNestjs,
  SiSpringboot,
  SiRubyonrails,
  SiPhp,
  SiGo,
  SiRust,
  SiDotnet
} from 'react-icons/si';

/**
 * Get the appropriate icon component for a file based on its extension and name
 * @param {string} fileName - The name of the file
 * @param {boolean} isDirectory - Whether this is a directory
 * @param {boolean} isOpen - Whether directory is open (for folder icons)
 * @returns {React.Component} Icon component
 */
export function getFileIcon(fileName, isDirectory = false, isOpen = false) {
  if (isDirectory) {
    return getFolderIcon(fileName, isOpen);
  }
  
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const baseName = fileName.toLowerCase();
  
  // Special files by name
  if (baseName === 'package.json') return <VscPackage className="file-icon" />;
  if (baseName === 'readme.md' || baseName === 'readme.txt') return <VscMarkdown className="file-icon" />;
  if (baseName === 'dockerfile') return <FaDocker className="file-icon" />;
  if (baseName === 'docker-compose.yml' || baseName === 'docker-compose.yaml') return <FaDocker className="file-icon" />;
  if (baseName === '.env' || baseName.startsWith('.env.')) return <VscLock className="file-icon" />;
  if (baseName === '.gitignore') return <VscGitIgnore className="file-icon" />;
  if (baseName === 'vite.config.js' || baseName === 'vite.config.ts') return <SiVite className="file-icon" />;
  if (baseName === 'next.config.js' || baseName === 'next.config.ts') return <SiNextdotjs className="file-icon" />;
  if (baseName === 'setup.sh' || baseName.endsWith('.sh')) return <VscTerminal className="file-icon" />;
  if (baseName === 'requirements.txt') return <FaPython className="file-icon" />;
  if (baseName === 'yarn.lock' || baseName === 'package-lock.json') return <VscLock className="file-icon" />;
  if (baseName === 'index.html') return <FaHtml5 className="file-icon" />;
  if (baseName === 'tsconfig.json') return <SiTypescript className="file-icon" />;
  if (baseName === '.eslintrc.js' || baseName === '.eslintrc.cjs' || baseName === '.eslintrc.json') return <VscGear className="file-icon" />;
  if (baseName === 'server.js' || baseName === 'main.py') return <VscTerminal className="file-icon" />;
  if (baseName === 'schema.sql') return <VscDatabase className="file-icon" />;
  
  // Extensions
  switch (extension) {
    case 'js':
      return <FaJs className="file-icon" />;
    case 'jsx':
      return <FaReact className="file-icon" />;
    case 'ts':
      return <SiTypescript className="file-icon" />;
    case 'tsx':
      return <SiTypescript className="file-icon" />;
    case 'py':
      return <FaPython className="file-icon" />;
    case 'css':
      return <FaCss3 className="file-icon" />;
    case 'html':
      return <FaHtml5 className="file-icon" />;
    case 'json':
      return <VscJson className="file-icon" />;
    case 'md':
      return <VscMarkdown className="file-icon" />;
    case 'txt':
      return <VscTextSize className="file-icon" />;
    case 'sql':
      return <VscDatabase className="file-icon" />;
    case 'env':
      return <VscLock className="file-icon" />;
    case 'sh':
    case 'bash':
    case 'zsh':
      return <VscTerminal className="file-icon" />;
    case 'yml':
    case 'yaml':
      return <VscGear className="file-icon" />;
    case 'toml':
      return <VscGear className="file-icon" />;
    case 'xml':
      return <VscFileCode className="file-icon" />;
    case 'php':
      return <SiPhp className="file-icon" />;
    case 'go':
      return <SiGo className="file-icon" />;
    case 'rs':
      return <SiRust className="file-icon" />;
    case 'java':
      return <VscSymbolClass className="file-icon" />;
    case 'rb':
      return <VscSymbolMethod className="file-icon" />;
    case 'cs':
      return <SiDotnet className="file-icon" />;
    default:
      return <VscFile className="file-icon" />;
  }
}

/**
 * Get the appropriate folder icon based on folder name
 * @param {string} folderName - The name of the folder
 * @param {boolean} isOpen - Whether the folder is expanded
 * @returns {React.Component} Icon component
 */
function getFolderIcon(folderName, isOpen = false) {
  const name = folderName.toLowerCase().replace('/', '').trim();
  
  // Special folder names
  if (name === 'node_modules') return <FaNodeJs className="folder-icon" />;
  if (name === 'src' || name === 'source') return isOpen ? <FaFolderOpen className="folder-icon" /> : <FaFolder className="folder-icon" />;
  if (name === 'components') return <FaReact className="folder-icon" />;
  if (name === 'pages') return <VscBrowser className="folder-icon" />;
  if (name === 'api' || name === 'server') return <VscTerminal className="folder-icon" />;
  if (name === 'styles' || name === 'css') return <FaCss3 className="folder-icon" />;
  if (name === 'assets' || name === 'static' || name === 'public') return <VscPackage className="folder-icon" />;
  if (name === 'utils' || name === 'lib' || name === 'helpers') return <VscGear className="folder-icon" />;
  if (name === 'tests' || name === 'test' || name === '__tests__') return <VscRocket className="folder-icon" />;
  if (name === 'docs' || name === 'documentation') return <VscMarkdown className="folder-icon" />;
  if (name === 'config' || name === 'configuration') return <VscGear className="folder-icon" />;
  if (name === 'data') return <VscDatabase className="folder-icon" />;
  if (name === 'agents') return <VscRocket className="folder-icon" />;
  if (name === 'routes') return <VscSymbolMethod className="folder-icon" />;
  if (name === 'middleware') return <VscSymbolClass className="folder-icon" />;
  if (name === 'models') return <VscDatabase className="folder-icon" />;
  if (name === 'controllers') return <VscSymbolClass className="folder-icon" />;
  if (name === 'views' || name === 'templates') return <VscBrowser className="folder-icon" />;
  if (name === '.github') return <FaGithub className="folder-icon" />;
  if (name === '.vscode' || name === '.vs') return <VscGear className="folder-icon" />;
  
  // Default folder icons
  return isOpen ? <FaFolderOpen className="folder-icon" /> : <FaFolder className="folder-icon" />;
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
function getFolderIconColor(folderName) {
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
