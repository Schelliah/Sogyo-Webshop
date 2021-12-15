window.addEventListener("scroll", stickyHeader, false);
var header = document.getElementById("stickyheader");

function stickyHeader(){ //from w3schools
    if(window.pageYOffset > header.offsetTop){
        header.classList.add("sticky");
        console.log("scrolling below")
    }
    else {
        header.classList.remove("sticky");
        console.log("scrolling above")
    }

}

async function getAttractionsFromServer(){
    try {
        const response = await fetch("/api/attractions");
        var attractions  =await response.json();
    } catch (error) {
        console.log(error)
    }
     return attractions;
}

function getTotalPrice(order,attraction){
    let totalprice = attraction.adultPrice *order.numberOfParents +   attraction.kidsPrice * order.numberOfChildren;
    if(order.numberOfParents>= attraction.minimumNumberOfAdults  && order.numberOfChildren>= attraction.minimumNumberOfKids ) {
    totalprice -=  (attraction.minimumNumberOfKids*attraction.kidsPrice + attraction.minimumNumberOfAdults * attraction.adultPrice) * (attraction.discount/100) ;
    }
    return totalprice;
}

function findAttraction(order, attractions){
    return attractions.find(e => e.name.toUpperCase() ==order.nameAttraction);
}