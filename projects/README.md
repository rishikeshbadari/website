# Projects Folder Structure

This folder contains organized project files for the portfolio website.

## Folder Structure

```
projects/
├── README.md                    # This file
├── snake-game/                  # Snake Game project
│   ├── game.html               # The playable game
│   └── README.md               # Project description
└── [future-project]/           # Template for future projects
    ├── [project-files]         # Project-specific files
    └── README.md               # Project description
```

## Adding a New Project

1. **Create Project Folder:**
   ```bash
   mkdir projects/your-project-name
   ```

2. **Add Project Files:**
   - Add your project files (HTML, CSS, JS, etc.)
   - Create a `README.md` with your project description

3. **Update projects.html:**
   - Add a new `project-card` section in the HTML
   - Add your project data to the `projectData` object in the JavaScript

4. **Example Project Card Structure:**
   ```html
   <!-- Add this in the projects-container -->
   <article class="project-card" data-project="your-project-id">
       <h3>Your Project Name</h3>
       <p>Brief description of your project...</p>
       <a href="#" class="project-link">View Project</a>
   </article>
   ```

5. **Example Project Data:**
   ```javascript
   // Add this to the projectData object in the JavaScript
   'your-project-id': {
       readme: `
           <div class="project-title-header">
               <h1>Your Project Name</h1>
               <a href="https://github.com/your-username/your-repo" target="_blank" rel="noopener noreferrer" class="github-link">
                   <img src="projects/github-logo.png" alt="View on GitHub" class="github-logo">
               </a>
           </div>
           <p>Your README content with proper markdown formatting...</p>
           <p>Additional paragraphs as needed.</p>
       `,
       links: ``,
       demo: `
           <h3>Try it out:</h3>
           <div class="game-container">
               <iframe src="projects/your-project/your-file.html" 
                       title="Your Project" 
                       width="100%" 
                       height="520">
               </iframe>
           </div>
           <p class="game-instructions">Instructions for using your project.</p>
       `
   }
   ```

## Current Projects

- **snake-game**: A modern Snake game with fluid animations (Python → JavaScript conversion) 