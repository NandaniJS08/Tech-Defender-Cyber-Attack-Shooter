
    class CyberDefenderGame {
      constructor() {
        // UI
        this.startScreen = document.getElementById('startScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.startButton = document.getElementById('startButton');
        this.restartButton = document.getElementById('restartButton');
        this.gameOverScreen = document.getElementById('gameOverScreen');

        this.scoreElement = document.getElementById('score');
        this.healthElement = document.getElementById('health');
        this.levelElement = document.getElementById('level');
        this.timerElement = document.getElementById('timer');
        this.finalScoreElement = document.getElementById('finalScore');
        this.timerProgress = document.getElementById('timerProgress');

        this.svg = document.getElementById('gameCanvas');
        this.questionText = document.getElementById('questionText');
        this.answersContainer = document.getElementById('answersContainer');

        this.shootButton = document.getElementById('shootButton');
        this.shooterHealth = 3;
        // Game state
        this.score = 0;
        this.health = 100;
        this.level = 1;
        this.timeLeft = 60;
        this.player = { x: 500, y: 540, w: 120, h: 40 };
        this.viruses = []; this.bullets = []; this.virusBullets = [];

        this.gameRunning = false;

        this.totalQuestions = 0;       // total questions asked
        this.correctAnswers = 0;       // correct answers given
        this.pointsPerQuestion = 10;   // points per correct answer
        this.totalScore = 0;   // Maximum possible score for the current game
        this.obtainedScore = 0; // Score student actually earned
        this.pointsPerQuestion = 10; // Each correct answer gives 10 points


        // in constructor()
        this.nextVirusId = 1;               // unique id for each virus
        this.spawnDelayAfterKill = 5000;    // 5000 ms (5s) after a kill before next virus
        this.maxViruses = 3;
        // Question system
        this.questionTimeLimit = 30; // seconds
        this.questionTimer = null;
        this.questionActive = false;
        this.currentQuestion = null;

        this.scoreDisplay = document.getElementById('scoreDisplay');


        this.questions = [
          { question: "What is the brain of a computer called?", answers: ["Monitor", "CPU", "Keyboard", "Mouse"], correct: 1 },
          { question: "Which device is used to print documents?", answers: ["Printer", "Scanner", "Speaker", "Router"], correct: 0 },
          { question: "Which part shows what the computer is doing?", answers: ["Monitor", "CPU", "RAM", "Mouse"], correct: 0 },
          { question: "Which storage device is portable?", answers: ["Hard Disk", "USB Drive", "Motherboard", "CPU"], correct: 1 },
          { question: "Which of these is an input device?", answers: ["Keyboard", "Monitor", "Printer", "Speaker"], correct: 0 },
          { question: "Which of these stores information temporarily?", answers: ["RAM", "Hard Disk", "Keyboard", "Monitor"], correct: 0 },
          { question: "What does Wi-Fi allow you to do?", answers: ["Connect to the internet", "Play offline games", "Charge devices", "Print documents"], correct: 0 },
          { question: "Which of these is a type of computer?", answers: ["Laptop", "Tablet", "Desktop", "All of the above"], correct: 3 },
          { question: "Which program is used to browse the internet?", answers: ["Browser", "Word Processor", "Paint", "Calculator"], correct: 0 },
          { question: "What does 'USB' stand for?", answers: ["Universal Serial Bus", "United System Board", "Unique Storage Backup", "Ultimate Software Base"], correct: 0 },
          { question: "Which device is used to play music?", answers: ["Speaker", "Printer", "Keyboard", "Mouse"], correct: 0 },
          { question: "Which of these is a safe password?", answers: ["123456", "password", "P@ssw0rd!", "qwerty"], correct: 2 },
          { question: "Which device allows you to hear sound from a computer?", answers: ["Speaker", "Monitor", "Mouse", "CPU"], correct: 0 },
          { question: "Which software helps protect your computer from viruses?", answers: ["Antivirus", "Browser", "Paint", "Word Processor"], correct: 0 },
          { question: "Which is an example of a search engine?", answers: ["Google", "Windows", "YouTube", "Excel"], correct: 0 },
          { question: "Which device do you use to move the cursor?", answers: ["Mouse", "Keyboard", "Monitor", "Printer"], correct: 0 },
          { question: "Which is a renewable energy source for computers?", answers: ["Solar Power", "Coal", "Petrol", "Natural Gas"], correct: 0 },
          { question: "Which of these helps protect your accounts online?", answers: ["Strong passwords", "Sharing passwords", "Clicking links", "Using same password"], correct: 0 },
          { question: "Which unit measures data?", answers: ["Bit", "Meter", "Liter", "Gram"], correct: 0 },
          { question: "Which device can connect to the internet?", answers: ["Smartphone", "Refrigerator", "Toaster", "Pen"], correct: 0 },
          { question: "What is phishing?", answers: ["Tricking users for info", "Typing fast", "Coding a game", "Printing documents"], correct: 0 },
          { question: "Which part of the computer processes information?", answers: ["CPU", "Monitor", "Mouse", "Keyboard"], correct: 0 },
          { question: "Which of these is an example of online learning?", answers: ["Watching videos on educational websites", "Playing outside", "Reading a book", "Writing in notebook"], correct: 0 },
          { question: "Which device stores files permanently?", answers: ["Hard Disk", "RAM", "CPU", "Monitor"], correct: 0 },
          { question: "Which of these is an operating system?", answers: ["Windows", "Excel", "Photoshop", "Chrome"], correct: 0 },
          { question: "Which of these is used to send emails?", answers: ["Email Client", "Word", "Paint", "Calculator"], correct: 0 },
          { question: "Which of these is an example of multimedia?", answers: ["Videos", "Text Only", "Paper Books", "Pen"], correct: 0 },
          { question: "Which device helps you scan documents?", answers: ["Scanner", "Printer", "Monitor", "Mouse"], correct: 0 },
          { question: "Which of these is a coding language?", answers: ["Python", "Excel", "Word", "Paint"], correct: 0 },
          { question: "Which of these helps you video call friends?", answers: ["Zoom", "Paint", "Calculator", "Notepad"], correct: 0 }
        ];


        // Shuffle questions to randomize order
        this.remainingQuestions = this.questions
          .map(q => ({ ...q })) // make a copy
          .sort(() => Math.random() - 0.5); // shuffle

        this.bindEvents();
        this.resizeObserver();
      }


      bindEvents() {

        this.startButton.addEventListener('click', () => this.startGame());
        // Shoot button (only if it exists)
        if (this.shootButton) {
          this.shootButton.addEventListener('click', () => this.shoot());
        }
        this.restartButton?.addEventListener('click', () => this.restartGame());

        // keyboard
        window.addEventListener('keydown', (e) => {
          if (!this.gameRunning) return;
          if (e.key === 'ArrowLeft') this.player.x = Math.max(0, this.player.x - 20);
          if (e.key === 'ArrowRight') this.player.x = Math.min(1000 - this.player.w, this.player.x + 20);
          if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); this.shoot(); }
        });
      }

      resizeObserver() {
        // keep svg viewbox fixed, we use pixel coords relative to 1000x600
        window.addEventListener('resize', () => this.render());
      }
      gameOver() {
        this.gameRunning = false;
        clearInterval(this.spawnTimer);
        alert("Game Over!");
      }

      updateScoreDisplay() {
        if (this.scoreDisplay) {
          this.scoreDisplay.textContent = `Score: ${this.score} / ${this.totalQuestions * this.pointsPerQuestion}`;
        }
      }


      startGame() {
        this.totalQuestions = this.questions.length; // total questions = 15

        this.obtainedScore = 0;
        this.correctAnswers = 0;
        this.score = 0;
        this.updateStats();
        this.updateScoreDisplay();  // reset display
        // start other game loops...
        this.askQuestion();
        // spawn one virus immediately
        this.spawnVirus();

        // then spawn viruses continuously every X ms
        this.spawnTimer = setInterval(() => {
          this.spawnVirus();
        }, this.spawnInterval); // e.g. 3000ms = one virus every 3s

        this.gameRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));

        this.startScreen.style.display = 'none';
        this.gameScreen.style.display = 'block';
        this.gameOverScreen.style.display = 'none';

        // reset
        this.score = 0;
        this.health = 100;
        this.level = 1;
        this.timeLeft = 60;
        this.viruses = [];
        this.bullets = [];
        this.virusBullets = [];
        this.player.x = 440;
        this.gameRunning = true;
        this.updateStats();
        this.lastSpawn = 0;
        this.lastSpawnTime = performance.now();
        this.spawnInterval = 5000; // 5 seconds (you can tune it)
        this.loop();
        this.askQuestion();
        this.startTimer();
      }

      restartGame() {
        this.totalQuestions = 0;
        this.correctAnswers = 0;
        this.score = 0;
        this.updateStats();
        this.updateScoreDisplay();  // reset display

        this.startGame();
        // reset player & game state
        this.score = 0;
        this.health = 100;
        this.level = 1;
        this.timeLeft = 60;
        this.viruses = [];
        this.bullets = [];
        this.virusBullets = [];
        this.player.x = 440;
        this.updateStats();

        // clear intervals
        clearInterval(this.spawnTimer);
        clearInterval(this.timerInterval);
        clearInterval(this.questionTimer);
      }

      startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
          this.timeLeft--;
          this.timerElement.textContent = this.timeLeft;
          if (this.timeLeft <= 0) this.gameOver();
        }, 1000);
      }

      updateStats() {
        this.scoreElement.textContent = `Score: ${this.obtainedScore} / ${this.totalQuestions * this.pointsPerQuestion}`;
        this.healthElement.textContent = this.health;
        this.levelElement.textContent = this.level;
        this.timerElement.textContent = this.timeLeft;
      }


      loop(timestamp) {
        if (!this._lastFrame) this._lastFrame = performance.now();
        const now = performance.now();
        const dt = now - this._lastFrame; this._lastFrame = now;

        if (this.gameRunning) {
          // spawn viruses periodically
          this.lastSpawn += dt;
          if (this.lastSpawn > this.spawnInterval) {
            this.spawnVirus();
            this.lastSpawn = 0;
            // make spawn interval slightly random for variety
            this.spawnInterval = 800 + Math.random() * 400; // 0.8s to 1.2s
          }

          this.update(dt);
          this.render();
        }

        if (this.gameRunning) requestAnimationFrame((t) => this.loop(t));
      }

      update(dt) {
        // ---- Virus auto spawn ----
        const now = performance.now();
        if (now - this.lastSpawnTime > this.spawnInterval) {
          this.spawnVirus();
          this.lastSpawnTime = now;
        }
        // ---- Viruses falling ----
        for (let i = this.viruses.length - 1; i >= 0; i--) {
          const v = this.viruses[i];


          if (v.destroyed) {
            // run fade + shrink animation
            const elapsed = performance.now() - v.destroyStart;
            const t = Math.min(1, elapsed / v.destroyDuration);
            v.opacity = 1 - t;                         // fade out
            v.r = v.initialR * (1 - 0.6 * t);         // shrink to 40% size

            if (t >= 1) {
              // animation finished — remove virus, award score and schedule next spawn
              this.viruses.splice(i, 1);
              this.score += 10;
              this.updateStats();
              // spawn next virus after 5s
              // setTimeout(() => this.spawnVirus(), this.spawnDelayAfterKill);
            }
            continue; // don't move a destroyed virus
          }

          v.y += v.speed * (dt / 16);

          if (v.y > 560) {
            this.viruses.splice(i, 1);
            this.health -= 10;
            this.shooterHealth -= 1;    // optional: also decrease shooter health if you want
            this.updateStats();
            if (this.health <= 0 || this.shooterHealth <= 0) return this.gameOver();
            // spawn next after delay
            // setTimeout(() => this.spawnVirus(), this.spawnDelayAfterKill);
          }
        }

        // ---- Bullets update ----
        for (let i = this.bullets.length - 1; i >= 0; i--) {
          const b = this.bullets[i];

          // homing bullet
          if (b.homing) {
            // find the live target virus by id
            const target = this.viruses.find(v => v.id === b.targetId && !v.destroyed);
            if (!target) {
              // target no longer exists (maybe already destroyed) -> remove bullet
              this.bullets.splice(i, 1);
              continue;
            }
            const dx = target.x - b.x;
            const dy = target.y - b.y;
            const dist = Math.hypot(dx, dy);

            if (dist > 0.1) {
              const move = (b.speed * (dt / 16));
              b.x += (dx / dist) * move;
              b.y += (dy / dist) * move;
            }

            // collision check with the target (live coordinates)
            if (Math.hypot(b.x - target.x, b.y - target.y) < target.r + (b.r || 4)) {
              // mark target as destroyed to start fade animation (do not remove immediately)
              if (!target.destroyed) {
                target.destroyed = true;
                target.destroyStart = performance.now();
              }
              // remove bullet
              this.bullets.splice(i, 1);
              continue;
            }

            // remove homing bullet if it goes far off-screen (safety)
            if (b.x < -50 || b.x > 1050 || b.y < -50 || b.y > 700) {
              this.bullets.splice(i, 1);
              continue;
            }

          } else {
            // straight bullet (non-homing)
            b.y -= b.speed * (dt / 16);
            if (b.y < -10) { this.bullets.splice(i, 1); continue; }

            // collision with any live virus
            for (let j = this.viruses.length - 1; j >= 0; j--) {
              const v = this.viruses[j];
              if (v.destroyed) continue;
              const dx = b.x - v.x;
              const dy = b.y - v.y;
              const dist = Math.hypot(dx, dy);
              if (dist < v.r + (b.r || 4)) {
                // hit -> mark destroyed to run animation
                v.destroyed = true;
                v.destroyStart = performance.now();
                // remove bullet
                this.bullets.splice(i, 1);
                break;
              }
            }
          }
        }

        // ---- Virus bullets ----
        for (let i = this.virusBullets.length - 1; i >= 0; i--) {
          const b = this.virusBullets[i];
          b.y += b.speed * (dt / 16);

          if (b.y > 610) { this.virusBullets.splice(i, 1); continue; }

          const px = this.player.x + this.player.w / 2;
          const py = this.player.y + this.player.h / 2;
          if (Math.hypot(b.x - px, b.y - py) < 24) {
            this.virusBullets.splice(i, 1);
            this.health -= 5;
            this.updateStats();
            if (this.health <= 0) return this.gameOver();
          }
        }

        // ---- Level up ----
        if (this.score >= this.level * 100) {
          this.level++;
          this.updateStats();
          // this.spawnInterval = Math.max(500, this.spawnInterval - 80);
          //for level-up
          this.spawnInterval = Math.max(2000, this.spawnInterval - 500);


        }
      }

      render() {
        // clear svg
        while (this.svg.firstChild) this.svg.removeChild(this.svg.firstChild);

        // draw background grid (subtle)
        // draw player (computer)
        const playerRect = this._createSVG('rect', { x: this.player.x, y: this.player.y, width: this.player.w, height: this.player.h, rx: 8, fill: '#4caf50' });
        this.svg.appendChild(playerRect);

        // viruses (make them cartoon characters)
        this.viruses.forEach((v, idx) => {
          const g = this._createSVG('g', { transform: `scale(${v.scale || 1})` });
          // if destroyed, reduce opacity and scale down
          if (v.destroyed) {
            v.opacity -= 0.05;
            v.r *= 0.9;
          }

          // skip fully invisible viruses
          if (v.opacity <= 0) {
            this.viruses.splice(idx, 1);
            this.score += 10;
            this.updateStats();
            return;
          }

          const body = this._createSVG('circle', {
            cx: v.x, cy: v.y, r: v.r,
            fill: v.color, stroke: '#000', 'stroke-width': 2, 'opacity': v.opacity
          });
          g.appendChild(body);

          // eyes and smile
          g.appendChild(this._createSVG('circle', { cx: v.x - 6, cy: v.y - 6, r: 3, fill: '#fff', 'opacity': v.opacity }));
          g.appendChild(this._createSVG('circle', { cx: v.x + 6, cy: v.y - 6, r: 3, fill: '#fff', 'opacity': v.opacity }));
          g.appendChild(this._createSVG('circle', { cx: v.x - 6, cy: v.y - 6, r: 1.5, fill: '#000', 'opacity': v.opacity }));
          g.appendChild(this._createSVG('circle', { cx: v.x + 6, cy: v.y - 6, r: 1.5, fill: '#000', 'opacity': v.opacity }));
          g.appendChild(this._createSVG('path', {
            d: `M ${v.x - 6} ${v.y + 6} Q ${v.x} ${v.y + 12} ${v.x + 6} ${v.y + 6}`,
            stroke: '#000', 'stroke-width': 2, fill: 'none', 'opacity': v.opacity
          }));

          this.svg.appendChild(g);
        });


        // draw bullets
        this.bullets.forEach(b => this.svg.appendChild(this._createSVG('circle', { cx: b.x, cy: b.y, r: 4, fill: '#ffd54f' })));
        this.virusBullets.forEach(b => this.svg.appendChild(this._createSVG('circle', { cx: b.x, cy: b.y, r: 3, fill: '#ff5252' })));

        // show shooter health (top-left corner)
        const healthText = this._createSVG('text', {
          x: 20, y: 40, fill: '#fff', 'font-size': 18, 'font-family': 'Arial'
        });
        healthText.textContent = "❤️ Health: " + this.shooterHealth;
        this.svg.appendChild(healthText);
      }

      //render end    


      _createSVG(tag, attrs) { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); for (const k in attrs) el.setAttribute(k, attrs[k]); return el; }

      spawnVirus() {
        // Only allow one virus at a time (per your requirement).
        if (this.viruses.length >= this.maxViruses) return;

        const colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF'];
        const x = 50 + Math.random() * 900;            // random horizontal start
        const initialR = 18 + Math.random() * 8;
        const id = this.nextVirusId++;

        const v = {
          id,
          x,
          y: -30,
          r: initialR,
          initialR,
          // speed: 1 + Math.random() * 1 + this.level * 0.2,
          speed: 0.2 + Math.random() * 0.5 + this.level * 0.03,
          color: colors[Math.floor(Math.random() * colors.length)],
          destroyed: false,        // when true, start fade animation
          destroyStart: 0,
          destroyDuration: 400,    // ms
          opacity: 1
        };

        this.viruses.push(v);
      }


      virusShoot(v) { this.virusBullets.push({ x: v.x, y: v.y + v.r + 4, speed: 2 + Math.random() * 1 }); }

      askQuestion() {
        if (!this.gameRunning) return;
        // choose a random question object
        if (this.remainingQuestions.length === 0) {
          // No more questions left -> end game or stop asking
          return;
        }
        this.questionActive = true;

        // Pick the first question from remainingQuestions
        this.currentQuestion = this.remainingQuestions.shift(); // removes it from array


        this.questionText.textContent = this.currentQuestion.question;
        this.answersContainer.innerHTML = '';

        // Pick a random question from remainingQuestions
        // const qIndex = Math.floor(Math.random() * this.remainingQuestions.length);
        // this.currentQuestion = this.remainingQuestions[qIndex];
        // // Remove it from remainingQuestions
        // this.remainingQuestions.splice(qIndex, 1);

        // Display question
        this.questionText.textContent = this.currentQuestion.question;
        this.answersContainer.innerHTML = '';

        // Create buttons
        this.currentQuestion.answers.forEach((ans, i) => {
          const btn = document.createElement('button');
          btn.className = 'answerButton';
          btn.textContent = ans;
          btn.addEventListener('click', () => this.checkAnswer(i, btn));
          this.answersContainer.appendChild(btn);
        });



        // question timer
        if (this.questionTimer) clearInterval(this.questionTimer);
        this.questionTimeLeft = this.questionTimeLimit;
        this._updateTimerProgress();
        this.questionTimer = setInterval(() => {
          this.questionTimeLeft--;
          this._updateTimerProgress();
          if (this.questionTimeLeft <= 0) { clearInterval(this.questionTimer); this.timeUp(); }
        }, 1000);
        this.updateScoreDisplay(); // update display whenever a new question is asked
      }

      _updateTimerProgress() { const pct = Math.max(0, (this.questionTimeLeft / this.questionTimeLimit) * 100); this.timerProgress.style.width = pct + '%'; }

      timeUp() {
        this.questionActive = false;
        const buttons = Array.from(this.answersContainer.children);
        if (buttons[this.currentQuestion.correct]) buttons[this.currentQuestion.correct].classList.add('correct');
        setTimeout(() => { if (this.gameRunning) this.askQuestion(); }, 1200);
      }

      checkAnswer(index, btn) {
        if (!this.questionActive) return;
        this.questionActive = false;
        if (this.questionTimer) clearInterval(this.questionTimer);

        const buttons = Array.from(this.answersContainer.children);
        buttons.forEach((b, idx) => {
          if (idx === this.currentQuestion.correct) b.classList.add('correct');
          if (idx === index && idx !== this.currentQuestion.correct) b.classList.add('incorrect');
        });

        if (index === this.currentQuestion.correct) {
          this.correctAnswers++;     // count correct answer
          this.obtainedScore += this.pointsPerQuestion; // only update obtainedScore
          this.updateStats();
          this.updateScoreDisplay(); // <-- update dynamically
          // correct => auto-shot at first virus
          if (this.viruses.length > 0) {
            const target = this.viruses[0];   // oldest virus
            this.shootAt(target.id);

          } else {
            // no viruses -> small bonus
            this.score += 5;
            this.updateStats();
          }
        }
        else {
          // wrong => shooter takes damage
          this.shooterHealth -= 1;
          if (this.shooterHealth <= 0) return this.gameOver();
          this.updateScoreDisplay(); // <-- still update total questions count
        }

        // ask next question after short delay
        setTimeout(() => { if (this.gameRunning) this.askQuestion(); }, 900);
      }

      shootAt(targetId) {
        const startX = this.player.x + this.player.w / 2;
        const startY = this.player.y - 6;

        // Find the target virus
        const target = this.viruses.find(v => v.id === targetId && !v.destroyed);

        if (target) {
          // Homing bullet
          this.bullets.push({
            x: startX,
            y: startY,
            targetId: target.id,
            speed: 10,
            homing: true,
            r: 5
          });
        } else {
          // Fallback: straight upward bullet
          this.bullets.push({
            x: startX,
            y: startY,
            speed: 10,
            homing: false,
            r: 5
          });
        }
      }



      shoot() {
        if (!this.gameRunning) return; // create bullet from top of player
        const b = { x: this.player.x + this.player.w / 2, y: this.player.y - 6, speed: 6 };
        this.bullets.push(b);
      }

      gameOver() {
        this.gameRunning = false;
        clearInterval(this.timerInterval);
        clearInterval(this.questionTimer);

        this.finalScoreElement.innerHTML = `
        🎯 Your Score: ${this.obtainedScore} <br>
       📝 Total Score: ${this.totalQuestions * this.pointsPerQuestion}
    `;
        this.gameOverScreen.style.display = 'flex';
      }

    }

    // Initialize when DOM ready
    window.addEventListener('DOMContentLoaded', () => { window.game = new CyberDefenderGame(); });
