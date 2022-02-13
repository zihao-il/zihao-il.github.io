const linkUi = [].slice.apply(document.querySelectorAll("main > ul >li"));

linkUi.shift();

linkUi.forEach((li)=>{
    const span = document.createElement("span");
    span.classList.add("spanLine");

    li.parentElement.insertBefore(span,li);
});