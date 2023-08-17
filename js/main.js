console.log('hello');

// Initialize variables
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
let score = 0;

const genres = [
  {
    name: 'General Knowledge',
    id: 9
},
{
    name: 'Geography',
    id: 22
},
{
    name: 'Music',
    id: 12
},
{
    name: 'Animals',
    id: 27
}
];

const levels = ['easy', 'medium', 'hard'];

// Function to add genres and questions to the grid
function addGenresAndQuestions() {
    const gridContainer = document.querySelector('.grid-container');
    
    genres.forEach(genre => {
        const genreColumn = document.createElement('div');
        genreColumn.classList.add('genre-column');
        
        const genreName = document.createElement('h3');
        genreName.textContent = genre.name;
        
        genreColumn.appendChild(genreName);
        
        levels.forEach(level => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.innerHTML = getCardValue(level);

            card.addEventListener('click', function() {
                // Handle selecting the answer and updating the score
                handleAnswer(this, genre.id, level);
            });

            genreColumn.appendChild(card);
        });
        
        gridContainer.appendChild(genreColumn);
    });
}

// Function to get card value based on difficulty level
function getCardValue(level) {
    if (level === 'easy') return '$100';
    if (level === 'medium') return '$200';
    if (level === 'hard') return '$300';
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



function handleAnswer(card, categoryId, difficulty) {
  axios.get(`https://opentdb.com/api.php?amount=1&category=${categoryId}&difficulty=${difficulty}&type=multiple`)
      .then(response => {
          const questionData = response.data.results[0];
          const question = decodeHtmlEntities(questionData.question); // Decode HTML entities
          const answerChoices = shuffleArray([
              ...questionData.incorrect_answers,
              questionData.correct_answer
          ]);

          const questionElement = document.getElementById('question');
          const answerChoicesList = document.getElementById('answer-choices');

          questionElement.textContent = question;

          answerChoicesList.innerHTML = answerChoices.map(choice => {
              return `<li class="answer-choice">${choice}</li>`;
          }).join('');

          answerChoicesList.addEventListener('click', event => {
              const selectedAnswer = event.target.textContent;
              if (selectedAnswer === questionData.correct_answer) {
                  score += parseInt(card.textContent.substring(1));
                  scoreDisplay.textContent = score;
                  card.classList.add('correct-answer');
              } else {
                  card.classList.add('wrong-answer');
              }

              card.removeEventListener('click', handleAnswer);
              questionElement.textContent = '';
              answerChoicesList.innerHTML = '';
          });
      })
      .catch(error => {
          console.error('Error fetching question:', error);
      });
}

function decodeHtmlEntities(text) {
  const parser = new DOMParser();
  const decodedString = parser.parseFromString(`<!doctype html><body>${text}`, 'text/html').body.textContent;
  return decodedString;
}


// Call the function to add genres and questions
addGenresAndQuestions();
