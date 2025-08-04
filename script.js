// Enhanced KBC Style Quiz Game Application
class QuizMaster {
    constructor() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.questions = [];
        this.quizType = 'general';
        this.difficulty = 'easy';
        this.playerName = 'Quiz Champion';
        this.timer = null;
        this.timeLeft = 10;
        this.lifelines = {
            fiftyFifty: true,
            audience: true,
            hint: true,
            skip: true
        };
        this.prizeStructure = {
            easy: [1000, 2000, 5000, 10000, 25000],
            medium: [1000, 2000, 5000, 10000, 25000, 50000, 100000],
            hard: [1000, 2000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000]
        };
        this.achievements = [];
        this.answerLocked = false;
        
        this.initializeElements();
        this.initializeEventListeners();
        this.loadQuestions();
    }

    initializeElements() {
        // Screens
        this.quizScreen = document.getElementById('quiz-screen');
        this.resultsScreen = document.getElementById('results-screen');
        this.reviewScreen = document.getElementById('review-screen');

        // Player display (no input needed as it comes from localStorage)
        this.playerDisplay = document.getElementById('player-display');

        // Navigation elements
        this.lockAnswerBtn = document.getElementById('lock-answer');
        this.nextBtn = document.getElementById('next-btn');
        this.submitBtn = document.getElementById('submit-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.reviewBtn = document.getElementById('review-btn');
        this.shareBtn = document.getElementById('share-btn');
        this.backToResultsBtn = document.getElementById('back-to-results');

        // Progress elements
        this.progressBar = document.getElementById('progress');
        this.currentQuestionSpan = document.getElementById('current-question');
        this.totalQuestionsSpan = document.getElementById('total-questions');
        this.currentPrize = document.getElementById('current-prize');
        this.prizeDisplay = document.getElementById('prize-display');

        // Timer elements
        this.timerDisplay = document.getElementById('timer');
        this.timerCircle = document.querySelector('.timer-circle');

        // Question elements
        this.questionText = document.getElementById('question-text');
        this.questionTypeIndicator = document.getElementById('question-type-indicator');
        this.questionNumber = document.getElementById('q-number');
        
        // Answer containers
        this.multipleChoiceContainer = document.getElementById('multiple-choice');
        this.multipleSelectContainer = document.getElementById('multiple-select');
        this.fillBlankContainer = document.getElementById('fill-blank');
        this.trueFalseContainer = document.getElementById('true-false');
        this.blankAnswer = document.getElementById('blank-answer');

        // Lifelines
        this.lifeline5050 = document.getElementById('lifeline-5050');
        this.lifelineAudience = document.getElementById('lifeline-audience');
        this.lifelineHint = document.getElementById('lifeline-hint');
        this.lifelineSkip = document.getElementById('lifeline-skip');

        // Modals
        this.audiencePollModal = document.getElementById('audience-poll-modal');
        this.hintModal = document.getElementById('hint-modal');
        this.shareModal = document.getElementById('share-modal');

        // Results elements
        this.finalScore = document.getElementById('final-score');
        this.maxScore = document.getElementById('max-score');
        this.percentage = document.getElementById('percentage');
        this.correctCount = document.getElementById('correct-count');
        this.incorrectCount = document.getElementById('incorrect-count');
        this.accuracy = document.getElementById('accuracy');
        this.performanceText = document.getElementById('performance-text');
        this.reviewContent = document.getElementById('review-content');
        this.winnerName = document.getElementById('winner-name');
        this.finalPrizeAmount = document.getElementById('final-prize-amount');
        this.achievementsList = document.getElementById('achievements-list');

        // Audio elements
        this.correctSound = document.getElementById('correct-sound');
        this.wrongSound = document.getElementById('wrong-sound');
        this.thinkingSound = document.getElementById('thinking-sound');
    }

    initializeEventListeners() {
        this.lockAnswerBtn.addEventListener('click', () => this.lockAnswer());
        this.nextBtn.addEventListener('click', () => this.nextQuestion());
        this.submitBtn.addEventListener('click', () => this.submitQuiz());
        this.restartBtn.addEventListener('click', () => this.restartQuiz());
        this.reviewBtn.addEventListener('click', () => this.showReview());
        this.shareBtn.addEventListener('click', () => this.showShareModal());
        this.backToResultsBtn.addEventListener('click', () => this.showResults());

        // Lifeline event listeners
        this.lifeline5050.addEventListener('click', () => this.use5050());
        this.lifelineAudience.addEventListener('click', () => this.useAudiencePoll());
        this.lifelineHint.addEventListener('click', () => this.useHint());
        this.lifelineSkip.addEventListener('click', () => this.skipQuestion());

        // Modal close listeners
        document.getElementById('close-poll').addEventListener('click', () => this.closeModal(this.audiencePollModal));
        document.getElementById('close-hint').addEventListener('click', () => this.closeModal(this.hintModal));
        document.getElementById('close-share').addEventListener('click', () => this.closeModal(this.shareModal));

        // Answer selection listeners
        this.multipleChoiceContainer.addEventListener('change', () => this.enableLockButton());
        this.multipleSelectContainer.addEventListener('change', () => this.enableLockButton());
        this.trueFalseContainer.addEventListener('change', () => this.enableLockButton());
        this.blankAnswer.addEventListener('input', () => this.enableLockButton());

        // Modal click outside to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal(e.target);
            }
        });
    }

    loadQuestions() {
        // Enhanced question sets with hints and better variety
        const questionSets = {
            general: {
                easy: [
                    {
                        type: 'multiple-choice',
                        question: 'What is the capital of France?',
                        options: ['London', 'Berlin', 'Paris', 'Madrid'],
                        correct: 'c',
                        hint: 'It is known as the City of Light and famous for the Eiffel Tower.',
                        explanation: 'Paris is the capital and largest city of France, known for its art, fashion, and culture.'
                    },
                    {
                        type: 'true-false',
                        question: 'The Great Wall of China is visible from space.',
                        correct: 'false',
                        hint: 'This is actually a popular myth that has been debunked by astronauts.',
                        explanation: 'This is a common myth. The Great Wall is not visible from space with the naked eye.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Which planet is known as the Red Planet?',
                        options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
                        correct: 'b',
                        hint: 'It is named after the Roman god of war and appears reddish due to iron oxide.',
                        explanation: 'Mars is called the Red Planet due to its reddish appearance caused by iron oxide on its surface.'
                    },
                    {
                        type: 'fill-blank',
                        question: 'The largest ocean on Earth is the ______ Ocean.',
                        correct: 'pacific',
                        hint: 'This ocean covers about one-third of Earth\'s surface and its name means "peaceful".',
                        explanation: 'The Pacific Ocean is the largest ocean, covering about 165 million square kilometers.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Who painted the Mona Lisa?',
                        options: ['Vincent van Gogh', 'Leonardo da Vinci', 'Pablo Picasso', 'Michelangelo'],
                        correct: 'b',
                        hint: 'This Renaissance artist was also an inventor, scientist, and engineer.',
                        explanation: 'Leonardo da Vinci painted the Mona Lisa between 1503-1519 during the Renaissance.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'What is the smallest country in the world?',
                        options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'],
                        correct: 'b',
                        hint: 'It is located within Rome and is the spiritual center of the Catholic Church.',
                        explanation: 'Vatican City is the smallest country with an area of just 0.17 square miles.'
                    },
                    {
                        type: 'true-false',
                        question: 'Bananas are berries.',
                        correct: 'true',
                        hint: 'Botanically speaking, this curved yellow fruit meets the criteria for being a berry.',
                        explanation: 'Botanically, bananas are classified as berries because they develop from a single flower.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'How many continents are there?',
                        options: ['5', '6', '7', '8'],
                        correct: 'c',
                        hint: 'Think of Asia, Africa, North America, South America, Antarctica, Europe, and one more.',
                        explanation: 'There are 7 continents: Asia, Africa, North America, South America, Antarctica, Europe, and Australia.'
                    },
                    {
                        type: 'fill-blank',
                        question: 'The currency of Japan is the ______.',
                        correct: 'yen',
                        hint: 'This currency symbol looks like Y with two horizontal lines.',
                        explanation: 'The Japanese yen is one of the most traded currencies in the world.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Which animal is known as the King of the Jungle?',
                        options: ['Tiger', 'Lion', 'Elephant', 'Gorilla'],
                        correct: 'b',
                        hint: 'Ironically, this animal doesn\'t actually live in jungles but in savannas.',
                        explanation: 'Lions are called the King of the Jungle despite living primarily in African savannas.'
                    },
                    {
                        type: 'true-false',
                        question: 'A group of flamingos is called a flamboyance.',
                        correct: 'true',
                        hint: 'The collective noun matches the bird\'s colorful and showy nature.',
                        explanation: 'A group of flamingos is indeed called a flamboyance, reflecting their bright pink color.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'What is the hardest natural substance on Earth?',
                        options: ['Gold', 'Iron', 'Diamond', 'Platinum'],
                        correct: 'c',
                        hint: 'This substance is often used in engagement rings and cutting tools.',
                        explanation: 'Diamond is the hardest natural substance, rating 10 on the Mohs hardness scale.'
                    },
                    {
                        type: 'fill-blank',
                        question: 'The study of earthquakes is called ______.',
                        correct: 'seismology',
                        hint: 'This field of study uses instruments that detect ground vibrations.',
                        explanation: 'Seismology is the scientific study of earthquakes and seismic waves.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Which country gifted the Statue of Liberty to the USA?',
                        options: ['England', 'France', 'Spain', 'Italy'],
                        correct: 'b',
                        hint: 'This country is known for the Eiffel Tower and croissants.',
                        explanation: 'France gifted the Statue of Liberty to the USA in 1886 to celebrate American independence.'
                    },
                    {
                        type: 'true-false',
                        question: 'Honey never spoils.',
                        correct: 'true',
                        hint: 'Archaeologists have found this sweet substance in ancient Egyptian tombs that was still edible.',
                        explanation: 'Honey has natural preservatives and low water content that prevent bacterial growth.'
                    }
                ],
                medium: [
                    {
                        type: 'multiple-choice',
                        question: 'Which element has the chemical symbol Au?',
                        options: ['Silver', 'Gold', 'Aluminum', 'Argon'],
                        correct: 'b',
                        hint: 'This precious metal\'s symbol comes from its Latin name "aurum".',
                        explanation: 'Gold has the chemical symbol Au, derived from the Latin word "aurum".'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Who wrote "To Kill a Mockingbird"?',
                        options: ['Harper Lee', 'Mark Twain', 'Ernest Hemingway', 'F. Scott Fitzgerald'],
                        correct: 'a',
                        hint: 'This author won the Pulitzer Prize for this novel about racial injustice.',
                        explanation: 'Harper Lee wrote "To Kill a Mockingbird", published in 1960.'
                    },
                    {
                        type: 'fill-blank',
                        question: 'The longest river in the world is the ______ River.',
                        correct: 'nile',
                        hint: 'This river flows through Egypt and several other African countries.',
                        explanation: 'The Nile River is 4,135 miles long, making it the longest river in the world.'
                    },
                    {
                        type: 'true-false',
                        question: 'Antarctica is a desert.',
                        correct: 'true',
                        hint: 'Despite being covered in ice, this continent receives very little precipitation.',
                        explanation: 'Antarctica is classified as a desert because it receives less than 10 inches of precipitation annually.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'In which year did World War II end?',
                        options: ['1944', '1945', '1946', '1947'],
                        correct: 'b',
                        hint: 'The war ended the same year the atomic bombs were dropped on Japan.',
                        explanation: 'World War II ended in 1945 with Japan\'s surrender in September.'
                    }
                ],
                hard: [
                    {
                        type: 'multiple-choice',
                        question: 'What is the powerhouse of the cell?',
                        options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Endoplasmic Reticulum'],
                        correct: 'c',
                        hint: 'This organelle produces ATP, the energy currency of cells.',
                        explanation: 'Mitochondria are called the powerhouse of the cell because they produce most of the cell\'s ATP.'
                    },
                    {
                        type: 'fill-blank',
                        question: 'The theory of ______ explains the origin of species.',
                        correct: 'evolution',
                        hint: 'This theory was proposed by Charles Darwin in the 19th century.',
                        explanation: 'The theory of evolution explains how species change and develop over time.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Which mathematician is known for the theorem a² + b² = c²?',
                        options: ['Euclid', 'Pythagoras', 'Archimedes', 'Plato'],
                        correct: 'b',
                        hint: 'This ancient Greek mathematician\'s theorem relates to right triangles.',
                        explanation: 'Pythagoras is credited with the Pythagorean theorem about right triangles.'
                    },
                    {
                        type: 'true-false',
                        question: 'Light travels faster than sound.',
                        correct: 'true',
                        hint: 'This is why you see lightning before hearing thunder.',
                        explanation: 'Light travels at about 300,000 km/s while sound travels at about 343 m/s in air.'
                    }
                ]
            },
            science: {
                easy: [
                    {
                        type: 'multiple-choice',
                        question: 'What is the chemical symbol for water?',
                        options: ['H2O', 'CO2', 'O2', 'NaCl'],
                        correct: 'a',
                        hint: 'It consists of two hydrogen atoms and one oxygen atom.',
                        explanation: 'Water has the chemical formula H2O, representing two hydrogen atoms bonded to one oxygen atom.'
                    },
                    {
                        type: 'multiple-select',
                        question: 'Which of the following are renewable energy sources?',
                        options: ['Solar', 'Coal', 'Wind', 'Nuclear'],
                        correct: ['a', 'c'],
                        hint: 'Think about energy sources that can be naturally replenished.',
                        explanation: 'Solar and wind are renewable because they can be naturally replenished, unlike coal which is finite.'
                    },
                    {
                        type: 'true-false',
                        question: 'The human body has 206 bones.',
                        correct: 'true',
                        hint: 'This is the number of bones in a fully developed adult skeleton.',
                        explanation: 'An adult human skeleton has 206 bones, though babies are born with about 270 bones.'
                    },
                    {
                        type: 'fill-blank',
                        question: 'The process by which plants make food is called ______.',
                        correct: 'photosynthesis',
                        hint: 'This process uses sunlight, water, and carbon dioxide to produce glucose.',
                        explanation: 'Photosynthesis is the process where plants convert light energy into chemical energy (glucose).'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'What is the speed of light in vacuum?',
                        options: ['300,000 km/s', '150,000 km/s', '450,000 km/s', '600,000 km/s'],
                        correct: 'a',
                        hint: 'It is approximately 3 × 10^8 meters per second.',
                        explanation: 'The speed of light in vacuum is approximately 299,792,458 meters per second or about 300,000 km/s.'
                    },
                    {
                        type: 'multiple-choice',
                        question: 'Which gas makes up most of Earth\'s atmosphere?',
                        options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'],
                        correct: 'c',
                        hint: 'This gas makes up about 78% of the atmosphere.',
                        explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere, while oxygen is about 21%.'
                    },
                    {
                        type: 'true-false',
                        question: 'Sound travels faster in water than in air.',
                        correct: 'true',
                        hint: 'Denser mediums generally allow sound to travel faster.',
                        explanation: 'Sound travels about 4 times faster in water than in air due to water\'s higher density.'
                    }
                ]
            },
            mixed: [
                {
                    type: 'multiple-choice',
                    question: 'Which programming language is known as the "mother of all languages"?',
                    options: ['Python', 'C', 'Java', 'Assembly'],
                    correct: 'b',
                    hint: 'This language influenced many modern programming languages.',
                    explanation: 'C is often called the mother of all languages due to its influence on modern programming.'
                },
                {
                    type: 'fill-blank',
                    question: 'The first computer programmer was ______ Lovelace.',
                    correct: 'ada',
                    hint: 'This 19th-century mathematician worked on Charles Babbage\'s Analytical Engine.',
                    explanation: 'Ada Lovelace is considered the first computer programmer for her work on the Analytical Engine.'
                },
                {
                    type: 'true-false',
                    question: 'The Internet and the World Wide Web are the same thing.',
                    correct: 'false',
                    hint: 'One is the infrastructure, the other is a service that runs on top of it.',
                    explanation: 'The Internet is the network infrastructure, while the Web is a service that uses the Internet.'
                }
            ]
        };

        // Set questions based on selected type and difficulty
        const selectedSet = questionSets[this.quizType] || questionSets.general;
        let questionPool = selectedSet[this.difficulty] || selectedSet.easy || questionSets.general.easy;
        
        // Shuffle questions randomly
        questionPool = this.shuffleArray([...questionPool]);
        
        // Select random questions based on difficulty
        const questionCount = this.difficulty === 'easy' ? 5 : this.difficulty === 'medium' ? 7 : 10;
        this.questions = questionPool.slice(0, questionCount);
        
        this.totalQuestionsSpan.textContent = this.questions.length;
    }
    
    // Helper method to shuffle array randomly
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    startQuiz() {
        // Get stored options from localStorage
        this.difficulty = localStorage.getItem('quizDifficulty') || 'easy';
        this.quizType = localStorage.getItem('quizCategory') || 'general';
        this.playerName = localStorage.getItem('quizPlayerName') || 'Quiz Champion';
        
        // Reset quiz state
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.userAnswers = [];
        this.answerLocked = false;
        this.lifelines = { fiftyFifty: true, audience: true, hint: true, skip: true };
        
        // Load questions for selected type and difficulty
        this.loadQuestions();
        
        // Update player display
        this.playerDisplay.textContent = this.playerName;
        
        // Load first question
        this.loadQuestion();
        this.updatePrizeDisplay();
    }

    loadQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        // Reset timer
        this.timeLeft = 10;
        this.startTimer();
        
        // Update progress
        this.updateProgress();
        
        // Hide all answer containers
        this.hideAllAnswerContainers();
        
        // Reset answer lock
        this.answerLocked = false;
        this.lockAnswerBtn.disabled = true;
        this.nextBtn.style.display = 'none';
        this.submitBtn.style.display = 'none';
        
        // Set question text and type
        this.questionText.textContent = question.question;
        this.questionTypeIndicator.textContent = this.getQuestionTypeLabel(question.type);
        this.questionNumber.textContent = this.currentQuestionIndex + 1;
        
        // Show appropriate answer container and populate options
        switch (question.type) {
            case 'multiple-choice':
                this.setupMultipleChoice(question);
                break;
            case 'multiple-select':
                this.setupMultipleSelect(question);
                break;
            case 'fill-blank':
                this.setupFillBlank(question);
                break;
            case 'true-false':
                this.setupTrueFalse(question);
                break;
        }

        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Add question entrance animation
        this.questionText.style.animation = 'none';
        setTimeout(() => {
            this.questionText.style.animation = 'screenSlide 0.6s ease';
        }, 100);
    }

    startTimer() {
        this.clearTimer();
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 10) {
                this.timerCircle.classList.add('warning');
            }
            
            if (this.timeLeft <= 0) {
                this.clearTimer();
                this.timeOut();
            }
        }, 1000);
    }

    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.timerCircle.classList.remove('warning');
    }

    updateTimerDisplay() {
        this.timerDisplay.textContent = this.timeLeft;
    }

    timeOut() {
        alert('Time\'s up! Moving to next question.');
        this.userAnswers[this.currentQuestionIndex] = null;
        this.nextQuestion();
    }

    updatePrizeDisplay() {
        const currentPrize = this.prizeStructure[this.difficulty][this.currentQuestionIndex] || 0;
        this.currentPrize.textContent = currentPrize.toLocaleString();
        this.prizeDisplay.textContent = `₹${currentPrize.toLocaleString()}`;
    }

    // Enhanced lifeline methods
    use5050() {
        if (!this.lifelines.fiftyFifty) return;
        
        const question = this.questions[this.currentQuestionIndex];
        if (question.type !== 'multiple-choice') {
            alert('50:50 lifeline can only be used on multiple choice questions!');
            return;
        }
        
        this.lifelines.fiftyFifty = false;
        this.lifeline5050.disabled = true;
        this.lifeline5050.style.opacity = '0.5';
        
        // Hide 2 wrong options
        const options = this.multipleChoiceContainer.querySelectorAll('.option');
        const correctAnswer = question.correct;
        let hiddenCount = 0;
        
        options.forEach((option, index) => {
            const optionValue = ['a', 'b', 'c', 'd'][index];
            if (optionValue !== correctAnswer && hiddenCount < 2) {
                option.style.display = 'none';
                hiddenCount++;
            }
        });
        
        // Play sound effect
        this.playSound('correct');
        
        // Show notification
        this.showNotification('50:50 Lifeline Used! Two wrong answers removed.', 'success');
    }

    useAudiencePoll() {
        if (!this.lifelines.audience) return;
        
        const question = this.questions[this.currentQuestionIndex];
        if (question.type !== 'multiple-choice') {
            alert('Audience poll can only be used on multiple choice questions!');
            return;
        }
        
        this.lifelines.audience = false;
        this.lifelineAudience.disabled = true;
        this.lifelineAudience.style.opacity = '0.5';
        
        // Generate realistic poll results (favoring correct answer)
        this.generateAudiencePoll(question);
        this.showModal(this.audiencePollModal);
    }

    generateAudiencePoll(question) {
        const correctIndex = ['a', 'b', 'c', 'd'].indexOf(question.correct);
        const polls = [15, 20, 25, 40]; // Base percentages
        
        // Give correct answer higher percentage (60-80%)
        polls[correctIndex] = 60 + Math.random() * 20;
        
        // Distribute remaining percentage among others
        const remaining = 100 - polls[correctIndex];
        const otherIndices = [0, 1, 2, 3].filter(i => i !== correctIndex);
        
        otherIndices.forEach((index, i) => {
            if (i === otherIndices.length - 1) {
                polls[index] = remaining - polls.slice(0, correctIndex).concat(polls.slice(correctIndex + 1, -1)).reduce((sum, val) => sum + (index > correctIndex ? val : 0), 0);
            } else {
                polls[index] = Math.random() * (remaining / 3);
            }
        });
        
        // Normalize to 100%
        const total = polls.reduce((sum, val) => sum + val, 0);
        polls.forEach((poll, index) => {
            polls[index] = Math.round((poll / total) * 100);
        });
        
        // Update poll display
        ['a', 'b', 'c', 'd'].forEach((letter, index) => {
            const fillElement = document.getElementById(`poll-${letter}`);
            const percentElement = document.getElementById(`poll-${letter}-percent`);
            
            setTimeout(() => {
                fillElement.style.width = `${polls[index]}%`;
                percentElement.textContent = `${polls[index]}%`;
            }, 500 + index * 200);
        });
    }

    useHint() {
        if (!this.lifelines.hint) return;
        
        const question = this.questions[this.currentQuestionIndex];
        
        this.lifelines.hint = false;
        this.lifelineHint.disabled = true;
        this.lifelineHint.style.opacity = '0.5';
        
        document.getElementById('hint-text').textContent = question.hint || 'No hint available for this question.';
        this.showModal(this.hintModal);
    }

    skipQuestion() {
        if (!this.lifelines.skip) return;
        
        this.lifelines.skip = false;
        this.lifelineSkip.disabled = true;
        this.lifelineSkip.style.opacity = '0.5';
        
        this.userAnswers[this.currentQuestionIndex] = 'skipped';
        this.showNotification('Question Skipped!', 'warning');
        
        setTimeout(() => {
            this.nextQuestion();
        }, 1000);
    }

    enableLockButton() {
        const question = this.questions[this.currentQuestionIndex];
        let hasAnswer = false;

        switch (question.type) {
            case 'multiple-choice':
                hasAnswer = this.multipleChoiceContainer.querySelector('input[type="radio"]:checked') !== null;
                break;
            case 'multiple-select':
                hasAnswer = this.multipleSelectContainer.querySelector('input[type="checkbox"]:checked') !== null;
                break;
            case 'fill-blank':
                hasAnswer = this.blankAnswer.value.trim() !== '';
                break;
            case 'true-false':
                hasAnswer = this.trueFalseContainer.querySelector('input[type="radio"]:checked') !== null;
                break;
        }

        this.lockAnswerBtn.disabled = !hasAnswer || this.answerLocked;
    }

    lockAnswer() {
        if (this.answerLocked) return;
        
        this.answerLocked = true;
        this.clearTimer();
        this.lockAnswerBtn.disabled = true;
        this.lockAnswerBtn.textContent = 'Answer Locked!';
        
        // Save answer and check if correct
        this.saveCurrentAnswer();
        const isCorrect = this.checkCurrentAnswer();
        
        // Show correct/incorrect animation
        this.showAnswerFeedback(isCorrect);
        
        // Show next button after animation
        setTimeout(() => {
            this.nextBtn.style.display = 'inline-flex';
            this.nextBtn.disabled = false;
        }, 2000);
    }

    checkCurrentAnswer() {
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        return this.isAnswerCorrect(question, userAnswer);
    }

    showAnswerFeedback(isCorrect) {
        const question = this.questions[this.currentQuestionIndex];
        
        if (isCorrect) {
            this.playSound('correct');
            this.showNotification('Correct Answer! 🎉', 'success');
            this.highlightCorrectAnswer();
        } else {
            this.playSound('wrong');
            this.showNotification('Wrong Answer! 😞', 'error');
            this.highlightCorrectAnswer();
            this.highlightUserAnswer(false);
        }
    }

    highlightCorrectAnswer() {
        const question = this.questions[this.currentQuestionIndex];
        
        if (question.type === 'multiple-choice' || question.type === 'true-false') {
            const correctValue = question.correct;
            const container = question.type === 'multiple-choice' ? this.multipleChoiceContainer : this.trueFalseContainer;
            const correctOption = container.querySelector(`input[value="${correctValue}"]`).closest('.option');
            
            correctOption.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
            correctOption.style.color = 'white';
            correctOption.style.transform = 'scale(1.02)';
            correctOption.style.boxShadow = '0 0 20px rgba(40, 167, 69, 0.5)';
        }
    }

    highlightUserAnswer(isCorrect) {
        // Highlight user's wrong answer in red
        const question = this.questions[this.currentQuestionIndex];
        const userAnswer = this.userAnswers[this.currentQuestionIndex];
        
        if (!isCorrect && (question.type === 'multiple-choice' || question.type === 'true-false')) {
            const container = question.type === 'multiple-choice' ? this.multipleChoiceContainer : this.trueFalseContainer;
            const userOption = container.querySelector(`input[value="${userAnswer}"]`)?.closest('.option');
            
            if (userOption) {
                userOption.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
                userOption.style.color = 'white';
                userOption.style.transform = 'scale(1.02)';
                userOption.style.boxShadow = '0 0 20px rgba(220, 53, 69, 0.5)';
            }
        }
    }

    playSound(type) {
        try {
            switch (type) {
                case 'correct':
                    this.correctSound.currentTime = 0;
                    this.correctSound.play();
                    break;
                case 'wrong':
                    this.wrongSound.currentTime = 0;
                    this.wrongSound.play();
                    break;
                case 'thinking':
                    this.thinkingSound.currentTime = 0;
                    this.thinkingSound.play();
                    break;
            }
        } catch (error) {
            console.log('Audio playback not supported');
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '10px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '1001',
            animation: 'slideInRight 0.5s ease',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        });
        
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #28a745, #20c997)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #dc3545, #c82333)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #ffc107, #e0a800)';
                notification.style.color = '#333';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #17a2b8, #138496)';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 3000);
    }

    calculateAchievements() {
        this.achievements = [];
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        // Score-based achievements
        if (percentage === 100) {
            this.achievements.push({ icon: 'fas fa-crown', name: 'Perfect Score', description: 'Answered all questions correctly!' });
        } else if (percentage >= 80) {
            this.achievements.push({ icon: 'fas fa-star', name: 'Excellence', description: '80%+ accuracy achieved!' });
        } else if (percentage >= 60) {
            this.achievements.push({ icon: 'fas fa-thumbs-up', name: 'Good Job', description: '60%+ accuracy achieved!' });
        }
        
        // Lifeline-based achievements
        const lifelinesUsed = Object.values(this.lifelines).filter(used => !used).length;
        if (lifelinesUsed === 0) {
            this.achievements.push({ icon: 'fas fa-brain', name: 'No Help Needed', description: 'Completed without using lifelines!' });
        }
        
        // Speed achievements
        if (this.timeLeft > 20) {
            this.achievements.push({ icon: 'fas fa-bolt', name: 'Speed Demon', description: 'Quick thinking!' });
        }
        
        // Difficulty achievements
        if (this.difficulty === 'hard' && percentage >= 70) {
            this.achievements.push({ icon: 'fas fa-fire', name: 'Hard Mode Master', description: 'Excelled in hard difficulty!' });
        }
    }

    displayAchievements() {
        this.achievementsList.innerHTML = '';
        
        this.achievements.forEach((achievement, index) => {
            const badge = document.createElement('div');
            badge.className = 'achievement-badge';
            badge.style.animationDelay = `${index * 0.2}s`;
            
            badge.innerHTML = `
                <i class="${achievement.icon}"></i>
                <span>${achievement.name}</span>
            `;
            
            badge.title = achievement.description;
            this.achievementsList.appendChild(badge);
        });
    }

    showShareModal() {
        const percentage = Math.round((this.score / this.questions.length) * 100);
        const finalPrize = this.prizeStructure[this.difficulty][Math.min(this.score - 1, this.prizeStructure[this.difficulty].length - 1)] || 0;
        
        document.getElementById('share-score').textContent = this.score;
        document.getElementById('share-total').textContent = this.questions.length;
        document.getElementById('share-prize').textContent = finalPrize.toLocaleString();
        document.getElementById('share-accuracy').textContent = percentage + '%';
        
        this.showModal(this.shareModal);
    }

    showModal(modal) {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.querySelector('.modal-content').style.animation = 'modalSlideIn 0.3s ease';
        }, 10);
    }

    closeModal(modal) {
        modal.querySelector('.modal-content').style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // Override parent methods with enhanced functionality
    showResults() {
        this.clearTimer();
        this.calculateAchievements();
        this.showScreen('results');
        
        // Display player name
        this.winnerName.textContent = this.playerName;
        
        // Calculate final prize
        const finalPrize = this.prizeStructure[this.difficulty][Math.min(this.score - 1, this.prizeStructure[this.difficulty].length - 1)] || 0;
        this.finalPrizeAmount.textContent = finalPrize.toLocaleString();
        
        // Display score with animation
        setTimeout(() => {
            this.finalScore.textContent = this.score;
            this.maxScore.textContent = this.questions.length;
            
            const percentage = Math.round((this.score / this.questions.length) * 100);
            this.percentage.textContent = percentage + '%';
            
            // Display breakdown
            this.correctCount.textContent = this.score;
            this.incorrectCount.textContent = this.questions.length - this.score;
            this.accuracy.textContent = percentage + '%';
            
            // Display performance message
            this.displayPerformanceMessage(percentage);
            
            // Display achievements
            this.displayAchievements();
        }, 500);
    }

    // Keep existing methods but enhance them
    hideAllAnswerContainers() {
        this.multipleChoiceContainer.style.display = 'none';
        this.multipleSelectContainer.style.display = 'none';
        this.fillBlankContainer.style.display = 'none';
        this.trueFalseContainer.style.display = 'none';
    }

    setupMultipleChoice(question) {
        this.multipleChoiceContainer.style.display = 'block';
        const options = this.multipleChoiceContainer.querySelectorAll('.option');
        
        options.forEach((option, index) => {
            if (index < question.options.length) {
                option.style.display = 'block';
                option.style.background = '';
                option.style.color = '';
                option.style.transform = '';
                option.style.boxShadow = '';
                
                const radio = option.querySelector('input[type="radio"]');
                const text = option.querySelector('.option-text');
                
                radio.checked = false;
                text.textContent = question.options[index];
            } else {
                option.style.display = 'none';
            }
        });
    }

    setupMultipleSelect(question) {
        this.multipleSelectContainer.style.display = 'block';
        const options = this.multipleSelectContainer.querySelectorAll('.option');
        
        options.forEach((option, index) => {
            if (index < question.options.length) {
                option.style.display = 'block';
                const checkbox = option.querySelector('input[type="checkbox"]');
                const text = option.querySelector('.option-text');
                
                checkbox.checked = false;
                text.textContent = question.options[index];
            } else {
                option.style.display = 'none';
            }
        });
    }

    setupFillBlank(question) {
        this.fillBlankContainer.style.display = 'block';
        this.blankAnswer.value = '';
        this.blankAnswer.focus();
    }

    setupTrueFalse(question) {
        this.trueFalseContainer.style.display = 'block';
        const options = this.trueFalseContainer.querySelectorAll('.option');
        options.forEach(option => {
            option.style.background = '';
            option.style.color = '';
            option.style.transform = '';
            option.style.boxShadow = '';
        });
        
        const radios = this.trueFalseContainer.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => radio.checked = false);
    }

    getQuestionTypeLabel(type) {
        const labels = {
            'multiple-choice': 'Multiple Choice',
            'multiple-select': 'Multiple Select',
            'fill-blank': 'Fill in the Blank',
            'true-false': 'True or False'
        };
        return labels[type] || type;
    }

    nextQuestion() {
        // Move to next question or show results
        this.currentQuestionIndex++;
        
        if (this.currentQuestionIndex < this.questions.length) {
            this.loadQuestion();
            this.updatePrizeDisplay();
        } else {
            this.calculateScore();
            this.showResults();
        }
    }

    saveCurrentAnswer() {
        if (this.userAnswers[this.currentQuestionIndex] !== undefined) return; // Already saved
        
        const question = this.questions[this.currentQuestionIndex];
        let userAnswer = null;

        switch (question.type) {
            case 'multiple-choice':
                const selectedRadio = this.multipleChoiceContainer.querySelector('input[type="radio"]:checked');
                userAnswer = selectedRadio ? selectedRadio.value : null;
                break;
            case 'multiple-select':
                const selectedCheckboxes = this.multipleSelectContainer.querySelectorAll('input[type="checkbox"]:checked');
                userAnswer = Array.from(selectedCheckboxes).map(cb => cb.value);
                break;
            case 'fill-blank':
                userAnswer = this.blankAnswer.value.trim().toLowerCase();
                break;
            case 'true-false':
                const selectedTF = this.trueFalseContainer.querySelector('input[type="radio"]:checked');
                userAnswer = selectedTF ? selectedTF.value : null;
                break;
        }

        this.userAnswers[this.currentQuestionIndex] = userAnswer;
    }

    submitQuiz() {
        this.saveCurrentAnswer();
        this.calculateScore();
        this.showResults();
    }

    calculateScore() {
        this.score = 0;
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            
            if (userAnswer !== 'skipped' && this.isAnswerCorrect(question, userAnswer)) {
                this.score++;
            }
        });
    }

    isAnswerCorrect(question, userAnswer) {
        if (userAnswer === null || userAnswer === undefined || userAnswer === 'skipped') return false;

        switch (question.type) {
            case 'multiple-choice':
            case 'true-false':
                return userAnswer === question.correct;
            case 'multiple-select':
                if (!Array.isArray(userAnswer) || !Array.isArray(question.correct)) return false;
                return userAnswer.length === question.correct.length && 
                       userAnswer.every(answer => question.correct.includes(answer));
            case 'fill-blank':
                return userAnswer.toLowerCase() === question.correct.toLowerCase();
            default:
                return false;
        }
    }

    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        this.progressBar.style.width = progress + '%';
        this.currentQuestionSpan.textContent = this.currentQuestionIndex + 1;
    }

    updateNavigationButtons() {
        const isLastQuestion = this.currentQuestionIndex === this.questions.length - 1;
        
        if (isLastQuestion) {
            this.submitBtn.style.display = 'inline-flex';
            this.submitBtn.disabled = false;
        }
        
        // Reset lock button
        this.lockAnswerBtn.textContent = 'Lock Answer';
        this.lockAnswerBtn.disabled = true;
    }

    displayPerformanceMessage(percentage) {
        const messageContainer = document.querySelector('.performance-message');
        let message = '';
        let className = '';

        if (percentage >= 90) {
            message = `🏆 Outstanding! ${this.playerName}, you're a true Quiz Master!`;
            className = 'excellent';
        } else if (percentage >= 70) {
            message = `🌟 Excellent work, ${this.playerName}! You have impressive knowledge!`;
            className = 'good';
        } else if (percentage >= 50) {
            message = `👍 Good effort, ${this.playerName}! Keep learning and improving!`;
            className = 'average';
        } else {
            message = `📚 Don't give up, ${this.playerName}! Practice makes perfect!`;
            className = 'poor';
        }

        this.performanceText.textContent = message;
        messageContainer.className = 'performance-message ' + className;
    }

    showReview() {
        this.showScreen('review');
        this.generateReviewContent();
    }

    generateReviewContent() {
        this.reviewContent.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer !== 'skipped' && this.isAnswerCorrect(question, userAnswer);
            
            reviewItem.innerHTML = `
                <div class="review-question">
                    Question ${index + 1}: ${question.question}
                </div>
                <div class="answer-status ${isCorrect ? 'correct' : 'incorrect'}">
                    ${isCorrect ? '✓ Correct' : userAnswer === 'skipped' ? '⏭️ Skipped' : '✗ Incorrect'}
                </div>
                <div class="review-answer user-answer">
                    <strong>Your Answer:</strong> ${this.formatAnswer(question, userAnswer)}
                </div>
                <div class="review-answer correct-answer">
                    <strong>Correct Answer:</strong> ${this.formatCorrectAnswer(question)}
                </div>
                <div class="review-explanation">
                    <strong>Explanation:</strong> ${question.explanation}
                </div>
            `;
            
            this.reviewContent.appendChild(reviewItem);
        });
    }

    formatAnswer(question, userAnswer) {
        if (userAnswer === null || userAnswer === undefined) {
            return 'No answer provided';
        }
        
        if (userAnswer === 'skipped') {
            return 'Question was skipped';
        }

        switch (question.type) {
            case 'multiple-choice':
            case 'true-false':
                if (question.type === 'multiple-choice') {
                    const optionIndex = ['a', 'b', 'c', 'd'].indexOf(userAnswer);
                    return optionIndex !== -1 ? question.options[optionIndex] : userAnswer;
                }
                return userAnswer.charAt(0).toUpperCase() + userAnswer.slice(1);
            case 'multiple-select':
                if (Array.isArray(userAnswer)) {
                    return userAnswer.map(answer => {
                        const optionIndex = ['a', 'b', 'c', 'd'].indexOf(answer);
                        return optionIndex !== -1 ? question.options[optionIndex] : answer;
                    }).join(', ');
                }
                return userAnswer;
            case 'fill-blank':
                return userAnswer;
            default:
                return userAnswer;
        }
    }

    formatCorrectAnswer(question) {
        switch (question.type) {
            case 'multiple-choice':
                const optionIndex = ['a', 'b', 'c', 'd'].indexOf(question.correct);
                return optionIndex !== -1 ? question.options[optionIndex] : question.correct;
            case 'true-false':
                return question.correct.charAt(0).toUpperCase() + question.correct.slice(1);
            case 'multiple-select':
                if (Array.isArray(question.correct)) {
                    return question.correct.map(answer => {
                        const optionIndex = ['a', 'b', 'c', 'd'].indexOf(answer);
                        return optionIndex !== -1 ? question.options[optionIndex] : answer;
                    }).join(', ');
                }
                return question.correct;
            case 'fill-blank':
                return question.correct;
            default:
                return question.correct;
        }
    }

    restartQuiz() {
        this.clearTimer();
        // Clear localStorage and redirect to start
        localStorage.removeItem('quizPlayerName');
        localStorage.removeItem('quizDifficulty');
        localStorage.removeItem('quizCategory');
        window.location.href = 'index.html';
    }

    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show selected screen
        switch (screenName) {
            case 'quiz':
                this.quizScreen.classList.add('active');
                break;
            case 'results':
                this.resultsScreen.classList.add('active');
                break;
            case 'review':
                this.reviewScreen.classList.add('active');
                break;
        }
    }
}

