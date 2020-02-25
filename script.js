const RANDOM_QUOTE_API_URL = 'http://api.quotable.io/random'
const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const timerElement = document.getElementById('timer')

const{fromEvent,of,from, interval}= rxjs;
const{flatMap,map}=rxjs.operators;


const event$ = fromEvent(quoteInputElement, 'input');
event$.subscribe( _ => {
  const arrayQuote = quoteDisplayElement.querySelectorAll('span');
  const arrayValue = quoteInputElement.value.split('');

// quoteInputElement.addEventListener('input', () => {
//   const arrayQuote = quoteDisplayElement.querySelectorAll('span')
//   const arrayValue = quoteInputElement.value.split('')

  let correct = true
  arrayQuote.forEach((characterSpan, index) => {
    const character = arrayValue[index]
    if (character == null) {
      characterSpan.classList.remove('correct')
      characterSpan.classList.remove('incorrect')
      correct = false
    } else if (character === characterSpan.innerText) {
      characterSpan.classList.add('correct')
      characterSpan.classList.remove('incorrect')
    } else {
      characterSpan.classList.remove('correct')
      characterSpan.classList.add('incorrect')
      correct = false
    }
  })

  if (correct) renderNewQuote()
})

function getRandomQuote() {
  return from(fetch(RANDOM_QUOTE_API_URL))
    .pipe(flatMap(response => from(response.json())))}

// function getRandomQuote() {
//   return fetch(RANDOM_QUOTE_API_URL)
//     .then(response => response.json())
//     .then(data => data.content)
// }

function renderNewQuote() {
  getRandomQuote().subscribe( (data) => {
    quoteDisplayElement.innerHTML = ''
  data.content.split('').forEach(character => {
    const characterSpan = document.createElement('span')
    characterSpan.innerText = character
    quoteDisplayElement.appendChild(characterSpan)
  })
  
  
  quoteInputElement.value = null
  startTimer()
})
}
// async function renderNewQuote() {
//   const quote = await getRandomQuote()
//   quoteDisplayElement.innerHTML = ''
//   quote.split('').forEach(character => {
//     const characterSpan = document.createElement('span')
//     characterSpan.innerText = character
//     quoteDisplayElement.appendChild(characterSpan)
//   })
//   quoteInputElement.value = null
//   startTimer()
// }

let startTime
function startTimer() {
  const timer$ = interval(1000)
  timerElement.innerText = 0
  startTime = new Date()
  timer$.subscribe(_ => {
    if (getTimerTime() ===100) {
      renderNewQuote();
    }
    timer.innerText = getTimerTime()
  })

}
  
function getTimerTime() {
  return Math.floor((new Date() - startTime) / 1000)
}

renderNewQuote()