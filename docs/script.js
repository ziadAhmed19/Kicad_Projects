/**
 * PCB Design Portfolio - Dynamic Project Loader
 * Loads projects from projects.json and generates the portfolio grid
 */

const PROJECTS_FILE = 'projects.json';
const PROJECTS_CONTAINER = document.getElementById('projects-container');
const ERROR_MESSAGE = document.getElementById('error-message');

/**
 * Fetch and parse projects from projects.json
 */
async function loadProjects() {
    try {
        const response = await fetch(PROJECTS_FILE);
        
        if (!response.ok) {
            throw new Error(`Failed to load ${PROJECTS_FILE}`);
        }
        
        const projects = await response.json();
        
        if (!Array.isArray(projects) || projects.length === 0) {
            showEmptyState();
            return;
        }
        
        renderProjects(projects);
    } catch (error) {
        console.error('[v0] Error loading projects:', error);
        showError(`Unable to load projects. ${error.message}`);
    }
}

/**
 * Render projects to the DOM
 */
function renderProjects(projects) {
    PROJECTS_CONTAINER.innerHTML = '';
    
    projects.forEach((project, index) => {
        const card = createProjectCard(project);
        PROJECTS_CONTAINER.appendChild(card);
    });
}

/**
 * Create a single project card element
 */
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    
    // Validate required fields
    const name = project.name || 'Unnamed Project';
    const imagePath = project.imagePath || '';
    const iomPath = project.iomPath || '';
    const description = project.description || 'KiCad PCB Project';
    
    // Create image element
    const imageContainer = document.createElement('div');
    imageContainer.style.width = '100%';
    imageContainer.style.height = '250px';
    imageContainer.style.overflow = 'hidden';
    imageContainer.style.backgroundColor = 'var(--background-color)';
    
    const image = document.createElement('img');
    image.className = 'project-image';
    image.alt = name;
    image.src = imagePath;
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.objectFit = 'cover';
    
    // Handle image load errors
    image.onerror = () => {
        imageContainer.innerHTML = '<div class="project-image placeholder">Image not found</div>';
    };
    
    imageContainer.appendChild(image);
    
    // Create content section
    const content = document.createElement('div');
    content.className = 'project-content';
    
    const projectName = document.createElement('h2');
    projectName.className = 'project-name';
    projectName.textContent = name;
    
    const projectDesc = document.createElement('p');
    projectDesc.className = 'project-description';
    projectDesc.textContent = description;
    
    // Create button
    const button = document.createElement('a');
    button.className = 'project-button';
    button.textContent = 'View Project';
    button.href = iomPath || '#';
    button.target = '_blank';
    button.rel = 'noopener noreferrer';
    
    content.appendChild(projectName);
    content.appendChild(projectDesc);
    content.appendChild(button);
    
    card.appendChild(imageContainer);
    card.appendChild(content);
    
    return card;
}

/**
 * Show error message
 */
function showError(message) {
    ERROR_MESSAGE.style.display = 'block';
    ERROR_MESSAGE.textContent = message;
    PROJECTS_CONTAINER.innerHTML = '';
}

/**
 * Show empty state when no projects found
 */
function showEmptyState() {
    PROJECTS_CONTAINER.innerHTML = `
        <div style="grid-column: 1 / -1;">
            <div class="empty-state">
                <div class="empty-state-icon">📁</div>
                <h2>No Projects Yet</h2>
                <p>Add your KiCad PCB projects to get started. See the README for instructions.</p>
            </div>
        </div>
    `;
}

/**
 * Initialize the portfolio on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});
