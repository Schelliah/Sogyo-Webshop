function getPrice(order,attraction){
    let totalprice = attraction.adultPrice *order.numberOfParents +   attraction.kidsPrice * order.numberOfChildren;
    if(order.numberOfParents>= attraction.minimumNumberOfAdults  && order.numberOfChildren>= attraction.minimumNumberOfKids ) {
    totalprice -=  (attraction.minimumNumberOfKids*attraction.kidsPrice + attraction.minimumNumberOfAdults * attraction.adultPrice) * (attraction.discount/100) ;
    }
    return totalprice;
}

function getOrderprice(order, attractions){
    let attraction=findAttraction(order, attractions);
    return getPrice(order,attraction)
}

function sum(total, current){
    return total + current;
}

async function setPrice(){
    let orders=JSON.parse(localStorage.getItem("shoppingBasket"));
    var attractions = await getAttractionsFromServer();
    let totalprice=orders.map(order => getOrderprice(order,attractions)).reduce(sum);
    totalpriceLocation=document.querySelector("main").children[1].children[0];
    totalpriceLocation.innerHTML = totalprice;
}

function findAndRemove(name){
    let ordersString = localStorage.getItem("shoppingBasket");
    let orders=JSON.parse(ordersString);
    orders=orders.filter(e => e.nameAttraction!=name)
    localStorage.setItem("shoppingBasket", JSON.stringify(orders));
}

function readFromStorage(){
    let ordersString = localStorage.getItem("shoppingBasket");
    let orders=JSON.parse(ordersString);
    let template=document.querySelector("#ticket")
    let content=template.content;
    //if (orders){
    orders.forEach(element => { addOrderToBaskerDisplay(content,element.nameAttraction, element.numberOfParents, element.numberOfChildren )
    });
    //}
}

function addOrderToBaskerDisplay(content,nameAttraction, numberOfParents, numberOfChildren ){
    content=content.cloneNode(true);

    let name=content.querySelector("div");
    let adults = name.nextElementSibling;
    let children = adults.nextElementSibling;

    name.innerHTML += nameAttraction;
    adults.innerHTML +=  numberOfParents;
    children.innerHTML +=   numberOfChildren;
    document.querySelector("main").querySelector("#orderlist").appendChild(content);
}

async function payOrders(){
    try{
        const response= await fetch("/api/placeorder", {method: "POST", headers: {'Content-Type': "application/json" }
        ,body: localStorage.getItem("shoppingBasket")}) ;
        console.log(response)
        window.location.href="orderplaced.html";
    } catch(e){
        console.log(e);
    }

}

function removeOrder(event){
    let name =event.target.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
    name=name.substring(10)
    findAndRemove(name)

    event.target.parentNode.remove()
}


readFromStorage()

let payButton=document.querySelector("main").querySelector("#finalizepaymentbutton");
payButton.addEventListener("click",payOrders,false);


let cancelButtons=document.querySelector("main").querySelector("#orderlist").querySelectorAll("button");
cancelButtons.forEach(button => button.addEventListener("click",removeOrder, false));

setPrice()