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

//    emotionImage.width = Math.floor(emotionImage.width / i);
//    emotionImage.height = Math.floor(emotionImage.height / i);
    emotionImage.width = 500;
    emotionImage.height = 300;
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

    let submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.className = "btn btn-primary";
    submitBtn.formmethod = "post";
    submitBtn.id = "submitBtn";
    submitBtn.innerText = "Submit";
    submitBtn.onclick = function(event) {submitSurveyClicked(event)};
    surveyDiv.appendChild(submitBtn);
}

function submitSurveyClicked(event) {
    let emotions = ["Amusement", "Awe", "Contentment", "Excitement", "Fear", "Sadness", "Anger"]

    hasUnfinished = false

    let question1s_selected = []
    let feelings = []
    let reasons = []

    for (let i = 1; i <= 20; i++) {
        feelings.push(document.getElementById("t_emotion_" + i).value)
        reasons.push(document.getElementById("t_emotion_reason_" + i).value)
        question1_selected = false
        for (emotion of emotions) {
            checked = document.getElementById(emotion + i).checked
            if (checked) {
                question1_selected = true
            }
        }
        question1s_selected.push(question1_selected)
    }

    for (let i = 0; i < 20; i++) {
        let feeling = feelings[i]
        let reason = reasons[i]
        let question1_selected = question1s_selected[i]
        if (reason.length == 0 || feeling.length == 0 || !question1_selected) { hasUnfinished = true }
    }

    if (hasUnfinished) {
        alert("you have unfinished areas")
        event.preventDefault();
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

    let hasText = false;
    let hasImg = false;

    if (sample[questionId] !== undefined) {
        hasText = true;
        let headlineParagraph = document.createElement("p");
        headlineParagraph.innerText = "News Headline: \"" + sample[questionId] + "\"";
        headlineParagraph.className = "blockquote text-center";
        sampleDiv.appendChild(headlineParagraph);
    }

    if (sample[imgId] !== undefined) {
        hasImg = true;
        let emotionImageDiv = loadImage(sample[imgId]);
        sampleDiv.appendChild(emotionImageDiv);
    }

    let verticalFiller = document.createElement("div");
    verticalFiller.className = "vertical-filler-2-5";

    sampleDiv.appendChild(verticalFiller);

    questionDiv = getQuestions(sample_number, hasText, hasImg);
    sampleDiv.appendChild(questionDiv);

    return sampleContainer;
}

function getQuestions(sample_number, hasText, hasImg) {
    let imgText = "";
    if(hasImg && hasText) {
        imgText = "image + text";
    } else if (hasImg) {
        imgText = "image";
    } else if (hasText) {
        imgText = "text";
    } else {
        imgText = "news content";
    }
    let questionDiv = document.createElement("div");

    let question1Para = document.createElement("p");
    question1Para.innerText = "Given the above " + imgText + " in the context of gun violence, what is the dominant emotion that you feel?";
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

    let intensityForm = getIntensityForm(sample_number);
    questionDiv.appendChild(intensityForm);

    let question3Para = document.createElement("p");
    question3Para.innerText = "The above news content made me feel:";
    question3Para.className = "blockquote";
    questionDiv.appendChild(question3Para);

    let tEmotionName = "t_emotion_" + sample_number;
    let emotionTextDiv = document.createElement("div");
    emotionTextDiv.className = "form-group";

    let emotionTextInput = document.createElement("input");
    emotionTextInput.className = "form-control";
    emotionTextInput.name = tEmotionName;
    emotionTextInput.id = tEmotionName;
    emotionTextInput.type = "text";
    emotionTextInput.placeholder = "emotion";
    emotionTextDiv.appendChild(emotionTextInput);
    questionDiv.appendChild(emotionTextDiv);
    questionDiv.appendChild(verticalFiller)

    let tEmotionReasonName = "t_emotion_reason_" + sample_number;
    let question4Para = document.createElement("p");
    question4Para.innerText = "because:";
    question4Para.className = "blockquote";
    questionDiv.appendChild(question4Para);

    let emotionTextArea = document.createElement("textarea");
    emotionTextArea.className = "form-control";
    emotionTextArea.name = tEmotionReasonName;
    emotionTextArea.id = tEmotionReasonName;
    emotionTextArea.type = "text";
    emotionTextArea.placeholder = "describe your reason here. Please do not provide image captioning or descriptions about what you see in the image, but focus on explaining how you feel and why.";
    emotionTextArea.rows = "5";
    questionDiv.appendChild(emotionTextArea);
    questionDiv.appendChild(verticalFiller)

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

function getIntensityForm(sample_number) {
    let name = "emotion_intensity_" + sample_number;

    let formGroup = document.createElement("div");
    formGroup.className = "form-group";

    let label = document.createElement("label");
    label.className = "form-label";
    label.innerText = "";
    formGroup.appendChild(label);

    let rangeInput = document.createElement("input");
    rangeInput.className = "form-range";
    rangeInput.id = name;
    rangeInput.name = name;
    rangeInput.type = "range";
    rangeInput.min = 1;
    rangeInput.max = 5;
    rangeInput.value = 3;

    let label_left = document.createElement("label");
    label_left.id = name + "label_left";
    label_left.style="text-align: left;"
    label_left.innerText = "Mild"

    let label_right = document.createElement("label");
    label_right.id = name + "label_right";
    label_right.style="float: right;"
    label_right.innerText = "Extreme"

    formGroup.appendChild(label_left);
    formGroup.appendChild(label_right);
    formGroup.appendChild(rangeInput);


    return formGroup;
}