// Global functions for social sharing
function shareToTwitter() {
    const score = document.getElementById('share-score').textContent;
    const total = document.getElementById('share-total').textContent;
    const prize = document.getElementById('share-prize').textContent;
    const text = `🏆 I just scored ${score}/${total} in Quiz Master! 💰 Prize Won: ₹${prize} 🎯 Think you can beat me? #QuizMaster #BrainGame`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareToFacebook() {
    const score = document.getElementById('share-score').textContent;
    const total = document.getElementById('share-total').textContent;
    const text = `I scored ${score}/${total} in Quiz Master! Think you can do better?`;
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function copyToClipboard() {
    const score = document.getElementById('share-score').textContent;
    const total = document.getElementById('share-total').textContent;
    const prize = document.getElementById('share-prize').textContent;
    const text = `🏆 I just scored ${score}/${total} in Quiz Master! 💰 Prize Won: ₹${prize} 🎯 Think you can beat me?`;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('Results copied to clipboard!');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        alert('Results copied to clipboard!');
    });
}

// Initialize the enhanced quiz game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Check if we have required data from previous pages
    const playerName = localStorage.getItem('quizPlayerName');
    const difficulty = localStorage.getItem('quizDifficulty');
    const category = localStorage.getItem('quizCategory');
    
    // If missing data, redirect to appropriate page
    if (!playerName) {
        window.location.href = 'index.html';
        return;
    }
    
    if (!difficulty || !category) {
        window.location.href = 'level.html';
        return;
    }
    
    // Initialize quiz with stored data
    const quiz = new QuizMaster();
    
    // Add back button functionality
    const backButton = document.getElementById('back-to-level');
    if (backButton) {
        backButton.addEventListener('click', () => {
            quiz.clearTimer(); // Stop any running timer
            window.location.href = 'level.html';
        });
    }
    
    // Auto-start the quiz
    quiz.startQuiz();
});

// Add CSS for animations via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    .notification {
        animation: slideInRight 0.5s ease;
    }
`;
document.head.appendChild(style);
