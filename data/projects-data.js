/* Project content — HTML templates and data */

var projectData = {
    'quizbowl': {
        readme: '\
            <div class="project-title-header">\
                <h1>QuizBowl</h1>\
            </div>\
            <p>An iOS app for practicing quiz bowl tossups. Powered by the QBReader API, it reveals questions word-by-word and lets you buzz in whenever you think you know the answer. Filter by difficulty (middle school, high school, college) and category, or play with friends in multiplayer.</p>\
            <p>Built with React Native and Expo.</p>\
            <hr>\
            <p class="testflight-notice">Currently available on <strong>TestFlight</strong> only. Email <a href="mailto:badari.rishikesh@gmail.com">badari.rishikesh@gmail.com</a> to get access.</p>\
        ',
        links: '',
        demo: '\
            <div class="quizbowl-screenshots">\
                <img src="projects/QuizBowl/2.PNG" alt="QuizBowl — Answer result" loading="lazy">\
                <img src="projects/QuizBowl/3.PNG" alt="QuizBowl — Settings" loading="lazy">\
                <img src="projects/QuizBowl/4.PNG" alt="QuizBowl — Multiplayer" loading="lazy">\
            </div>\
        '
    },
    'snake-game': {
        readme: '\
            <div class="project-title-header">\
                <h1>Snake</h1>\
                <a href="https://github.com/rishikeshbadari/snake" target="_blank" rel="noopener noreferrer" class="github-link">\
                    <img src="projects/github-logo.png" alt="View on GitHub" class="github-logo">\
                </a>\
            </div>\
            <p>One of my first CS projects.</p>\
            <hr>\
        ',
        links: '',
        demo: '\
            <div class="game-container">\
                <iframe src="projects/snake-game/game.html" \
                        title="Snake" \
                        width="100%" \
                        height="540">\
                </iframe>\
            </div>\
        '
    },
    'fractals': {
        readme: '\
            <div class="project-title-header">\
                <h1>Fractals</h1>\
                <a href="https://github.com/rishikeshbadari/fractals" target="_blank" rel="noopener noreferrer" class="github-link">\
                    <img src="projects/github-logo.png" alt="View on GitHub" class="github-logo">\
                </a>\
            </div>\
            <div class="branch-selector">\
                <div class="branch-buttons">\
                    <button class="branch-btn active" data-fractal="main">Overview</button>\
                    <button class="branch-btn" data-fractal="mandelbrot">Mandelbrot Set</button>\
                    <button class="branch-btn" data-fractal="julia">Julia Sets</button>\
                    <button class="branch-btn" data-fractal="barnsley-fern">Barnsley Fern</button>\
                </div>\
            </div>\
            <div id="fractal-content">\
            </div>\
        ',
        links: '',
        demo: '<div id="fractal-demo"></div>'
    },
    'llm-classification': {
        readme: '\
            <div class="project-title-header">\
                <h1>Fine-tuning LLMs for Classification Tasks</h1>\
                <a href="https://github.com/rishikeshbadari/cs7643" target="_blank" rel="noopener noreferrer" class="github-link">\
                    <img src="projects/github-logo.png" alt="View on GitHub" class="github-logo">\
                </a>\
            </div>\
            <p>Semester Project for CS 7637: Deep Learning</p>\
        ',
        links: '\
            <a href="projects/Fine-tuning LLMs for Classification Tasks/Poster.pdf" target="_blank" rel="noopener noreferrer">DOWNLOAD POSTER (PDF)</a>\
        ',
        demo: '\
            <iframe src="projects/Fine-tuning LLMs for Classification Tasks/Final_Paper.pdf"\
                    title="Fine-tuning LLMs for Classification Tasks - Paper"\
                    width="100%"\
                    height="900"\
                    style="border: none; border-radius: 0;">\
            </iframe>\
        '
    },
    'olympic-wins': {
        readme: '\
            <div class="project-title-header">\
                <h1>Predictive Analysis for Olympic Wins</h1>\
                <a href="https://github.com/rishikeshbadari/cs7641" target="_blank" rel="noopener noreferrer" class="github-link">\
                    <img src="projects/github-logo.png" alt="View on GitHub" class="github-logo">\
                </a>\
            </div>\
            <p>Graduate ML project (CS 7641). Includes proposal, midterm, and final report.</p>\
        ',
        links: '',
        demo: '\
            <div class="branch-selector olympic-nav">\
                <div class="branch-buttons">\
                    <button class="branch-btn" data-report="proposal">Project Proposal</button>\
                    <button class="branch-btn" data-report="midterm">Midterm Checkpoint</button>\
                    <button class="branch-btn active" data-report="final">Final Report</button>\
                </div>\
            </div>\
            <iframe id="olympic-iframe"\
                    src="projects/Predictive Analysis for Olympic Wins/final_report.html"\
                    title="Predictive Analysis for Olympic Wins"\
                    width="100%"\
                    height="900"\
                    style="border: none; border-radius: 0;">\
            </iframe>\
        '
    }
};

