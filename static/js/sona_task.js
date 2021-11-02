// var data = JSON.parse('{{ data | tojson | safe }}');
// console.log(data)

function clickedQuestionOne() {
    let isAnyChecked = false;
    let emotions = document.getElementsByName("d_emotion_1");

    for(let i = 0; i < emotions.length; i++) {
        isAnyChecked = isAnyChecked || emotions[i].checked;
    }

    let step3 = document.getElementById("step-3");
    let step4 = document.getElementById("step-4");
    let nextBtnForm = document.getElementById("nextBtnForm");

    if(isAnyChecked) {
        step3.style["display"] = "";
        step4.style["display"] = "";
        nextBtnForm.style["display"] = "";
    } else {
        step3.style["display"] = "none";
        step4.style["display"] = "none";
        nextBtnForm.style["display"] = "none";
    }
}

function loadImage(imageUrl) {
    let imageDiv = document.createElement("div");
    imageDiv.className = "text-center";
    let emotionImage = new Image();

    emotionImage.src = imageUrl;

    let i = 1;
    while (true) {
        i = i + 1;

        if (emotionImage.width / i <= 720 && emotionImage.height / i <= 720) {
            break;
        }
    }

    emotionImage.width = Math.floor(emotionImage.width / i);
    emotionImage.height = Math.floor(emotionImage.height / i);
    emotionImage.className = "img-thumbnail";

    imageDiv.appendChild(emotionImage);

    return imageDiv;
}

function loadSurvey(data) {
    let surveyDiv = document.getElementById("survey");

    for(let i = 0; i < data["samples"].length; i++) {
        let sampleDiv = loadSample(data["samples"][i], i+1);
        surveyDiv.appendChild(sampleDiv);
    }
}

function loadSample(sample, sample_number) {
    let sampleContainer = document.createElement("div");
    sampleContainer.className = "col-md-8 offset-md-2 vertical-filler-5";

    let header = document.createElement("h4");
    header.innerText = "Sample " + sample_number;
    sampleContainer.appendChild(header);

    let sampleId = "sample_" + sample_number;
    let questionId = "question_" + sample_number;
    let imgId = "img_url_" + sample_number;

    let sampleDiv = document.createElement("div");
    sampleDiv.id = sampleId;
    sampleContainer.appendChild(sampleDiv);

    if (sample[questionId] !== undefined) {
        let headlineParagraph = document.createElement("p");
        headlineParagraph.innerText = sample[questionId];
        headlineParagraph.className = "blockquote text-center";
        sampleDiv.appendChild(headlineParagraph);
    }

    if (sample[imgId] !== undefined) {
        let emotionImageDiv = loadImage(sample[imgId]);
        sampleDiv.appendChild(emotionImageDiv);
    }

    let verticalFiller = document.createElement("div");
    verticalFiller.className = "vertical-filler-2-5";

    sampleDiv.appendChild(verticalFiller);

    questionDiv = getQuestions(sample_number);
    sampleDiv.appendChild(questionDiv);

    return sampleContainer;
}

function getQuestions(sample_number) {
    let questionDiv = document.createElement("div");

    let question1Para = document.createElement("p");
    question1Para.innerText = "Given the above news content in the context of gun violence, what is the dominant emotion that you feel?";
    question1Para.className = "blockquote";
    questionDiv.appendChild(question1Para);

    let emotions = ["Amusement", "Awe", "Contentment", "Excitement", "Fear", "Sadness", "Anger"];
    for (let i = 0; i < emotions.length; i++) {
        let option = getFormCheck(emotions[i], sample_number);
        questionDiv.appendChild(option);
    }

    let verticalFiller = document.createElement("div");
    verticalFiller.className = "vertical-filler-2-5";
    questionDiv.appendChild(verticalFiller);

    let question2Para = document.createElement("p");
    question2Para.innerText = "What is the intensity of your feeling?";
    question2Para.className = "blockquote";
    questionDiv.appendChild(question2Para);

    return questionDiv
}

function getFormCheck(emotion, sample_number) {
    let emotionId = emotion + sample_number;
    let name = "d_emotion_" + sample_number;

    let formCheck = document.createElement("div");
    formCheck.className = "form-check";

    let radioBtn = document.createElement("input");
    radioBtn.type = "radio";
    radioBtn.id = emotionId;
    radioBtn.name = name;
    radioBtn.value = emotion;
    radioBtn.className = "form-check-input";
    formCheck.appendChild(radioBtn);

    let label = document.createElement("label");
    label.for = emotionId;
    label.className = "form-check-label";
    label.innerText = emotion;
    formCheck.appendChild(label);

    return formCheck
}