function showHidePass() {
    const passInput = document.getElementById("Pass");
    const confPassInput = document.getElementById('confPass');

    (passInput.type === 'password')? passInput.type = 'text' : passInput.type = 'password';

    if(confPassInput !== null){
        (confPassInput.type === 'password')? confPassInput.type = 'text' : confPassInput.type = 'password';
    }
};
function nextPage(pageBtn){
    window.location.href =`?page=${pageBtn.value}`;
};

function clickedBtn(){
    const urlParams = new URLSearchParams(window.location.search);

    let pageNumber = urlParams.get('page') || 1;
    const bbtn = document.querySelector(`button[value = "${pageNumber}"]`);

    bbtn.disabled = true;
    bbtn.style.cursor = "unset";
    bbtn.style.background = "#122847";
    bbtn.style.boxShadow  = "0 0 5px rgb(87, 196, 177)";
    bbtn.style.color = "rgb(87, 196, 177)";
    bbtn.style.animation = 'pulse 1s infinite';
};