/* Fractal branch content */
var fractalBranches = {
    'main': {
        content: '\
            <p>I took a class at GHP some years ago where we wrote some basic stuff to visualize the Mandelbrot set.</p>\
            \
            <p>I was bored this summer (2024) and couldn\'t remember how it was constructed, so these are just some notes.</p>\
            \
            <hr>\
            <h3>definition</h3>\
            \
            <p>Back when I took the class, I thought fractals were just self-similar shapes. You zoom in enough and eventually see the same thing. Apparently, that\'s not the case, and according to <a href="https://www.youtube.com/watch?v=gB9n2gHsHN4" target="_blank" rel="noopener noreferrer">3Blue1Brown</a>, we can define fractals more rigorously.</p>\
            \
            <p>Some other definitions help with defining fractals.</p>\
            \
            <p><strong>Scaling Factor:</strong> I was actually having trouble defining this well. I\'m sure one of these will suffice:</p>\
            \
            <p>Given two similar shapes (similar as in the math definition of the word):</p>\
            <ol>\
                <li>Choose the same curve/side on both shapes and take its length. Divide the larger length by the smaller length to find the factor to scale from the smaller to the larger shape. 1 over that to scale down.</li>\
                <li>Lay one of the shapes on the plane. If you multiply all points on the shape by some factor <em>s</em>, the resulting shape will be congruent to the other shape. That\'s the scaling factor from the one you laid down to the other one.</li>\
            </ol>\
            \
            <p><strong>Mass:</strong> I guess area in a way. Some fractals are technically just a lot of lines (Sierpinski Triangle), so thinking of it as if you were measuring grams is actually better.</p>\
            \
            <p><strong>Dimension:</strong> Also not easy to define. Someone on Wolfram MathWorld says it\'s \'the number of coordinates needed to specify a point on the object\'. Doesn\'t make much sense in terms of non-integer values for fractals.</p>\
            \
            <p>Easier to observe in practice:</p>\
            <ol>\
                <li>If we scale a line segment by <code>1/2</code>, its mass scales by <code>(1/2)\u00B9</code>.</li>\
                <li>If we scale a square by <code>1/2</code>, its mass scales by <code>(1/2)\u00B2</code>.</li>\
                <li>If we scale a cube by <code>1/2</code>, its mass scales by <code>(1/2)\u00B3</code>.</li>\
            </ol>\
            \
            <p>Therefore, it seems to follow that if we scale a shape by <em>s</em> and its mass scales by <em>s<sup>d</sup></em>, the shape\'s dimension is <em>d</em>.</p>\
            \
            <p>Given all that, a <strong>Fractal</strong> is a shape with non-integer dimension.</p>\
        ',
        demo: ''
    },
    'barnsley-fern': {
        content: '',
        demo: '\
            <iframe src="projects/fractals/barnsley-fern.html" \
                    title="Barnsley Fern Fractal" \
                    width="100%" \
                    height="720"\
                    style="border: none; border-radius: 0;">\
            </iframe>\
        '
    },
    'mandelbrot': {
        content: '\
            <p>The Mandelbrot Set is a set of complex numbers that, when plotted, create an interesting fractal structure.</p>\
            \
            <p>The test to determine if a complex number <em>c</em> is part of the Mandelbrot Set:</p>\
            <ol>\
                <li>Start with <code>z\u2080 = 0</code> and recursively apply <code>z<sub>i+1</sub> = z<sub>i</sub>\u00B2 + c</code>.</li>\
                <li>If you converge to a finite point or fluctuate between points, <em>c</em> is in the set. If you tend towards infinity, <em>c</em> isn\'t in the set.</li>\
            </ol>\
            \
            <p>So how do we test if <code>z<sub>n</sub></code> converges or diverges?</p>\
            \
            <p>Essentially, if <code>|z<sub>i</sub>| > 2</code> at any point in the recursion, you\'ll tend towards infinity. This is what we wrote in our code way back when, but we didn\'t go through any proof if I remember correctly.</p>\
            \
            <h3>proof:</h3>\
            \
            <p>Shoutout Sid for the help with this.</p>\
            \
            <h4>Claim 1: Once you leave 2, the ratio of consecutive terms is greater than 1. With this, we can at least prove that <em>z</em> is strictly increasing.</h4>\
            \
            <p><code>|z<sub>i</sub>| > 2</code> and <code>|z<sub>i</sub>| \u2265 |c|</code>, then <code>|z<sub>i+1</sub>| / |z<sub>i</sub>| > 1</code></p>\
            \
            <p>Why do we care about this? In general, if we\'re tending towards infinity, <code>z<sub>i</sub></code> will go further away from the origin than <em>c</em>. At some point, it should pass 2 if it\'s on the way to infinity.</p>\
            \
            <p>At first I bashed my way to prove this, but there\'s an easier way to think about it: Let <code>|z<sub>i</sub>|</code> be <em>x</em> away from the origin, where <em>x</em> is a positive number. <code>|z<sub>i</sub>\u00B2|</code> is <em>x</em>\u00B2 away. We want <em>c</em> to bring <code>z<sub>i</sub>\u00B2</code> back to the origin as much as possible. This is done when <em>c</em> is directly opposite <code>z<sub>i</sub>\u00B2</code> and is as far away from the origin as possible. So, let\'s assume it\'s directly across and has maximum distance, which is also <code>|z<sub>i</sub>|</code> or <em>x</em>. Therefore, <code>|z<sub>i</sub>\u00B2 + c|</code> is at least <em>x</em>\u00B2 \u2212 <em>x</em>. Is this greater than <code>|z<sub>i</sub>| = x</code>? Solving <em>x</em>\u00B2 \u2212 <em>x</em> > <em>x</em> leads to <em>x</em>(<em>x</em> \u2212 2) > 0. This has solutions for <em>x</em> < 0 and <em>x</em> > 2. We assumed <em>x</em> is positive, so the only solution is <em>x</em> > 2.</p>\
            \
            <p>Therefore, when <em>x</em> > 2, <code>|z<sub>i</sub>\u00B2 + c| > |z<sub>i</sub>|</code> is true.</p>\
            \
            <p>However, there is a possibility of asymptotically approaching some value, like 3, where consecutive terms are getting closer to 3, but are bounded above by some value. This is still convergence. To get around this, we can prove that the difference between consecutive terms is \u2265 0.</p>\
            \
            <h4>Claim 2: The difference between consecutive terms is either constant or increasing.</h4>\
            \
            <p>If <code>|z<sub>i</sub>|</code> is <em>x</em>, then <code>|z<sub>i</sub>\u00B2|</code> is <em>x</em>\u00B2. Let <code>|c|</code> be <em>y</em> and let it, in the worst case, be exactly opposite <code>|z<sub>i</sub>\u00B2|</code>. Therefore, <code>|z<sub>i</sub>\u00B2 + c| = x\u00B2 \u2212 y</code>. Since <em>x</em> > 2, we know that <em>x</em>\u00B2 > 4 \u2192 <em>x</em>\u00B2 > 2<em>x</em> > 4. Therefore, <code>|z<sub>i</sub>\u00B2 + c|</code> can be viewed as always being bounded below by, or at least as big, as 2<em>x</em> \u2212 <em>y</em>. Now, the difference between this and <code>|z<sub>i</sub>|</code> is (2<em>x</em> \u2212 <em>y</em>) \u2212 <em>x</em> = <em>x</em> \u2212 <em>y</em>. Since <code>|z<sub>i</sub>| > |c|</code>, this value is guaranteed to be positive. Now, since <em>x</em> is increasing, <em>x</em> \u2212 <em>y</em> as a term is always increasing. With that, the difference between consecutive terms is always increasing.</p>\
            \
            <h3>coloring:</h3>\
            \
            <p>In terms of processing, we give the sequence a certain number of opportunities to hit 2 (maxIter). We decide to color each point based on the number of steps it takes to hit 2. So, naturally everything outside of 2 is one color. Everything near 2 is another (since it probably takes 1 step), everything a little closer to the origin is another, ...</p>\
            \
            <p>If we get to maxIter, we assume that the sequence will never leave 2.</p>\
        ',
        demo: '\
            <iframe src="projects/fractals/mandelbrot.html" \
                    title="Mandelbrot Set Fractal" \
                    width="100%" \
                    height="100%"\
                    style="border: none; border-radius: 0; display: block;">\
            </iframe>\
        '
    },
    'julia': {
        content: '\
            <p>The Julia Set is another family of fractal structures. In Mandelbrot, we\'d start at <code>z\u2080 = 0</code> and for every <em>c</em> in the plane, if we recursed out of 2, then our point <em>c</em> isn\'t in the set. In Julia, we choose some <em>c</em> and for every <code>z\u2080</code> in the plane, if we recurse out of 2, then our point <code>z\u2080</code> isn\'t in the set.</p>\
            \
            <p>Since we can choose any <em>c</em> and then go over every point <code>z\u2080</code>, we have infinitely many julia sets. Some of which look more interesting than the others.</p>\
            \
            <p>The test to determine if a complex number <code>z\u2080</code> is part of the Julia Set grounded at some <em>c</em>:</p>\
            <ol>\
                <li>Recursively apply <code>z<sub>i+1</sub> = z<sub>i</sub>\u00B2 + c</code>.</li>\
                <li>If you converge to a finite point or fluctuate between points, <code>z\u2080</code> is in the set. If you tend towards infinity, <code>z\u2080</code> isn\'t in the set.</li>\
            </ol>\
            \
            <p>So how do we test if <code>z<sub>n</sub></code> converges or diverges? This is the same proof as Mandelbrot - all we did is change what we choose for <em>z</em> and <em>c</em>. Same coloring as well.</p>\
        ',
        demo: '\
            <iframe src="projects/fractals/julia.html" \
                    title="Julia Set Fractal" \
                    width="100%" \
                    height="800"\
                    style="border: none; border-radius: 0;">\
            </iframe>\
        '
    }
};

/* Olympic report page paths */
var olympicPages = {
    proposal: 'projects/Predictive Analysis for Olympic Wins/project_proposal.html',
    midterm: 'projects/Predictive Analysis for Olympic Wins/midterm_checkpoint.html',
    final: 'projects/Predictive Analysis for Olympic Wins/final_report.html'
};
