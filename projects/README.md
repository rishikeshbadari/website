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
   - Add a new `project-card` section
   - Include your README content in the `readme-content` div
   - Add an iframe or demo section pointing to your project files

4. **Example Project Card Structure:**
   ```html
   <article class="project-card" data-project="your-project">
       <div class="project-preview">
           <h3>Your Project Name</h3>
           <p>Brief description...</p>
           <button class="project-toggle">View Project ↓</button>
       </div>
       <div class="project-details" id="project-your-project">
           <div class="project-readme">
               <div class="readme-content">
                   <!-- Your README content here -->
               </div>
               <div class="project-links">
                   <a href="https://github.com/your-username/your-repo" target="_blank">
                       View on GitHub →
                   </a>
               </div>
           </div>
           <div class="project-demo">
               <h3>Try it out:</h3>
               <div class="demo-container">
                   <!-- Your project demo/iframe here -->
               </div>
           </div>
       </div>
   </article>
   ```

## Current Projects

- **snake-game**: A modern Snake game with fluid animations (Python → JavaScript conversion) 