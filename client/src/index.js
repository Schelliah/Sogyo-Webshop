
function hasEnoughTicketsLeft(order,attraction){
    let orderInBasket=JSON.parse(localStorage.getItem("shoppingBasket")).find(e => e.name==order.name);
    let amountAlreadyInBasket = 0;
    if(orderInBasket){
        amountAlreadyInBasket = orderInBasket.numberOfParents +  orderInBasket.numberOfChildren
    }
    return order.numberOfParents +  order.numberOfChildren + amountAlreadyInBasket <= attraction.available;
}

function forceZeroIfNull(maybeNumberString){
    let maybeNumber = parseInt(maybeNumberString)
    if(!maybeNumber){
        return 0;
    }
    return maybeNumber;
}

function getAttractionOrderInfo(buttonElement){
    var numberOfParents = forceZeroIfNull(buttonElement.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.value); //need to rewrite to use parentnode for shorter code
    var numberOfChildren = forceZeroIfNull(buttonElement.previousElementSibling.previousElementSibling.value);
    var nameAttraction = buttonElement.parentNode.previousElementSibling.previousElementSibling.innerText
    const order = {nameAttraction:  nameAttraction, numberOfParents: numberOfParents, numberOfChildren: numberOfChildren}
    return order;
}

function orderButtonClicked(event){
    console.log("order button clicked")
    order=getAttractionOrderInfo(event.target)
    if(order.numberOfChildren!=0 || order.numberOfParents!=0) {
        saveOrderInShoppingBasket(order);
    }
}

async function orderChanged(buttonElement){
    order=getAttractionOrderInfo(buttonElement);
    let attractions  = await getAttractionsFromServer()
    let attraction = findAttraction(order, attractions);

    let totalPriceLocation=buttonElement.previousElementSibling.children[1];
    totalPriceLocation.innerHTML = getTotalPrice(order,attraction);
    //buttonElement.disabled=!hasEnoughTicketsLeft(order, attraction);
}

function saveOrderInShoppingBasket(order){
    let ordersString = localStorage.getItem("shoppingBasket")
    let orders = ordersString ? JSON.parse(ordersString) : [];
    let sameOrder=orders.find(e => e.nameAttraction==order.nameAttraction);
    if(sameOrder!=null){
        console.log("adding tickets")
        sameOrder.numberOfParents +=  order.numberOfParents;
        sameOrder.numberOfChildren += order.numberOfChildren;
    } else {
        console.log("make new")
        orders.push(order);
    }
    document.querySelector("#shoppingbasket").childNodes[1].innerHTML=orders.length;
    localStorage.setItem("shoppingBasket", JSON.stringify(orders));
}

async function start(){
    let attractions  =await getAttractionsFromServer()

    let template=document.querySelector("#orderstemplate")
    let content=template.content;
    attractions.forEach(attraction => addOrderToBaskerDisplay(content,attraction) );

    const buttons = Array.from(document.querySelector("main").querySelectorAll(".orderbutton"));
    buttons.forEach((button) =>{ button.addEventListener("click", orderButtonClicked,false) });

    setListenersForChangeInput();
}

function setListenersForChangeInput(){
    const inputAdult = Array.from(document.querySelector("main").querySelectorAll(".numberofadults"));
    inputAdult.forEach((input) =>{ input.addEventListener("input", (e)=>{
        orderChanged(e.target.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling)
    },false) });

    const inputKid = Array.from(document.querySelector("main").querySelectorAll(".numberofkids"));
    inputKid.forEach((input) =>{ input.addEventListener("input", (e)=>{
        orderChanged(e.target.nextElementSibling.nextElementSibling)
    },false) });
}

function addOrderToBaskerDisplay(content,attraction){
    content=content.cloneNode(true);

    let name = content.querySelector("div");
    let description = name.nextElementSibling;

    let prices= description.nextElementSibling.querySelector(".prices")
    let adultPrice =  prices.querySelector(".adultprice").querySelector(".price")
    let kidsPrice = prices.querySelector(".kidsprice").querySelector(".price")

    let requirements = prices.querySelector(".discountrequirement")
    let minimumNumberOfAdults = requirements.querySelector(".adults")
    let minimumNumberOfKids = minimumNumberOfAdults.nextElementSibling

    let discount = minimumNumberOfKids.nextElementSibling
    let button= prices.nextElementSibling

    name.innerHTML = attraction.name;
    description.innerHTML = attraction.description;
    adultPrice.innerHTML = attraction.adultPrice;
    kidsPrice.innerHTML = attraction.kidsPrice;
    minimumNumberOfAdults.innerHTML = attraction.minimumNumberOfAdults;
    minimumNumberOfKids.innerHTML = attraction.minimumNumberOfKids;
    discount.innerHTML = attraction.discount;
    
    document.querySelector("main").appendChild(content);
}


start()


 