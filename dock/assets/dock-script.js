const broadcast = new BroadcastChannel('broadcast');

console.log("Dock script loaded");

function setEvent () {
    let eventName = document.getElementById('input-event').value;
    broadcast.postMessage({title: eventName});
    console.log("Title: " + eventName);
}

function bottomline () {
    console.log("Bottomline");
    broadcast.postMessage({bottomline: 'bottomline'});
}

function gc() {
    let name = document.getElementById('input-name').value;
    let desc = document.getElementById('input-desc').value;
    broadcast.postMessage({gc: {name: name, desc: desc}});
}

document.addEventListener('DOMContentLoaded', function () {
    const radioButtonForm = document.querySelector('input[name="link_type"][value="form"]');
    const radioButtonLink = document.querySelector('input[name="link_type"][value="link"]');
    const linkTitle = document.getElementById('link-title');
    const button = document.getElementById('button-form');

    radioButtonForm.addEventListener('change', function() {
        if (radioButtonForm.checked) {
            linkTitle.style.visibility = 'hidden';
            button.innerText = 'Exibir formulário';
        }
    });
    radioButtonLink.addEventListener('change', function() {
        console.log("Change");
        if (radioButtonLink.checked) {
            linkTitle.style.visibility = 'visible';
            button.innerText = 'Exibir site';
        }
    });
});


function setLink () {  
    let linkTitle = document.getElementById('link-title').value;
    let linkUrl = document.getElementById('link-url').value;
    broadcast.postMessage({link: {title: linkTitle, url: linkUrl}});
}


