var scrolled = false;
var emotionSelected = "";

const emotionWheelMap = new Map();

emotionWheelMap.set("Joy", ["Serenity", "Ecstasy"]);
emotionWheelMap.set("Trust", ["Acceptance", "Admiration"]);
emotionWheelMap.set("Fear", ["Apprehension", "Terror"]);
emotionWheelMap.set("Surprise", ["Distration", "Amazement"]);
emotionWheelMap.set("Sadness", ["Pensiveness", "Grief"]);
emotionWheelMap.set("Disgust", ["Boredom", "Loathing"]);
emotionWheelMap.set("Anger", ["Annoyance", "Rage"]);
emotionWheelMap.set("Anticipation", ["Interest", "Vigilance"]);

function checkAllRadioBoxes() {
    emotions = ["Anger","Anticipation","Joy","Trust","Fear","Surprise","Sadness","Disgust"];
    for (let i = 1; i <= 10; i++) {
        isChecked = false;
        for (let j=0;j<8; j++) {
            radioBoxId = emotions[j]+"_"+i;
            console.log("radioBoxId: "+radioBoxId);
            radiobox = document.getElementById(radioBoxId);
            if(radiobox.checked == true)
            {isChecked = true;}
        }
        if (isChecked==false) {
            return false;
        }
    }
    return true;
}

function checkAllTextBoxes() {
    let isEmpty = false;
    let textBoxEmoId;
    let textBoxReasonId;
    let textBoxEmo;
    let textBoxReason;
    for (let i = 1; i <= 10; i++) {
        textBoxEmoId = "questionThree_emo_" + i;
        textBoxReasonId = "questionThree_reason_" + i;
        console.log("textBoxEmoId: " + textBoxEmoId);
        console.log("textBoxReasonId: " + textBoxReasonId);
        textBoxEmo = document.getElementById(textBoxEmoId);
        textBoxReason = document.getElementById(textBoxReasonId);
        console.log("textBoxEmo.value.length: " + textBoxEmo.value.length);
        console.log("textBoxReason.value.length: " + textBoxReason.value.length);
        if (textBoxEmo.value.length <= 0 || textBoxReason.value.length <= 0) {
            isEmpty = true;
        }
    }
    return isEmpty !== true;
}

function submitForm(e) {
    if(!checkAllRadioBoxes())
    {
        alert("at least one of the questions one is not finished, please check.")
        return false;
    }
    if(!checkAllTextBoxes())
    {
        alert("at least one of the questions three is left empty, please check.")
        return false;
    }

    //check answers before submission:


    // if (!scrolled) {
    //     e.preventDefault();
    //     alert("Please provide an intensity of the emotion for question 2");
    //     return false;
    // }
}

function scrolledIntesity(intensity) {
    // alert("scrolled")
    scrolled = true;
}


function clickedQuestionOne(emotion) {
    emotionSelected = emotion;
    const leftCol = document.getElementById("left-col");
    const centerCol = document.getElementById("center-col");
    const rightCol = document.getElementById("right-col");

    const leftCol2 = document.getElementById("left-col-2");
    const centerCol2 = document.getElementById("center-col-2");
    const rightCol2 = document.getElementById("right-col-2");

    const wheelEntries = emotionWheelMap.get(emotion);
    // submitButton = document.getElementById("submitButton");
    // submitButton.style.display='inline'

    leftCol.innerHTML = wheelEntries[0];
    centerCol.innerHTML = emotion;
    rightCol.innerHTML = wheelEntries[1];


    leftCol2.innerHTML = "(Mild&nbsp;" + emotion + ")";
    centerCol2.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
    rightCol2.innerHTML = "(Extreme&nbsp;" + emotion + ")";
}


function buildQuiz() {
    // variable to store the HTML output
    const output = [];

    // for each question...
    myQuestions.forEach(
        (currentQuestion, questionNumber) => {

            // variable to store the list of possible answers
            const answers = [];

            // and for each available answer...
            for (letter in currentQuestion.answers) {

                // ...add an HTML radio button
                answers.push(
                    `<label>
          <input type="radio" name="question${questionNumber}" value="${letter}">
          ${letter} :
          ${currentQuestion.answers[letter]}
        </label>`
                );
            }

            // add this question and its answers to the output
            output.push(
                `<div class="slide">
          <img class="image" src="${currentQuestion.imageUrl}"/>
       </div>`
            );

        }
    );

    // finally combine our output list into one string of HTML and put it on the page
    quizContainer.innerHTML = output.join('');
}

