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

function loadImage(id_div) {
    let imageDiv = document.getElementById(id_div);
    console.log(id_div);
    console.log(imageDiv);

    let emotionImage = new Image();
    emotionImage.src = "https://lh3.googleusercontent.com/fife/AAWUweW6pbNzOvTblEsR7Qx3IN4pNNXaEP1nJTUu7XyEAo4-jKsdDpRRyfkPnA5iF8xtXayxZQ_ccyVr2GM228g80vOz5nSs-ifLfEyqwzwUuHhagLUkw6vOcXfPRBgAaJRbdCEGtcBdO_gUAcPZA15W5r7aZLF7r5Xbql_CjEGiJEDeuMfjGfhTiMfAKuAWjiLSi_d6YWub-Qcs23Akg4u-UJDj3HEs3toypo8dScos1uys36eCmwYle1zRYX3t8Yv6lA1PgB5H8alkN68_RfkMeI6OExxqu3CE1MTcIETlwZPQJIGYHByCx0J3xjCrR3SO4ZYXYpuGd_MSdw_OBdi0Z-CaYxry14z6iWpOOmctoCVLcB7lqU1kktUgy1w7OitrQ3a2TraumCa6SJ_kaTDLbr8196GlNxuJ5qwG0nFjlyy_WBVnPT9Vy_oAWoI-K7Xg2_5ztZVPX7OgXSJjXS0V9QIbedDlErigNbfzPbxfTTYyLoVvIkf6v8A5LFI61evhB_-uUyfUGr7KNqd9wBDLouXrFp77uCy9Qv6aaSs-uMoMKL4PuqyRF7mBYjEedVDBTrmLMLrzhH1wtdA4rOEtx-TnT_J1YHFSdWMHBGrgnSqauYcG-1l8jNTNc7rYp3grH9DyWdGtMSRdgscet5jImzUmLUjYlwRf7alKUdJ3-6LSPdZE6PVWclWMo8CWnMg-oTjjmiw59-WnMLI_tdi4ecHjNd7fuSC6NUc=w2000-h1510-ft";

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

    imageDiv.appendChild(emotionImage)
}