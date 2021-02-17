var synth = window.speechSynthesis;

var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('textarea');
var voiceSelect = document.querySelector('select');
var sentenceDiv = document.querySelector('div.phrases');
var sentenceDataList = document.querySelector('#wordSearch');
var sentenceText = document.querySelector('#sentenceText');
var sentenceInput = document.querySelector('#sentenceInput');

var pitch = document.querySelector('#pitch');
var pitchValue = document.querySelector('.pitch-value');
var rate = document.querySelector('#rate');
var rateValue = document.querySelector('.rate-value');

var voices = [];

var phraseArray = ["hello", "yes", "no", "how are you", "okay", "sure", "what", "o", "just", "ignore", "me", "you", "well", "and", "i", "we", "i'm", "nice"];

var textToRead = "";

var voiceActive = false;
var talking = false;

var voicePitch = 1;
var voiceRate = 1;


var sentenceBulidString = "";
var sentenceBulidArray = [];

var unconvertedWordList = "";
var convertedWordList;
var backCount = 0;

document.getElementById('inputfile') 
    .addEventListener('change', function() { 
              
        var fr=new FileReader(); 
		fr.onload=function(){ 
			unconvertedWordList = fr.result;
			ConvertWordList();
	} 
	
	fr.readAsText(this.files[0]); 
})

function ConvertWordList() {
	convertedWordList = unconvertedWordList.split('\n');
	GenerateSentenceOptionsWords();
}


//readTextFile("wordList.txt");

function AddToSentence(phrase) {
	sentenceBulidArray.push(phrase);
	SentenceShowUpdate();
}

function SaySentence() {
	sentenceBulidString = "";
	for (let index = 0; index < sentenceBulidArray.length; index++) {
		const element = sentenceBulidArray[index];
		sentenceBulidString += element;
	}
	ReadText(sentenceBulidString);
	sentenceBulidArray = [];
	console.log("Saying sentence");
	SentenceShowUpdate();
}

function ClearSentence() {
	sentenceBulidArray = [];
	SentenceShowUpdate();
	console.log("cleard centence");
}

function SentenceShowUpdate() {
	sentenceBulidString = "";
	for (let index = 0; index < sentenceBulidArray.length; index++) {
		const element = sentenceBulidArray[index];
		sentenceBulidString += element;
	}
	sentenceText.innerHTML = sentenceBulidString;
}

function GenerateSentenceOptions() {
	for (let index = 0; index < phraseArray.length; index++) {
		const element = phraseArray[index];
		let option = document.createElement("option");
		option.value = element;
		sentenceDataList.appendChild(option);
	}
}

function GenerateSentenceOptionsWords() {
	for (let index = 0; index < convertedWordList.length; index++) {
		const element = convertedWordList[index];
		let option = document.createElement("option");
		option.value = element;
		sentenceDataList.appendChild(option);
	}
}

GenerateSentenceOptions();

function GenerateSentenceButtons() {
	for (let index = 0; index < phraseArray.length; index++) {
		const element = phraseArray[index];
		let button = document.createElement("button");
		button.addEventListener('click', function(){
			AddToSentence(element);
		})
		button.innerText = element;
		button.classList.add("button");
		sentenceDiv.appendChild(button);
	}
}


sentenceInput.addEventListener('keyup', function(event){
	if(event.constructor.name === "Event"){
		console.log(sentenceInput.value);
		AddToSentence(sentenceInput.value + " ");
		sentenceInput.value = "";
	}
	else if(event.key == "Enter"){
		console.log(sentenceInput.value);
		AddToSentence(sentenceInput.value + " ");
		sentenceInput.value = "";
	}
	else if(event.key == " "){
		console.log(sentenceInput.value);
		AddToSentence(sentenceInput.value);
		sentenceInput.value = "";
	}
	else if(event.code == "ShiftRight"){
		AddToSentence(sentenceInput.value);
		sentenceInput.value = "";
		SaySentence();
	}
	else if(event.key == "ä"){
		ClearSentence();
	}
	else if(event.key == "Backspace" && sentenceInput.value == "" &&  backCount == 1){
		backCount = 0;
		sentenceInput.value = sentenceBulidArray.pop();
		SentenceShowUpdate();
	}
	else if(event.key == "Backspace" && sentenceInput.value == ""){
		backCount = 1;
	}
	else{
		backCount = 0;
	}
	
	//console.log(event);
});

function populateVoiceList() {
  voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';
    
    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
  speechSynthesis.onvoiceschanged = null;
}

populateVoiceList();
GenerateSentenceButtons();

if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}


inputForm.onsubmit = function(event) {
  event.preventDefault();

  var utterThis = new SpeechSynthesisUtterance(inputTxt.value);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.pitch = voicePitch;
  utterThis.rate = voiceRate;
  synth.speak(utterThis);
  talking = true;

  inputTxt.blur();
}

function PauseTalking() {
	if(talking){
		synth.pause();
		talking = false;
	}
	else{
		talking = true;
		synth.resume();
	}
}

function StopTalking() {
	synth.cancel();
	talking = false;
}

function ReadText(textToReadIn) {
	var utterThis = new SpeechSynthesisUtterance(textToReadIn);
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utterThis.voice = voices[i];
    }
  }
  utterThis.pitch = voicePitch;
  utterThis.rate = voiceRate;
  synth.speak(utterThis);
  talking = true;
}

try {
	var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
	var recognition = new SpeechRecognition();
	
}
catch(e) {
	console.error(e);
}

recognition.continuous = true;

recognition.onstart = function() { 
	console.log('Voice recognition activated. Try speaking into the microphone.');
  }
  
  recognition.onspeechend = function() {
	console.log('You were quiet for a while so voice recognition turned itself off.');
  }
  
recognition.onerror = function(event) {
	console.log(event.error);
}

recognition.onresult = function(event) {

	// event is a SpeechRecognitionEvent object.
	// It holds all the lines we have captured so far. 
	// We only need the current one.
	var current = event.resultIndex;
  
	// Get a transcript of what was said.
	var transcript = event.results[current][0].transcript;
  
	// Add the current transcript to the contents of our Note.
	console.log(transcript);
	textToRead = transcript;
	ReadText(transcript);
}

function voiceStart() {
	recognition.start();
}

function voiceEnd() {
	recognition.stop();
}

function UseVoice(){
	if(!voiceActive){
		recognition.start();
		voiceActive = true;
	}
	else{
		recognition.stop();
		voiceActive = false;
	}
}