function showSlide(n) {
    slides[currentSlide].classList.remove('active-slide');
    slides[n].classList.add('active-slide');

    var currentSlideQuestionOneID = "questionOne_"+ (n+1);
    var currentSlideScrollBarID = "i_emo_"+ (n+1);
    var currentSlideQuestionThreeID = "questionThree_"+ (n+1);

    if(n>currentSlide) //n=current+1
    {
        var lastSlideQuestionOneID = "questionOne_"+ (n);
        var lastSlideScrollBarID = "i_emo_"+ (n);
        var lastSlideQuestionThreeID = "questionThree_"+ (n);
    }
    else //n=current-1 if current = 8, if previous: n = 7, close 9 and open 8
    {
        var lastSlideQuestionOneID = "questionOne_"+ (n+2);
        var lastSlideScrollBarID = "i_emo_"+ (n+2);
        var lastSlideQuestionThreeID = "questionThree_"+ (n+2);
    }

    document.getElementById(currentSlideQuestionOneID).style.display = "flex";
    document.getElementById(currentSlideScrollBarID).style.display = "inline";
    document.getElementById(currentSlideQuestionThreeID).style.display = "inline";

    document.getElementById(lastSlideQuestionOneID).style.display = "none";
    document.getElementById(lastSlideScrollBarID).style.display = "none";
    document.getElementById(lastSlideQuestionThreeID).style.display = "none";

    submitButton = document.getElementById("submitButton");
    submitWarning = document.getElementById("submitWarning");

    currentSlide = n;

    document.getElementById("index").innerHTML = n+1 + ": ";

    if (currentSlide === slides.length - 1) {
        submitButton.style.display = 'inline';
        submitWarning.style.display = 'inline';
        nextButton.style.display = 'none';

    } else {
        nextButton.style.display = 'inline-block';
        previousButton.style.display = 'inline-block';
    }

    if(currentSlide == 0)
    {
        previousButton.style.display = 'none';
    }
}

// code reference: https://stackoverflow.com/questions/10473745/compare-strings-javascript-return-of-likely
function similarStrings(s1, s2, threshold) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    console.log("s1: ", s1);
    console.log("s2: ", s2);
    console.log("similarity: ", (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength));
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength) > threshold;
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function showNextSlide(isNext) {
    if (isNext) {
        const questionOneAnswer = emotionSelected;
        const questionThreeAnswerEmo = document.getElementById("questionThree_emo_" + (currentSlide + 1)).value;
        const questionThreeAnswerReason = document.getElementById("questionThree_reason_" + (currentSlide + 1)).value;

        console.log("questionOneAnswer: ", questionOneAnswer);
        console.log("questionThreeAnswerEmo: ", questionThreeAnswerEmo);
        console.log("questionThreeAnswerReason: ", questionThreeAnswerReason);

        // question 3 answer check
        if (questionThreeAnswerEmo.length <= 0) {
            alert("Please provide at least one word for how you feel for question 3.");
            return -1;
        }

        if (questionThreeAnswerReason.split(' ').length <= 5) {
            alert("Please provide at least 5 words for the reason of question 3.");
            return -1;
        }

        // check similarity with 70% similarity threshold
        if (similarStrings(myQuestions[currentSlide].title, questionThreeAnswerReason, 0.7)) {
            alert("Your reason for question 3 is too similar to the title. Please avoid copying and pasting.");
            return -1;
        }
    }

    document.getElementById("left-col").innerHTML = "";
    document.getElementById("center-col").innerHTML = "";
    document.getElementById("right-col").innerHTML = "";

    document.getElementById("left-col-2").innerHTML = "";
    document.getElementById("center-col-2").innerHTML = "";
    document.getElementById("right-col-2").innerHTML = "";

    if(isNext)
    {
        showSlide(currentSlide + 1);
    }
    else
    {
        showSlide(currentSlide - 1);
    }
}

// Variables
const quizContainer = document.getElementById('quiz');
const myQuestions = [
    {
        title: document.getElementById('q_1').innerHTML,
        imageUrl: document.getElementById('img_1').src
    },
    {
        title: document.getElementById('q_2').innerHTML,
        imageUrl: document.getElementById('img_2').src
    },
    {
        title: document.getElementById('q_3').innerHTML,
        imageUrl: document.getElementById('img_3').src
    },
    {
        title: document.getElementById('q_4').innerHTML,
        imageUrl: document.getElementById('img_4').src
    },

    {
        title: document.getElementById('q_5').innerHTML,
        imageUrl: document.getElementById('img_5').src
    },
    {
        title: document.getElementById('q_6').innerHTML,
        imageUrl: document.getElementById('img_6').src
    },
    {
        title: document.getElementById('q_7').innerHTML,
        imageUrl: document.getElementById('img_7').src
    },
    {
        title: document.getElementById('q_8').innerHTML,
        imageUrl: document.getElementById('img_8').src
    },

    {
        title: document.getElementById('q_9').innerHTML,
        imageUrl: document.getElementById('img_9').src
    },
    {
        title: document.getElementById('q_10').innerHTML,
        imageUrl: document.getElementById('img_10').src
    }
];

// Kick things off
buildQuiz();

// Pagination
const nextButton = document.getElementById("next");
const previousButton = document.getElementById("previous");
const slides = document.querySelectorAll(".slide");
let currentSlide = 0;

// Show the first slide
showSlide(currentSlide);

// Event listeners
// nextButton.addEventListener("click", showNextSlide);
