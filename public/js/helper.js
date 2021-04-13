function showHidePass() {
    const passInput = document.getElementById("Pass");
    const confPassInput = document.getElementById('confPass');

    (passInput.type === 'password')? passInput.type = 'text' : passInput.type = 'password';

    if(confPassInput !== null){
        (confPassInput.type === 'password')? confPassInput.type = 'text' : confPassInput.type = 'password';
    }
};

